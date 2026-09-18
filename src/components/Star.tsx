/**
 * Khatem — the eight-point star that tiles every zellige panel in Morocco,
 * built the way the craft builds it: two squares laid over each other at
 * 45°. Used as the studio mark and, blown up, as the watermark behind the
 * manifesto line. Strokes only, so it inherits `currentColor`.
 */
const OUTER =
  "M50 2 L64.06 16.06 L83.94 16.06 L83.94 35.94 L98 50 L83.94 64.06 L83.94 83.94 L64.06 83.94 L50 98 L35.94 83.94 L16.06 83.94 L16.06 64.06 L2 50 L16.06 35.94 L16.06 16.06 L35.94 16.06 Z";

const INNER =
  "M50 23 L57.91 30.91 L69.09 30.91 L69.09 42.09 L77 50 L69.09 57.91 L69.09 69.09 L57.91 69.09 L50 77 L42.09 69.09 L30.91 69.09 L30.91 57.91 L23 50 L30.91 42.09 L30.91 30.91 L42.09 30.91 Z";

export default function Star({
  className,
  detailed = false,
  strokeWidth = 5,
}: {
  className?: string;
  /** Adds the inner rosette and the diagonals — only legible above ~8rem. */
  detailed?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={OUTER} />
      {detailed ? (
        <>
          <path d={INNER} strokeWidth={strokeWidth * 0.6} />
          <circle cx="50" cy="50" r="11" strokeWidth={strokeWidth * 0.6} />
        </>
      ) : null}
    </svg>
  );
}
