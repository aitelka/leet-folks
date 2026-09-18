"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Client } from "@/lib/content";

/**
 * Client work reads as a printed index: number, name, sector, one line of
 * prose, tags. On a pointer device the logo plate leaves the row entirely and
 * rides the cursor instead, trailing behind it so it feels to have some
 * weight. Every plate is mounted and cross-faded, so moving between rows never
 * flashes a half-decoded image.
 *
 * Below 900px — and on any coarse pointer — the follower is hidden by CSS and
 * the plate sits inside the row, where a thumb can see it.
 */
export default function WorkIndex({ clients }: { clients: Client[] }) {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  // The pointer loop lives entirely outside React: it writes a transform on
  // every frame, and a re-render per frame would be absurd for that.
  useEffect(() => {
    const list = listRef.current;
    const follower = followerRef.current;
    if (!list || !follower) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let primed = false;

    // Target is the pointer; current closes a fixed fraction of the gap each
    // frame. That one line is the whole sense of weight.
    const loop = () => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      follower.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;

      // Drop the plate straight onto the cursor the first time, rather than
      // letting it sail in from the corner of the window.
      if (!primed) {
        current.x = target.x;
        current.y = target.y;
        primed = true;
      }
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      setActive(null);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      primed = false;
    };

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);

    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="work" ref={listRef}>
        {clients.map((client, i) => (
          <div
            className="workRow"
            key={client.name}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setActive(i);
            }}
          >
            <span className="workRow__num">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span
              className={`plate plate--${client.logoTone} workRow__plate`}
              aria-hidden="true"
            >
              <Image
                src={client.logo}
                alt=""
                width={160}
                height={160}
                className="plate__logo"
              />
            </span>

            <div className="workRow__id">
              <span className="workRow__name">{client.name}</span>
              <span className="workRow__sector">
                {client.sector}
                {client.location ? ` · ${client.location}` : ""}
              </span>
            </div>

            <p className="workRow__desc">{client.work}</p>

            <div className="workRow__tags">
              {client.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="follower"
        ref={followerRef}
        data-shown={active !== null}
        aria-hidden="true"
      >
        {clients.map((client, i) => (
          <span
            className={`plate plate--${client.logoTone} follower__slot`}
            key={client.name}
            data-on={active === i}
          >
            <Image
              src={client.logo}
              alt=""
              width={320}
              height={320}
              className="plate__logo"
            />
          </span>
        ))}
      </div>
    </>
  );
}
