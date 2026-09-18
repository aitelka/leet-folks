import { Fragment } from "react";
import type { CSSProperties } from "react";

export type Segment = {
  text: string;
  /** Sets the run in the serif italic accent face. */
  em?: boolean;
};

/**
 * Splits a headline into words and gives each one its own clipping mask, so
 * the line assembles itself from the baseline up instead of fading in as a
 * block. Pure CSS animation on the server — no measuring, no layout effect,
 * and the words are ordinary text to a crawler or a screen reader.
 */
export default function Kinetic({
  segments,
  base = 0,
  step = 55,
}: {
  segments: Segment[];
  /** Delay before the first word, in ms. */
  base?: number;
  /** Delay added per word, in ms. */
  step?: number;
}) {
  let word = 0;

  return (
    <>
      {segments.map((segment, s) => {
        const words = segment.text.split(" ").filter(Boolean);

        return (
          <Fragment key={s}>
            {s > 0 ? " " : null}
            {words.map((w, i) => {
              const delay = { "--d": `${base + word++ * step}ms` } as CSSProperties;
              const inner = <span style={delay}>{w}</span>;

              return (
                <Fragment key={`${s}-${i}`}>
                  {i > 0 ? " " : null}
                  <span className="kinetic">
                    {segment.em ? <em>{inner}</em> : inner}
                  </span>
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}
