"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { NavArrowDown } from "iconoir-react";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownGroup {
  label: string;
  options: DropdownOption[];
}

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: DropdownOption[];
  groups?: DropdownGroup[];
  placeholder?: string;
  className?: string;
}

export default function FilterDropdown({
  value,
  onChange,
  options,
  groups,
  placeholder,
  className = "",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Position the menu against the viewport (via portal) so it can't be
  // clipped by the filters row's mobile overflow-x:auto scroll container.
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current && !rootRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const flatOptions = groups ? groups.flatMap((g) => g.options) : options || [];
  const selectedLabel = flatOptions.find((o) => o.value === value)?.label;

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  const menu = open && menuPos && (
    <motion.div
      ref={menuRef}
      role="listbox"
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="filterDropdownMenu"
      style={{ top: menuPos.top, left: menuPos.left, minWidth: menuPos.width }}
    >
      {groups
        ? groups.map((group) => (
            <div className="filterDropdownGroup" key={group.label}>
              <div className="filterDropdownGroupLabel">{group.label}</div>
              {group.options.map((option) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={`filterDropdownOption ${option.value === value ? "filterDropdownOptionSelected" : ""}`}
                  onClick={() => selectOption(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          ))
        : options?.map((option) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`filterDropdownOption ${option.value === value ? "filterDropdownOptionSelected" : ""}`}
              onClick={() => selectOption(option.value)}
            >
              {option.label}
            </div>
          ))}
    </motion.div>
  );

  return (
    <div className={`filterDropdown ${className}`} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className="filterDropdownTrigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="filterDropdownValue">{selectedLabel ?? placeholder}</span>
        <NavArrowDown
          strokeWidth={2}
          className={`filterDropdownIcon ${open ? "filterDropdownIconOpen" : ""}`}
        />
      </button>

      {mounted && createPortal(<AnimatePresence>{menu}</AnimatePresence>, document.body)}
    </div>
  );
}
