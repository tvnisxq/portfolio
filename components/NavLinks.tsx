"use client";

import { useEffect, useState } from "react";

const items = ["home", "about", "projects", "socials", "blog"] as const;

export default function NavLinks() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = items
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the section most visible in the viewport instead of relying
        // on the order in which IntersectionObserver returns entries.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    // Keep Home active when the visitor is at the very top.
    const handleScroll = () => {
      if (window.scrollY < 80) setActive("home");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="nav mono" aria-label="Sections">
      {items.map((id) => (
        <a
          key={id}
          href={`/#${id}`}
          className={active === id ? "active" : undefined}
          aria-current={active === id ? "location" : undefined}
        >
          {id}
        </a>
      ))}
    </nav>
  );
}
