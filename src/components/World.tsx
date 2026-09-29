"use client";

import { portals, type SceneId } from "@/data/content";
import { sound } from "@/lib/sound";

type Origin = { x: number; y: number };

export default function World({ onEnter }: { onEnter: (id: SceneId, origin?: Origin) => void }) {
  return (
    <section className="relative z-10 min-h-[100dvh] md:h-[100dvh] md:overflow-hidden">
      <div className="px-6 pt-28 md:px-14">
        <p className="text-[10px] tracking-[0.48em] text-[#d4b483]">THE UNKNOWN</p>
        <h1 className="mt-4 max-w-xl text-[clamp(1.6rem,3vw,2.4rem)] font-extralight leading-snug tracking-[0.14em] text-[#f6f1e8]">
          选择一处火光
        </h1>
        <span className="rule" />
      </div>

      <div className="mt-10 px-6 pb-24 md:hidden">
        {portals.map((portal) => (
          <button
            key={portal.id}
            className="flex w-full items-center gap-5 border-t border-[#d4b483]/15 py-5 text-left"
            onMouseEnter={() => sound().hover()}
            onClick={(event) => onEnter(portal.id, { x: event.clientX, y: event.clientY })}
          >
            <span className="flame flame-sm" />
            <span className="text-[13px] tracking-[0.32em]">{portal.label}</span>
            <span className="ml-auto text-[10px] tracking-[0.28em] text-[#d4b483]">{portal.index}</span>
          </button>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 hidden md:block">
        {portals.map((portal) => (
          <button
            key={portal.id}
            className="portal pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
            style={{ left: portal.x, top: portal.y }}
            onMouseEnter={() => sound().hover()}
            onClick={(event) => onEnter(portal.id, { x: event.clientX, y: event.clientY })}
          >
            <span className="flame" />
            <span className="text-[10px] tracking-[0.34em] text-[#f4ecdf]/75 transition-colors duration-300 hover:text-[#f3d7a4]">
              {portal.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
