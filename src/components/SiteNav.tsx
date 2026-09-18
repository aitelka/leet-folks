"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import StudioClock from "@/components/StudioClock";
import Star from "@/components/Star";

const links = [
  { hash: "#apps", label: "Apps", index: "01" },
  { hash: "#work", label: "Client work", index: "02" },
  { hash: "#services", label: "Services", index: "03" },
  { hash: "#studio", label: "Studio", index: "04" },
];

export default function SiteNav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The nav points at sections of the home page. Off the home page those have
  // to become full paths, but on it they must stay bare hashes or every click
  // would trigger a navigation instead of a scroll.
  const onHome = pathname === "/";
  const sectionHref = (hash: string) => (onHome ? hash : `/${hash}`);

  // The bar only earns its blur and border once the page has moved; over the
  // hero it stays invisible so the headline owns the top of the screen.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="nav" data-stuck={stuck}>
      <div className="shell nav__inner">
        <Link href="/" className="logo" aria-label="Leet Folks, home">
          <Star className="logo__mark" />
          <span className="logo__text">
            leet<span>folks</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.hash}
              href={sectionHref(link.hash)}
              className="nav__link"
              data-index={link.index}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <StudioClock />
          <ThemeToggle />
          <Link href="/contact" className="btn btn--primary nav__cta">
            Start a project
          </Link>
          <button
            type="button"
            className="iconBtn burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="burger__bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="drawer" id="mobile-menu">
          {links.map((link) => (
            <a
              key={link.hash}
              href={sectionHref(link.hash)}
              className="drawer__link"
              onClick={() => setOpen(false)}
            >
              {link.label}
              <span>{link.index}</span>
            </a>
          ))}
          <div className="drawer__foot">
            <Link
              href="/contact"
              className="btn btn--primary"
              onClick={() => setOpen(false)}
            >
              Start a project
            </Link>
            <StudioClock />
          </div>
        </div>
      ) : null}
    </header>
  );
}
