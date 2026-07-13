interface ChamferFrameProps {
  className?: string;
  chamfer?: number;
  armX?: number;
  armY?: number;
}

/**
 * Broadcast/HUD-style corner brackets: an open (non-closed) frame with a
 * chamfered bracket at the top-left and bottom-right corners only. Each
 * bracket's arms run partway along their two edges and stop short — the
 * top-right and bottom-left corners are left completely bare. Stroked path,
 * not a filled clip, so content underneath stays visible through the center.
 */
export default function ChamferFrame({ className, chamfer = 9, armX = 76, armY = 58 }: ChamferFrameProps) {
  const c = chamfer;
  const d = [
    `M0,${armY} L0,${c} L${c},0 L${armX},0`,
    `M100,${100 - armY} L100,${100 - c} L${100 - c},100 L${100 - armX},100`,
  ].join(" ");

  return (
    <svg
      className={`chamferFrame ${className ?? ""}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
