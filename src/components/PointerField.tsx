"use client";

import { useEffect, useRef } from "react";

/**
 * The blueprint grid behind the hero. A second copy of the grid is masked to
 * a soft disc that follows the pointer, so the paper only shows its tooth
 * where your hand is. Writes CSS custom properties straight onto the node and
 * batches them through rAF, so React never re-renders on pointer move.
 */
export default function PointerField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = ref.current;
    const host = field?.parentElement;
    if (!field || !host) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      field.style.setProperty("--mx", `${x}px`);
      field.style.setProperty("--my", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      const box = host.getBoundingClientRect();
      x = e.clientX - box.left;
      y = e.clientY - box.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onEnter = () => field.style.setProperty("--halo", "1");
    const onLeave = () => field.style.setProperty("--halo", "0");

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="gridField gridField--live" aria-hidden="true" />;
}
