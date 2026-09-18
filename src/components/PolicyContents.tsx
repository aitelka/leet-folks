"use client";

import { useEffect, useState } from "react";

export type ContentsItem = { id: string; title: string };

/**
 * The running contents rail. Marks where you are by measuring which section
 * heading last passed the top of the window — heading heights vary enough here
 * that an IntersectionObserver threshold would flicker between two long
 * sections. Reads are batched through rAF so the scroll listener stays cheap.
 */
export default function PolicyContents({ items }: { items: ContentsItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.scrollY + 160;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top + window.scrollY <= line) {
          current = item.id;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Deferred rather than called here, so the first measurement lands after
    // paint instead of as a synchronous setState inside the effect.
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const list = (
    <ol className="contents__list">
      {items.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="contents__link"
            data-current={item.id === active}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav className="contents" aria-label="Contents">
      {/* Phone: a closed disclosure, so the document starts where it should. */}
      <details className="contents__disclosure">
        <summary>Contents · {items.length} sections</summary>
        {list}
      </details>

      <div className="contents__rail">
        <p className="contents__label">Contents</p>
        {list}
      </div>
    </nav>
  );
}
