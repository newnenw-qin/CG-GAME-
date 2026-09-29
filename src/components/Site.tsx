"use client";

import Background from "@/components/Background";
import Chapters from "@/components/Chapters";
import Intro from "@/components/Intro";
import World from "@/components/World";
import { portals, sceneMark, type SceneId } from "@/data/content";
import { asset } from "@/lib/asset";
import { sound } from "@/lib/sound";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";

const EmberField = dynamic(() => import("@/components/EmberField"), { ssr: false });

type Origin = { x: number; y: number };

class QuietBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export default function Site() {
  const [scene, setScene] = useState<SceneId>("intro");
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [ready, setReady] = useState(false);
  const [embers, setEmbers] = useState(false);
  const [booted, setBooted] = useState(false);
  const veilRef = useRef<HTMLDivElement>(null);
  const introTl = useRef<gsap.core.Timeline | null>(null);
  const busy = useRef(false);
  const entered = useRef(false);
  const sceneRef = useRef<SceneId>("intro");

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setEmbers(wide && !reduce);

    const fire = document.getElementById("intro-fire");
    const copy = document.getElementById("intro-copy");
    const plate = document.getElementById("plate");
    if (reduce) {
      if (plate) gsap.set(plate, { opacity: 1 });
      if (fire) gsap.set(fire, { opacity: 1 });
      if (copy) gsap.set(copy, { opacity: 1 });
      setReady(true);
      setBooted(true);
      return;
    }
    if (fire) gsap.set(fire, { opacity: 0 });
    if (copy) gsap.set(copy, { opacity: 0 });
    if (plate) gsap.set(plate, { opacity: 0 });
    const timeline = gsap.timeline({ onComplete: () => setBooted(true) });
    introTl.current = timeline;
    if (fire) timeline.to(fire, { opacity: 1, duration: 1.8, ease: "power1.out" }, 0.55);
    if (plate) timeline.to(plate, { opacity: 1, duration: 2.8, ease: "power2.inOut" }, 1.45);
    if (copy) timeline.to(copy, { opacity: 1, duration: 1.4, ease: "power1.out" }, 3.15);
    timeline.add(() => setReady(true), 2.3);
    return () => {
      timeline.kill();
    };
  }, []);

  useEffect(() => {
    if (scene === "intro") return;
    const level = scene === "world" ? 0.7 : 0.28;
    gsap.to("#plate", { opacity: level, duration: 1.05, ease: "power1.inOut" });
  }, [scene]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || scene === "intro" ? "hidden" : "";
    const mark = scene === "intro" ? "Enter the Unknown" : sceneMark(scene).label;
    document.title = `Qin Ziwen — ${mark}`;
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, scene]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Enter" && sceneRef.current === "intro" && ready) {
        const fire = document.getElementById("intro-fire");
        const rect = fire?.getBoundingClientRect();
        void enter(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready]);

  function travel(next: SceneId, origin?: Origin) {
    if (busy.current || next === sceneRef.current) return;
    busy.current = true;
    sound().transition();
    sound().setScene(next);
    const veil = veilRef.current;
    const fire = veil?.querySelector(".veil-fire") as HTMLElement | null;
    const black = veil?.querySelector(".veil-black") as HTMLElement | null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!veil || !fire || !black || reduce) {
      setScene(next);
      setMenuOpen(false);
      window.scrollTo(0, 0);
      busy.current = false;
      return;
    }
    if (origin) {
      fire.style.left = `${origin.x}px`;
      fire.style.top = `${origin.y}px`;
    }
    const timeline = gsap.timeline({
      onComplete: () => {
        busy.current = false;
      },
    });
    timeline.set(veil, { opacity: 1 });
    timeline.fromTo(fire, { scale: 0.15, opacity: 0.2 }, { scale: 2.8, opacity: 1, duration: 0.48, ease: "power2.in" });
    timeline.to(black, { opacity: 1, duration: 0.32, ease: "power1.in" }, "-=0.12");
    timeline.add(() => {
      setScene(next);
      setMenuOpen(false);
      window.scrollTo(0, 0);
    });
    timeline.to(black, { opacity: 0, duration: 0.48, ease: "power1.out" }, "+=0.06");
    timeline.to(fire, { opacity: 0, duration: 0.36 }, "<");
    timeline.set(veil, { opacity: 0 });
  }

  async function enter(origin?: Origin) {
    if (!ready || busy.current) return;
    introTl.current?.kill();
    setBooted(true);
    if (!entered.current) {
      entered.current = true;
      void sound()
        .unlock()
        .then(() => {
          setSoundOn(true);
          sound().setScene("world");
          sound().thump();
        })
        .catch(() => setSoundOn(false));
    } else {
      sound().thump();
    }
    travel("world", origin);
  }

  async function toggleSound() {
    const on = await sound().toggle();
    setSoundOn(on);
    if (on) sound().setScene(sceneRef.current);
  }

  function openMenu() {
    setMenuOpen(true);
    sound().menu();
  }

  const mark = sceneMark(scene);

  return (
    <div data-scene={scene} className="relative min-h-screen">
      <QuietBoundary>
        <Background />
      </QuietBoundary>
      {embers && (
        <QuietBoundary>
          <EmberField />
        </QuietBoundary>
      )}

      {scene === "intro" ? (
        <Intro ready={ready} onEnter={enter} />
      ) : (
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {scene === "world" ? <World onEnter={travel} /> : <Chapters scene={scene} go={travel} />}
        </motion.div>
      )}

      {booted && (
        <button
          className="fixed bottom-5 right-5 z-40 px-2 py-3 text-[10px] tracking-[0.32em] text-[#d4b483] transition-colors hover:text-[#f6f1e8]"
          onClick={() => void toggleSound()}
          aria-pressed={soundOn}
        >
          {soundOn ? "SOUND ON" : "SOUND OFF"}
        </button>
      )}

      {scene !== "intro" && (
        <>
          <button
            className="fixed left-5 top-6 z-40 text-[11px] tracking-[0.42em] text-[#f4ecdf]/80 md:left-8"
            onClick={(event) => travel("world", { x: event.clientX, y: event.clientY })}
          >
            QIN
          </button>
          <button
            className="fixed right-5 top-6 z-40 text-[11px] tracking-[0.42em] text-[#f4ecdf]/80 md:right-8"
            onClick={openMenu}
            aria-expanded={menuOpen}
          >
            MENU
          </button>
          {scene !== "world" && (
            <p className="fixed bottom-6 left-5 z-40 text-[10px] tracking-[0.32em] text-[#f4ecdf]/55 md:left-8">
              {mark.index} / {mark.label}
            </p>
          )}
        </>
      )}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[#050403]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: `url(${asset("/cover.jpg")})`,
                backgroundSize: "cover",
                backgroundPosition: "72% 30%",
                filter: "brightness(0.45) saturate(0.7)",
              }}
            />
            <button className="absolute right-5 top-6 text-[11px] tracking-[0.42em] md:right-8" onClick={() => setMenuOpen(false)}>
              CLOSE
            </button>
            <nav className="flex h-full flex-col justify-center overflow-y-auto px-7 py-24 md:px-24" aria-label="目录">
              {portals.map((portal, index) => (
                <motion.button
                  key={portal.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * index, duration: 0.45 }}
                  className="group flex items-baseline gap-5 border-b border-white/10 py-3 text-left md:gap-8 md:py-4"
                  onMouseEnter={() => sound().hover()}
                  onClick={(event) => travel(portal.id, { x: event.clientX, y: event.clientY })}
                >
                  <span className="w-8 text-[10px] tracking-[0.24em] text-[#d4b483]">{portal.index}</span>
                  <span className="text-[clamp(1.5rem,4vw,3rem)] font-extralight tracking-[0.16em] text-[#f6f1e8] transition-colors group-hover:text-[#f0c98a]">
                    {portal.label}
                  </span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={veilRef} className="veil" aria-hidden>
        <div className="veil-fire" />
        <div className="veil-black" />
      </div>
    </div>
  );
}
