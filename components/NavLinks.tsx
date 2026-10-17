"use client";

import { useEffect, useState } from "react";

const items = ["home", "about", "projects", "socials", "blog"];

export default function NavLinks() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = items.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="nav mono" aria-label="Sections">
      {items.map((id) => (
        <a
          key={id}
          href={`/#${id}`}
          className={active === id ? "active" : undefined}
          aria-current={active === id ? "true" : undefined}
        >
          {id}
        </a>
      ))}
    </nav>
  );
}
