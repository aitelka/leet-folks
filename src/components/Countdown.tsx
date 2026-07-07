"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date("2026-07-13T00:00:00+01:00");

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="countdownSection">
        <p className="countdownLabel">Launching In</p>
        <div className="countdownGrid">
          {["Days", "Hours", "Minutes", "Seconds"].map((unit) => (
            <div key={unit} className="countdownCard">
              <div className="countdownValue">--</div>
              <div className="countdownUnit">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const units: { key: keyof TimeLeft; label: string }[] = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Minutes" },
    { key: "seconds", label: "Seconds" },
  ];

  return (
    <div className="countdownSection">
      <p className="countdownLabel">Launching In</p>
      <div className="countdownGrid">
        {units.map((unit, i) => (
          <div key={unit.key} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="countdownCard">
              <div className="countdownValue">
                {unit.key === "days"
                  ? timeLeft[unit.key]
                  : padZero(timeLeft[unit.key])}
              </div>
              <div className="countdownUnit">{unit.label}</div>
            </div>
            {i < units.length - 1 && (
              <span className="countdownSeparator">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
