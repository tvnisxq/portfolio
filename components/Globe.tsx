"use client";

import { useEffect, useRef } from "react";

// Dotted rotating globe on a canvas. No libraries. Pauses off-screen, static if reduced motion.
export default function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let color = "#ecebe6";
    const readColor = () => {
      color = getComputedStyle(canvas).color || color;
      if (reduce) draw();
    };

    const pts: [number, number][] = [];
    const rings = 30;
    for (let i = 0; i < rings; i++) {
      const lat = -Math.PI / 2 + (Math.PI * (i + 0.5)) / rings;
      const n = Math.max(6, Math.round(2 * rings * Math.cos(lat)));
      for (let j = 0; j < n; j++) pts.push([lat, (2 * Math.PI * j) / n]);
    }

    let w = 0;
    let h = 0;
    let dpr = 1;
    let angle = 0.6;
    const tilt = 0.42;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);

    function draw() {
      if (!ctx || !w || !h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const R = Math.min(w, h) / 2 - 4;
      const cx = w / 2;
      const cy = h / 2;
      for (const [lat, lon] of pts) {
        const l = lon + angle;
        const x = Math.cos(lat) * Math.sin(l);
        const y0 = Math.sin(lat);
        const z0 = Math.cos(lat) * Math.cos(l);
        const y = y0 * ct - z0 * st;
        const z = y0 * st + z0 * ct;
        ctx.globalAlpha = z >= 0 ? 0.22 + 0.78 * z : 0.07;
        ctx.beginPath();
        ctx.arc(cx + x * R, cy - y * R, z >= 0 ? 0.8 + 0.9 * z : 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw();
    };

    let raf = 0;
    let visible = true;
    let last = performance.now();
    const tick = (t: number) => {
      angle += (t - last) * 0.00018;
      last = t;
      draw();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (reduce || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    readColor();
    resize();
    const mo = new MutationObserver(readColor);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    start();

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="globe" aria-hidden="true" />;
}
