"use client";

import { sound } from "@/lib/sound";

type Origin = { x: number; y: number };

export default function Intro({
  ready,
  onEnter,
}: {
  ready: boolean;
  onEnter: (origin?: Origin) => void;
}) {
  return (
    <section className="fixed inset-0 z-10">
      <span className="sr-only">点击画面中的火光，进入秦子雯的个人作品集。</span>
      <div id="intro-copy" className="absolute left-[7vw] top-[14vh] max-w-[86vw] opacity-0 md:left-[8vw] md:top-[18vh]">
        <h1 className="text-[clamp(2.5rem,7vw,5.6rem)] font-extralight leading-none tracking-[0.28em] text-[#f6f1e8]">
          QIN ZIWEN
        </h1>
        <p className="mt-5 text-[11px] tracking-[0.58em] text-[#f4ecdf]/70 md:mt-6">ENTER THE UNKNOWN</p>
      </div>
      <button
        id="intro-fire"
        className="fire-hit"
        disabled={!ready}
        aria-label="进入作品集"
        onMouseEnter={() => sound().hover()}
        onClick={(event) => onEnter({ x: event.clientX, y: event.clientY })}
      >
        <span className="sparks" aria-hidden>
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="flame" />
        <span className="fire-label">ENTER</span>
      </button>
    </section>
  );
}
