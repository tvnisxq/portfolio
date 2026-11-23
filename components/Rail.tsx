"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type RailState = {
  overflow: boolean;
  start: boolean;
  end: boolean;
  progress: number;
};

// Horizontal scroller with native touch scrolling, scroll-snap,
// arrow controls, progress feedback, and edge fades.
export default function Rail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const track = useRef<HTMLUListElement>(null);
  const trackId = useId();

  const [state, setState] = useState<RailState>({
    overflow: false,
    start: true,
    end: true,
    progress: 0,
  });

  const update = useCallback(() => {
    const element = track.current;
    if (!element) return;

    const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
    const nextState: RailState = {
      overflow: maxScroll > 2,
      start: element.scrollLeft <= 2,
      end: maxScroll <= 2 || element.scrollLeft >= maxScroll - 2,
      progress:
        maxScroll > 0
          ? Math.min(1, Math.max(0, element.scrollLeft / maxScroll))
          : 0,
    };

    setState((previous) => {
      if (
        previous.overflow === nextState.overflow &&
        previous.start === nextState.start &&
        previous.end === nextState.end &&
        Math.abs(previous.progress - nextState.progress) < 0.005
      ) {
        return previous;
      }

      return nextState;
    });
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(update);

    const observeTrackAndItems = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(element);

      // Track dimensions alone don't always reflect changes to individual
      // cards (for example, when images or asynchronously loaded content resize).
      Array.from(element.children).forEach((child) => {
        resizeObserver.observe(child);
      });

      update();
    };

    const mutationObserver = new MutationObserver(observeTrackAndItems);

    observeTrackAndItems();
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener("load", update);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("load", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (direction: 1 | -1) => {
    const element = track.current;
    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div
      className="rail"
      data-overflow={state.overflow}
      data-start={state.start}
      data-end={state.end}
    >
      <div className="rail-head" aria-hidden={!state.overflow}>
        <div className="rail-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${state.progress})` }} />
        </div>

        <div className="rail-btns">
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={!state.overflow || state.start}
            aria-label={`Scroll ${label} left`}
            aria-controls={trackId}
            tabIndex={state.overflow ? 0 : -1}
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={!state.overflow || state.end}
            aria-label={`Scroll ${label} right`}
            aria-controls={trackId}
            tabIndex={state.overflow ? 0 : -1}
          >
            →
          </button>
        </div>
      </div>

      <ul
        id={trackId}
        className="rail-track"
        ref={track}
        onScroll={update}
        tabIndex={0}
        aria-label={label}
      >
        {children}
      </ul>
    </div>
  );
}
