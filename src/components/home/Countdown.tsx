"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/hooks/useI18n";
import { getWeddingDateTime } from "@/lib/config/wedding-config";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface AnimatingFlags {
  daysHundreds: boolean;
  daysUnits: boolean;
  daysTens: boolean;
  hoursUnits: boolean;
  hoursTens: boolean;
  minutesUnits: boolean;
  minutesTens: boolean;
  secondsUnits: boolean;
  secondsTens: boolean;
}

type ItemKey = "days" | "hours" | "minutes" | "seconds";

interface DisplayValues {
  daysHundreds: string;
  daysTens: string;
  daysUnits: string;
  hoursTens: string;
  hoursUnits: string;
  minutesTens: string;
  minutesUnits: string;
  secondsTens: string;
  secondsUnits: string;
}

const INITIAL_TIME: CountdownTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const INITIAL_FLAGS: AnimatingFlags = {
  daysHundreds: false,
  daysUnits: false,
  daysTens: false,
  hoursUnits: false,
  hoursTens: false,
  minutesUnits: false,
  minutesTens: false,
  secondsUnits: false,
  secondsTens: false,
};

const INITIAL_DISPLAY: DisplayValues = {
  daysHundreds: "0",
  daysTens: "0",
  daysUnits: "0",
  hoursTens: "0",
  hoursUnits: "0",
  minutesTens: "0",
  minutesUnits: "0",
  secondsTens: "0",
  secondsUnits: "0",
};

const ITEMS: Array<{ key: ItemKey; labelKey: "days" | "hours" | "minutes" | "seconds" }> = [
  { key: "days", labelKey: "days" },
  { key: "hours", labelKey: "hours" },
  { key: "minutes", labelKey: "minutes" },
  { key: "seconds", labelKey: "seconds" },
];

const SLOT_CLASS =
  "relative h-[2rem] sm:h-[4rem] md:h-[5rem] lg:h-[7rem] w-[1.25rem] sm:w-[2rem] md:w-[2.5rem] lg:w-[3.5rem] flex items-center justify-center overflow-hidden";

function getCountdownTime(): CountdownTime {
  const targetDate = getWeddingDateTime().getTime();
  const now = Date.now();
  const difference = targetDate - now;

  if (difference <= 0) {
    return INITIAL_TIME;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function getDisplayValues(time: CountdownTime): DisplayValues {
  const days = String(time.days).padStart(3, "0");
  const hours = String(time.hours).padStart(2, "0");
  const minutes = String(time.minutes).padStart(2, "0");
  const seconds = String(time.seconds).padStart(2, "0");

  return {
    daysHundreds: days[0],
    daysTens: days[1],
    daysUnits: days[2],
    hoursTens: hours[0],
    hoursUnits: hours[1],
    minutesTens: minutes[0],
    minutesUnits: minutes[1],
    secondsTens: seconds[0],
    secondsUnits: seconds[1],
  };
}

function getAnimatingFlags(current: DisplayValues, previous: DisplayValues): AnimatingFlags {
  return {
    daysHundreds: current.daysHundreds !== previous.daysHundreds,
    daysUnits: current.daysUnits !== previous.daysUnits,
    daysTens: current.daysTens !== previous.daysTens,
    hoursUnits: current.hoursUnits !== previous.hoursUnits,
    hoursTens: current.hoursTens !== previous.hoursTens,
    minutesUnits: current.minutesUnits !== previous.minutesUnits,
    minutesTens: current.minutesTens !== previous.minutesTens,
    secondsUnits: current.secondsUnits !== previous.secondsUnits,
    secondsTens: current.secondsTens !== previous.secondsTens,
  };
}

function DigitSlot({
  value,
  prev,
  animate,
}: {
  value: string;
  prev: string;
  animate: boolean;
}) {
  return (
    <div className={SLOT_CLASS}>
      {animate ? (
        <>
          <div className="absolute animate-slide-up-out">{prev}</div>
          <div className="absolute animate-slide-down-top">{value}</div>
        </>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
}

export default function Countdown() {
  const { data } = useI18n();
  const [time, setTime] = useState<CountdownTime>(INITIAL_TIME);
  const [animating, setAnimating] = useState<AnimatingFlags>(INITIAL_FLAGS);
  const [mounted, setMounted] = useState(false);
  const displayValuesRef = useRef<DisplayValues>(INITIAL_DISPLAY);
  const prevDisplayValuesRef = useRef<DisplayValues>(INITIAL_DISPLAY);

  useEffect(() => {
    setMounted(true);

    const calculateCountdown = () => {
      const newTime = getCountdownTime();
      const nextDisplay = getDisplayValues(newTime);
      const previousDisplay = displayValuesRef.current;

      prevDisplayValuesRef.current = previousDisplay;
      displayValuesRef.current = nextDisplay;

      setTime(newTime);
      setAnimating(getAnimatingFlags(nextDisplay, previousDisplay));

      setTimeout(() => {
        setAnimating(INITIAL_FLAGS);
      }, 500);
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!data?.dict) {
    return null;
  }

  const dict = data.dict;

  function CountdownItem({
    value,
    label,
    itemKey,
  }: {
    value: number;
    label: string;
    itemKey: ItemKey;
  }) {
    const isThreeDigits = itemKey === "days";
    const displayValue = isThreeDigits ? String(value).padStart(3, "0") : String(value).padStart(2, "0");

    let hundreds: string | undefined;
    let prevHundreds: string | undefined;
    let tens: string;
    let prevTens: string;
    let units: string;
    let prevUnits: string;

    if (isThreeDigits) {
      hundreds = displayValue[0];
      tens = displayValue[1];
      units = displayValue[2];
      prevHundreds = prevDisplayValuesRef.current.daysHundreds;
      prevTens = prevDisplayValuesRef.current.daysTens;
      prevUnits = prevDisplayValuesRef.current.daysUnits;
    } else {
      tens = displayValue[0];
      units = displayValue[1];
      prevTens = prevDisplayValuesRef.current[`${itemKey}Tens` as keyof typeof prevDisplayValuesRef.current];
      prevUnits = prevDisplayValuesRef.current[`${itemKey}Units` as keyof typeof prevDisplayValuesRef.current];
    }

    return (
      <div className="text-center flex-1 sm:flex-none">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-secondary flex justify-center gap-0.5 sm:gap-0 md:gap-0">
          {/* Chiffre des centaines (jours uniquement) */}
          {isThreeDigits && (
            <DigitSlot
              value={hundreds || "0"}
              prev={prevHundreds || "0"}
              animate={animating.daysHundreds}
            />
          )}

          {/* Chiffre des dizaines */}
          <DigitSlot
            value={tens}
            prev={prevTens}
            animate={animating[`${itemKey}Tens` as keyof AnimatingFlags]}
          />

          {/* Chiffre des unités */}
          <DigitSlot
            value={units}
            prev={prevUnits}
            animate={animating[`${itemKey}Units` as keyof AnimatingFlags]}
          />
        </div>
        <div className="text-[0.5rem] sm:text-xs md:text-sm font-medium text-gray-600 uppercase tracking-widest mt-1 sm:mt-2 md:mt-3">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center gap-1 sm:gap-3 md:gap-5 lg:gap-8">
      {ITEMS.map((item, index) => (
        <div key={item.key} className="contents">
          <CountdownItem
            value={time[item.key]}
            label={dict.common[item.labelKey]}
            itemKey={item.key}
          />
          {index < ITEMS.length - 1 && (
            <span className="inline-flex h-[2rem] sm:h-[4rem] md:h-[5rem] lg:h-[7rem] items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-secondary/70 leading-none">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
