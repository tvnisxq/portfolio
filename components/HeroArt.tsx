"use client";

import { useEffect, useRef } from "react";
import Globe from "./Globe";
import ChromeStar from "./ChromeStar";

// Globe plus chrome star on separate depth layers. Tilts toward the pointer on desktop.
export default function HeroArt() {
  const tilt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tilt.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    )
      return;
    const move = (e: PointerEvent) => {
      el.style.setProperty("--ry", `${(e.clientX / window.innerWidth - 0.5) * 20}deg`);
      el.style.setProperty("--rx", `${-(e.clientY / window.innerHeight - 0.5) * 20}deg`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="art" aria-hidden="true">
      <div className="art-tilt" ref={tilt}>
        <div className="art-globe">
          <Globe />
        </div>
        <div className="art-star">
          <ChromeStar id="hero" />
        </div>
      </div>
    </div>
  );
}
