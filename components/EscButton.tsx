"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Glass keycap used as the back button. The real Esc key does the same thing.
export default function EscButton({ href = "/" }: { href?: string }) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, href]);

  return (
    <a
      href={href}
      className="esc-key"
      aria-label="Back (Esc)"
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
      }}
    >
      <span>esc</span>
    </a>
  );
}
