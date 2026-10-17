"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Horizontal scroller: native scroll-snap, arrow buttons, progress bar, edge fades.
// Children must be <li> elements.
export default function Rail({ label, children }: { label: string; children: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [s, setS] = useState({ overflow: false, start: true, end: true, progress: 0 });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setS({
      overflow: max > 2,
      start: el.scrollLeft <= 2,
      end: el.scrollLeft >= max - 2,
      progress: max > 0 ? Math.min(1, el.scrollLeft / max) : 0,
    });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="rail" data-overflow={s.overflow} data-start={s.start} data-end={s.end}>
      <div className="rail-head" aria-hidden={!s.overflow}>
        <div className="rail-progress">
          <span style={{ transform: `scaleX(${s.progress})` }} />
        </div>
        <div className="rail-btns">
          <button type="button" onClick={() => go(-1)} disabled={s.start} aria-label={`Scroll ${label} left`}>
            ←
          </button>
          <button type="button" onClick={() => go(1)} disabled={s.end} aria-label={`Scroll ${label} right`}>
            →
          </button>
        </div>
      </div>
      <ul className="rail-track" ref={track} onScroll={update} tabIndex={0} aria-label={label}>
        {children}
      </ul>
    </div>
  );
}
