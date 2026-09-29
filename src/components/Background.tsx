"use client";

import { asset } from "@/lib/asset";
import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  v: number;
  a: number;
};

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOn, setVideoOn] = useState(false);
  const [failed, setFailed] = useState(false);
  const nearRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setVideoOn(!reduce && !narrow && !saveData);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoOn || failed) return;
    let cancel = false;
    const play = video.play();
    if (play) {
      play.catch((error: { name?: string }) => {
        if (cancel || error?.name === "AbortError") return;
        setFailed(true);
      });
    }
    return () => {
      cancel = true;
    };
  }, [videoOn, failed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const plate = plateRef.current;
    if (!canvas || !plate) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const count = narrow ? 36 : 78;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.3 + 0.25,
      v: Math.random() * 0.00009 + 0.000025,
      a: Math.random() * 0.32 + 0.05,
    }));

    const pointer = { x: 0.5, y: 0.5 };
    let scroll = 0;
    let raf = 0;
    let width = 1;
    let height = 1;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.floor(window.innerWidth * ratio * 0.7);
      height = Math.floor(window.innerHeight * ratio * 0.7);
      canvas.width = width;
      canvas.height = height;
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
      const dx = (pointer.x - 0.5) * 2;
      const dy = (pointer.y - 0.5) * 2;
      document.documentElement.style.setProperty("--px", dx.toFixed(4));
      document.documentElement.style.setProperty("--py", dy.toFixed(4));
      const fire = document.getElementById("intro-fire");
      if (fire) {
        const rect = fire.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(event.clientX - cx, event.clientY - cy);
        const hot = dist < 170;
        nearRef.current = hot;
        fire.classList.toggle("is-hot", hot);
        document.documentElement.classList.toggle("is-near", hot);
        const heat = Math.max(0, 1 - dist / 280);
        document.documentElement.style.setProperty("--heat", heat.toFixed(3));
        document.documentElement.style.setProperty("--hx", `${(cx / window.innerWidth) * 100}%`);
        document.documentElement.style.setProperty("--hy", `${(cy / window.innerHeight) * 100}%`);
      }
    };

    const onScroll = () => {
      scroll = window.scrollY;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const started = performance.now();
    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const mx = pointer.x * width;
      const my = pointer.y * height;
      for (const particle of particles) {
        if (!reduce) particle.y -= particle.v * (nearRef.current ? 2.1 : 1);
        if (particle.y < 0) particle.y = 1;
        let x = particle.x * width;
        let y = particle.y * height;
        const dist = Math.hypot(x - mx, y - my);
        const reach = 110 * (width / window.innerWidth);
        if (dist < reach && dist > 0.001) {
          const force = (1 - dist / reach) * 14;
          x += ((x - mx) / dist) * force;
          y += ((y - my) / dist) * force;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(244, 214, 176, ${particle.a})`;
        ctx.arc(x, y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const elapsed = (time - started) / 1000;
      const dx = (pointer.x - 0.5) * -22;
      const dy = (pointer.y - 0.5) * -14 - scroll * 0.045;
      const breathe = reduce || videoOn ? 1.06 : 1.045 + Math.sin(elapsed * 0.08) * 0.02;
      plate.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${breathe})`;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [videoOn]);

  return (
    <>
      <div id="plate" ref={plateRef}>
        <img src={asset("/cover.jpg")} alt="" className="media" />
        {videoOn && !failed && (
          <video
            ref={videoRef}
            className="media"
            autoPlay
            muted
            loop
            playsInline
            poster={asset("/cover.jpg")}
            onError={() => setFailed(true)}
          >
            <source src={asset("/video/bg.mp4")} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="smoke" />
      <div className="scrim" />
      <canvas ref={canvasRef} className="dust" />
      <div className="grain" />
      <div className="vignette" />
      <div className="heat" />
    </>
  );
}
