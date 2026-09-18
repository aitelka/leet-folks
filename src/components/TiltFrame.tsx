"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

/**
 * Gives its children a shallow parallax tilt keyed to the pointer's position
 * within the frame. Deliberately small — 7° at the corners — because the
 * point is to suggest the screenshots are physical objects on the page, not
 * to perform. Falls back to nothing on touch and under reduced motion.
 */
export default function TiltFrame({
  children,
  max = 7,
}: {
  children: ReactNode;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    el.dataset.active = "false";
    el.style.setProperty("--tx", "0deg");
    el.style.setProperty("--ty", "0deg");
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const box = el.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width - 0.5;
    const py = (e.clientY - box.top) / box.height - 0.5;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      el.dataset.active = "true";
      el.style.setProperty("--tx", `${(-py * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--ty", `${(px * max * 2).toFixed(2)}deg`);
    });
  };

  return (
    <div
      ref={ref}
      className="tilt"
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  );
}
