"use client";

import { useRef } from "react";
import ChromeStar from "./ChromeStar";

// Your photo, shown as is. On hover: 3D tilt that follows the cursor, a holographic sheen,
// a glare spot, an RGB-split glitch, and chrome stars that pop out.
export default function PhotoTilt({ src, alt }: { src: string; alt: string }) {
  const root = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = root.current;
    if (!el || e.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", String(px * 100));
    el.style.setProperty("--my", String(py * 100));
    el.style.setProperty("--ry", `${(px - 0.5) * 30}deg`);
    el.style.setProperty("--rx", `${-(py - 0.5) * 30}deg`);
    el.style.setProperty("--dx", String((px - 0.5) * 2));
    el.style.setProperty("--dy", String((py - 0.5) * 2));
  };

  const leave = () => {
    const el = root.current;
    if (!el) return;
    for (const v of ["--mx", "--my", "--ry", "--rx", "--dx", "--dy"]) el.style.removeProperty(v);
  };

  return (
    <div className="photo" ref={root} onPointerMove={move} onPointerLeave={leave}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="photo-defs">
        <filter id="photo-red" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
        <filter id="photo-cyan" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </svg>

      <div className="photo-tilt">
        <div className="photo-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="photo-img" src={src} alt={alt} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="photo-ghost photo-ghost-r" src={src} alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="photo-ghost photo-ghost-c" src={src} alt="" aria-hidden="true" />
          <span className="photo-sheen" aria-hidden="true" />
          <span className="photo-glare" aria-hidden="true" />
        </div>
        <span className="photo-spark s1" aria-hidden="true"><ChromeStar id="ph1" orbit={false} /></span>
        <span className="photo-spark s2" aria-hidden="true"><ChromeStar id="ph2" orbit={false} /></span>
        <span className="photo-spark s3" aria-hidden="true"><ChromeStar id="ph3" orbit={false} /></span>
      </div>
    </div>
  );
}
