"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Xmark, NavArrowDown, LeaderboardStar, GraduationCap, Swimming } from "iconoir-react";

const leaderboardItems = [
  { label: "Cursus", href: "/leaderboard", icon: GraduationCap },
  { label: "Pool", href: "/pool", icon: Swimming },
];

// Trapezoid tab: flush left edge, bottom-right cut inward so the bottom edge is
// narrower than the top edge, which runs the full width of the row.
const ACTIVE_CLIP_PATH = "polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)";
const activeItemClass = "bg-accent/10 text-accent";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leaderboardExpanded, setLeaderboardExpanded] = useState(true);

  const isLeaderboardActive = leaderboardItems.some((item) => item.href === pathname);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle sidebar"
        aria-expanded={mobileOpen}
        className="app-sidebar-toggle fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center border border-glass-border bg-bg-secondary/90 text-text-primary shadow-lg backdrop-blur-md transition hover:border-accent hover:text-accent md:hidden"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Xmark strokeWidth={2} className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu strokeWidth={2} className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-20 z-30 bg-black/60 backdrop-blur-sm md:top-28 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar panel — docked below the fixed top nav (clearance matches the nav's real height at each breakpoint) */}
      <aside
        className={`app-sidebar fixed left-0 top-20 z-40 flex h-[calc(100vh-5rem)] w-64 flex-col gap-1 border-r border-glass-border bg-bg-secondary/95 px-4 py-6 backdrop-blur-md transition-transform duration-300 ease-out md:top-28 md:h-[calc(100vh-7rem)] md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div>
          <button
            onClick={() => setLeaderboardExpanded((v) => !v)}
            aria-expanded={leaderboardExpanded}
            style={isLeaderboardActive ? { clipPath: ACTIVE_CLIP_PATH } : undefined}
            className={`flex w-full items-center justify-between px-3 py-2 text-base font-medium uppercase tracking-wide transition-colors ${
              isLeaderboardActive ? activeItemClass : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="flex items-center gap-2">
              <LeaderboardStar strokeWidth={2} className="h-5 w-5" />
              Leaderboard
            </span>
            <motion.span
              initial={false}
              animate={{ rotate: leaderboardExpanded ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex"
            >
              <NavArrowDown strokeWidth={2} className="h-4 w-4" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {leaderboardExpanded && (
              <motion.div
                key="leaderboard-submenu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-1 ml-3 flex flex-col gap-1 border-l border-glass-border pl-3">
                  {leaderboardItems.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        style={active ? { clipPath: ACTIVE_CLIP_PATH } : undefined}
                        className={`flex items-center gap-2 px-3 py-1.5 text-base transition-colors ${
                          active ? activeItemClass : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        <Icon strokeWidth={2} className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  );
}
