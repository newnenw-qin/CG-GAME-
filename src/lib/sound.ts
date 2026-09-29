type Mix = { music: number; fire: number; air: number; tone: number };

const mixes: Record<string, Mix> = {
  intro: { music: 0.1, fire: 1, air: 0.72, tone: 0.0001 },
  world: { music: 0.62, fire: 0.85, air: 0.5, tone: 0.0001 },
  tme: { music: 0.5, fire: 0.32, air: 0.4, tone: 0.045 },
  research: { music: 0.34, fire: 0.16, air: 0.22, tone: 0.0001 },
  default: { music: 0.46, fire: 0.3, air: 0.36, tone: 0.0001 },
};

function mixFor(scene: string): Mix {
  return mixes[scene] ?? mixes.default;
}

export class Soundscape {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private fireBus: GainNode | null = null;
  private air: GainNode | null = null;
  private tone: GainNode | null = null;
  private sfx: GainNode | null = null;
  private enabled = false;
  private started = false;
  private lastHover = 0;
  private crackleTimer = 0;
  private stoneTimer = 0;

  get isOn() {
    return this.enabled;
  }

  private build() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    this.master = master;

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.26;
    const damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 1400;
    delay.connect(feedback);
    feedback.connect(damp);
    damp.connect(delay);
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.35;
    delay.connect(delayGain);
    delayGain.connect(master);

    this.music = ctx.createGain();
    this.music.gain.value = 0.12;
    this.music.connect(master);
    this.music.connect(delay);

    this.fireBus = ctx.createGain();
    this.fireBus.gain.value = 0.8;
    this.fireBus.connect(master);

    this.air = ctx.createGain();
    this.air.gain.value = 0.6;
    this.air.connect(master);

    this.tone = ctx.createGain();
    this.tone.gain.value = 0.0001;
    this.tone.connect(master);

    this.sfx = ctx.createGain();
    this.sfx.gain.value = 0.9;
    this.sfx.connect(master);

    const pad = [
      { f: 73.42, g: 0.045, type: "sine" as OscillatorType },
      { f: 110, g: 0.03, type: "sine" as OscillatorType },
      { f: 146.83, g: 0.02, type: "triangle" as OscillatorType },
      { f: 164.81, g: 0.014, type: "sine" as OscillatorType },
      { f: 220, g: 0.008, type: "sine" as OscillatorType },
    ];
    for (const voice of pad) {
      const osc = ctx.createOscillator();
      osc.type = voice.type;
      osc.frequency.value = voice.f;
      const gain = ctx.createGain();
      gain.gain.value = voice.g;
      osc.connect(gain);
      gain.connect(this.music);
      osc.start();
    }

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain);
    const high = ctx.createOscillator();
    high.type = "sine";
    high.frequency.value = 293.66;
    const highGain = ctx.createGain();
    highGain.gain.value = 0.012;
    lfoGain.connect(highGain.gain);
    high.connect(highGain);
    highGain.connect(this.music);
    lfo.start();
    high.start();

    const toneOsc = ctx.createOscillator();
    toneOsc.type = "sine";
    toneOsc.frequency.value = 329.63;
    toneOsc.connect(this.tone);
    toneOsc.start();

    const noise = ctx.createBufferSource();
    noise.buffer = this.makeNoise(4);
    noise.loop = true;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = "bandpass";
    airFilter.frequency.value = 680;
    airFilter.Q.value = 0.45;
    const airGain = ctx.createGain();
    airGain.gain.value = 0.05;
    noise.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(this.air);
    noise.start();

    const airLfo = ctx.createOscillator();
    airLfo.frequency.value = 0.04;
    const airLfoGain = ctx.createGain();
    airLfoGain.gain.value = 180;
    airLfo.connect(airLfoGain);
    airLfoGain.connect(airFilter.frequency);
    airLfo.start();
  }

  private makeNoise(seconds: number) {
    const ctx = this.ctx!;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    return buffer;
  }

  private startLoops() {
    if (this.started) return;
    this.started = true;
    const crack = () => {
      if (this.enabled) this.crackle();
      this.crackleTimer = window.setTimeout(crack, 240 + Math.random() * 640);
    };
    const stone = () => {
      if (this.enabled) this.stone();
      this.stoneTimer = window.setTimeout(stone, 9000 + Math.random() * 7000);
    };
    crack();
    stone();
  }

  private crackle() {
    const ctx = this.ctx;
    const bus = this.fireBus;
    if (!ctx || !bus) return;
    const dur = 0.04 + Math.random() * 0.07;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 700 + Math.random() * 1900;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.value = 0.03 + Math.random() * 0.045;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(bus);
    src.start();
  }

  private stone() {
    const ctx = this.ctx;
    const bus = this.sfx;
    if (!ctx || !bus) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 180 + Math.random() * 40;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(bus);
    osc.start();
    osc.stop(now + 0.52);
  }

  async unlock() {
    if (!this.ctx) this.build();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.startLoops();
    if (this.enabled) return;
    this.enabled = true;
    const now = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(0.0001, now);
    this.master!.gain.exponentialRampToValueAtTime(0.82, now + 2.5);
  }

  mute() {
    this.enabled = false;
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0.0001, now, 0.15);
  }

  async toggle() {
    if (this.enabled) {
      this.mute();
      return false;
    }
    await this.unlock();
    return true;
  }

  setScene(scene: string) {
    if (!this.ctx || !this.music || !this.fireBus || !this.air || !this.tone) return;
    const mix = mixFor(scene);
    const now = this.ctx.currentTime;
    this.music.gain.setTargetAtTime(mix.music, now, 1.1);
    this.fireBus.gain.setTargetAtTime(mix.fire, now, 0.8);
    this.air.gain.setTargetAtTime(mix.air, now, 1);
    this.tone.gain.setTargetAtTime(mix.tone, now, 0.9);
  }

  hover() {
    if (!this.enabled || !this.ctx || !this.sfx) return;
    const nowMs = performance.now();
    if (nowMs - this.lastHover < 110) return;
    this.lastHover = nowMs;
    const ctx = this.ctx;
    const dur = 0.18;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.8;
    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(1700, now + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfx);
    src.start();
  }

  thump() {
    if (!this.enabled || !this.ctx || !this.sfx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(96, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.28);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
    osc.connect(gain);
    gain.connect(this.sfx);
    osc.start();
    osc.stop(now + 0.36);
  }

  transition() {
    if (!this.enabled || !this.ctx || !this.sfx) return;
    const ctx = this.ctx;
    const dur = 0.7;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.55;
    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfx);
    src.start();
  }

  menu() {
    this.hover();
    if (!this.ctx || !this.air || !this.enabled) return;
    const now = this.ctx.currentTime;
    this.air.gain.cancelScheduledValues(now);
    this.air.gain.setTargetAtTime(0.7, now, 0.2);
    window.setTimeout(() => {
      if (this.ctx && this.air && this.enabled) {
        this.air.gain.setTargetAtTime(mixFor("world").air, this.ctx.currentTime, 0.6);
      }
    }, 700);
  }

  dispose() {
    window.clearTimeout(this.crackleTimer);
    window.clearTimeout(this.stoneTimer);
    void this.ctx?.close();
    this.ctx = null;
  }
}

let instance: Soundscape | null = null;

export function sound() {
  if (!instance) instance = new Soundscape();
  return instance;
}
