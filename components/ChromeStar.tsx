// Original chrome four-point star with an orbit ring, drawn as SVG gradients.
export default function ChromeStar({ id = "cs", orbit = true }: { id?: string; orbit?: boolean }) {
  return (
    <svg viewBox="-20 -20 140 140" role="presentation" focusable="false">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.28" stopColor="#8d909b" />
          <stop offset="0.5" stopColor="#14151a" />
          <stop offset="0.72" stopColor="#d6d8df" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={`${id}-ring`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3a3c44" />
          <stop offset="0.45" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#7d808b" />
          <stop offset="1" stopColor="#e9eaef" />
        </linearGradient>
      </defs>
      {orbit ? (
        <ellipse
          cx="50"
          cy="50"
          rx="62"
          ry="19"
          transform="rotate(-24 50 50)"
          fill="none"
          stroke={`url(#${id}-ring)`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="300 60"
        />
      ) : null}
      <path
        d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0Z"
        fill={`url(#${id}-body)`}
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="0.8"
      />
      <path d="M50 8 C52 36 62 46 88 50" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
    </svg>
  );
}
