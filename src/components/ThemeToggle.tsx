"use client";

import { useTheme } from "next-themes";
import { SunLight, HalfMoon } from "iconoir-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons are rendered and CSS picks one from the `dark` class on <html>.
  // That keeps the server and client markup identical, so there is no mount
  // flag, no hydration mismatch and no layout shift in the nav.
  return (
    <button
      type="button"
      className="iconBtn themeToggle"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle colour theme"
    >
      <HalfMoon width={18} height={18} className="themeToggle__light" />
      <SunLight width={18} height={18} className="themeToggle__dark" />
    </button>
  );
}
