"use client";

import { useEffect, useRef } from "react";

/**
 * Names strip under the hero. Rather than looping on its own clock, it reads
 * scroll velocity: fast scrolling speeds the loop and skews the whole strip,
 * and scrolling up reverses it — so the band reads as attached to the page.
 * Everything happens through CSS variables on the wrapper; no React state.
 */
export default function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = window.scrollY;
    let velocity = 0;
    let frame = 0;

    const tick = () => {
      // Decay towards rest so the strip eases back to its base speed instead
      // of snapping the moment the wheel stops.
      velocity *= 0.92;

      const boost = Math.min(Math.abs(velocity) / 26, 3.2);
      wrap.style.setProperty("--speed", `${(40 / (1 + boost)).toFixed(2)}s`);
      wrap.style.setProperty("--skew", `${(velocity * -0.04).toFixed(2)}deg`);

      frame = Math.abs(velocity) > 0.4 ? requestAnimationFrame(tick) : 0;
      if (!frame) {
        wrap.style.setProperty("--speed", "40s");
        wrap.style.setProperty("--skew", "0deg");
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      velocity = y - last;
      last = y;
      wrap.style.setProperty("--dir", velocity < 0 ? "reverse" : "normal");
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="tickerWrap" ref={ref} aria-hidden="true">
      {[0, 1].map((copy) => (
        <div className="ticker" key={copy}>
          {items.map((name) => (
            <span className="ticker__item" key={`${copy}-${name}`}>
              {name}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
