"use client";

import { useEffect, useMemo, useState } from "react";

const RINGS = 30;
const TILT = 0.42;
const RADIUS = 132;
const round = (value: number) => Number(value.toFixed(3));

export default function Globe() {
  const [angle, setAngle] = useState(0.6);

  const points = useMemo(() => {
    const result: {
      x: number;
      y: number;
      opacity: number;
      radius: number;
    }[] = [];

    const ct = Math.cos(TILT);
    const st = Math.sin(TILT);

    for (let i = 0; i < RINGS; i++) {
      const lat = -Math.PI / 2 + (Math.PI * (i + 0.5)) / RINGS;
      const count = Math.max(6, Math.round(2 * RINGS * Math.cos(lat)));

      for (let j = 0; j < count; j++) {
        const lon = (2 * Math.PI * j) / count + angle;

        const x = Math.cos(lat) * Math.sin(lon);
        const y0 = Math.sin(lat);
        const z0 = Math.cos(lat) * Math.cos(lon);

        const y = y0 * ct - z0 * st;
        const z = y0 * st + z0 * ct;

        result.push({
          x: 150 + x * RADIUS,
          y: 150 - y * RADIUS,
          opacity: z >= 0 ? 0.22 + 0.78 * z : 0.07,
          radius: z >= 0 ? 0.8 + 0.9 * z : 0.6,
        });
      }
    }

    return result;
  }, [angle]);

useEffect(() => {
  let frame = 0;
  let lastUpdate = 0;
  let currentAngle = 0.6;

  const animate = (time: number) => {
    if (time - lastUpdate >= 33) {
      currentAngle += 0.018;
      setAngle(currentAngle);
      lastUpdate = time;
    }

    frame = requestAnimationFrame(animate);
  };

  frame = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(frame);
  };
}, []);
  return (
    <svg
      className="globe"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="globe-dots">
        {points.map((point, index) => (
          <circle
            key={index}
            cx={round(point.x)}
            cy={round(point.y)}
            r={round(point.radius)}
            fill="currentColor"
            opacity={round(point.opacity)}
          />
        ))}
      </g>
    </svg>
  );
}
