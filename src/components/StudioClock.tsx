"use client";

import { useSyncExternalStore } from "react";

const PLACEHOLDER = "--:--";

const formatter = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Casablanca",
  }).format(new Date());

/* A module-level cache so getSnapshot is a pure read. Recomputing inside it
   would hand React a different string mid-render and trip its "snapshot
   should be cached" check on the minute boundary. */
let snapshot = PLACEHOLDER;

function refresh(): boolean {
  const next = formatter();
  if (next === snapshot) return false;
  snapshot = next;
  return true;
}

function subscribe(onChange: () => void) {
  // Fire once on subscribe so the placeholder is replaced on the first commit
  // after hydration rather than up to a minute later.
  if (refresh()) onChange();
  const id = setInterval(() => {
    if (refresh()) onChange();
  }, 15_000);
  return () => clearInterval(id);
}

/**
 * Local time in the studio — the small human detail that says a person is
 * behind this. The server has no business guessing the clock, so it renders
 * the placeholder and the real time arrives on subscription. Going through
 * useSyncExternalStore rather than useState keeps that handover a documented
 * hydration path instead of a suppressed mismatch.
 */
export default function StudioClock() {
  const time = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => PLACEHOLDER,
  );

  return (
    <span className="clock">
      <span className="clock__dot" aria-hidden="true" />
      Agadir&nbsp;{time}
    </span>
  );
}
