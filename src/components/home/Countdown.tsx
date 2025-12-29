"use client";

import { useState, useEffect } from "react";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [time, setTime] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateCountdown = () => {
      // Date cible: 15 août 2026 à minuit
      const targetDate = new Date("2026-08-15T00:00:00").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  function CountdownItem({ value, label }: { value: number; label: string }) {
    return (
      <div className="text-center">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-secondary">
          {String(value).padStart(2, "0")}
        </div>
        <div className="text-[0.65rem] sm:text-xs md:text-sm font-medium text-gray-600 uppercase tracking-widest mt-1 sm:mt-2 md:mt-3">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 sm:gap-8 md:gap-16 lg:gap-20">
      <CountdownItem value={time.days} label="Jours" />
      <CountdownItem value={time.hours} label="Heures" />
      <CountdownItem value={time.minutes} label="Minutes" />
      <CountdownItem value={time.seconds} label="Secondes" />
    </div>
  );
}
