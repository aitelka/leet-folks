"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sits beside the mailto link for people who would rather paste the address
 * somewhere else. Falls back silently: if the clipboard is unavailable — an
 * insecure origin, a denied permission — the mailto link next to it still
 * works, so there is nothing to report.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no clipboard — the address is right there to select */
    }
  };

  return (
    <button
      type="button"
      className="copy"
      onClick={copy}
      data-copied={copied}
      aria-live="polite"
    >
      {copied ? "Copied ✓" : "Copy address"}
    </button>
  );
}
