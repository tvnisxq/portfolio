"use client";

import { useRef } from "react";
import ChromeStar from "./ChromeStar";

// Your photo, shown as is. On hover: 3D tilt that follows the cursor, a silver sheen,
// a glare spot, and chrome stars that pop out.
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
  };

  const leave = () => {
    const el = root.current;
    if (!el) return;
    for (const v of ["--mx", "--my", "--ry", "--rx"]) el.style.removeProperty(v);
  };

  return (
    <div className="photo" ref={root} onPointerMove={move} onPointerLeave={leave}>
      <div className="photo-tilt">
        <div className="photo-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="photo-img" src={src} alt={alt} />
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
