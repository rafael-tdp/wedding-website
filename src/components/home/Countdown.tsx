"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/hooks/useI18n";

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

export default function Countdown() {
  const { data } = useI18n();
  const [time, setTime] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [animating, setAnimating] = useState<AnimatingFlags>({
    daysHundreds: false,
    daysUnits: false,
    daysTens: false,
    hoursUnits: false,
    hoursTens: false,
    minutesUnits: false,
    minutesTens: false,
    secondsUnits: false,
    secondsTens: false,
  });
  const [mounted, setMounted] = useState(false);
  const prevTimeRef = useRef<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const displayValuesRef = useRef({
    daysHundreds: "0",
    daysTens: "0",
    daysUnits: "0",
    hoursTens: "0",
    hoursUnits: "0",
    minutesTens: "0",
    minutesUnits: "0",
    secondsTens: "0",
    secondsUnits: "0",
  });
  const prevDisplayValuesRef = useRef({
    daysHundreds: "0",
    daysTens: "0",
    daysUnits: "0",
    hoursTens: "0",
    hoursUnits: "0",
    minutesTens: "0",
    minutesUnits: "0",
    secondsTens: "0",
    secondsUnits: "0",
  });

  useEffect(() => {
    setMounted(true);

    const calculateCountdown = () => {
      const targetDate = new Date("2026-08-11T12:00:00").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const newTime: CountdownTime = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };

        const daysStr = String(newTime.days).padStart(3, "0");
        const hoursStr = String(newTime.hours).padStart(2, "0");
        const minutesStr = String(newTime.minutes).padStart(2, "0");
        const secondsStr = String(newTime.seconds).padStart(2, "0");

        const newDisplayValues = {
          daysHundreds: daysStr[0],
          daysTens: daysStr[1],
          daysUnits: daysStr[2],
          hoursTens: hoursStr[0],
          hoursUnits: hoursStr[1],
          minutesTens: minutesStr[0],
          minutesUnits: minutesStr[1],
          secondsTens: secondsStr[0],
          secondsUnits: secondsStr[1],
        };

        // Vérifier quels éléments ont changé
        const newAnimating: AnimatingFlags = {
          daysHundreds: newDisplayValues.daysHundreds !== displayValuesRef.current.daysHundreds,
          daysUnits: newDisplayValues.daysUnits !== displayValuesRef.current.daysUnits,
          daysTens: newDisplayValues.daysTens !== displayValuesRef.current.daysTens,
          hoursUnits: newDisplayValues.hoursUnits !== displayValuesRef.current.hoursUnits,
          hoursTens: newDisplayValues.hoursTens !== displayValuesRef.current.hoursTens,
          minutesUnits: newDisplayValues.minutesUnits !== displayValuesRef.current.minutesUnits,
          minutesTens: newDisplayValues.minutesTens !== displayValuesRef.current.minutesTens,
          secondsUnits: newDisplayValues.secondsUnits !== displayValuesRef.current.secondsUnits,
          secondsTens: newDisplayValues.secondsTens !== displayValuesRef.current.secondsTens,
        };

        // Garder les anciennes valeurs avant de les remplacer
        prevDisplayValuesRef.current = { ...displayValuesRef.current };
        displayValuesRef.current = newDisplayValues;

        // Mettre à jour les valeurs
        setTime(newTime);
        setAnimating(newAnimating);

        // Mémoriser les valeurs actuelles
        prevTimeRef.current = newTime;

        // Réinitialiser les flags d'animation après 500ms
        setTimeout(() => {
          setAnimating({
            daysHundreds: false,
            daysUnits: false,
            daysTens: false,
            hoursUnits: false,
            hoursTens: false,
            minutesUnits: false,
            minutesTens: false,
            secondsUnits: false,
            secondsTens: false,
          });
        }, 500);
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

  if (!data?.dict) {
    return null;
  }

  const dict = data.dict;

  function CountdownItem({ 
    value, 
    label, 
    itemKey,
    shouldAnimateTens, 
    shouldAnimateUnits,
    shouldAnimateHundreds 
  }: { 
    value: number; 
    label: string; 
    itemKey: "days" | "hours" | "minutes" | "seconds";
    shouldAnimateTens: boolean; 
    shouldAnimateUnits: boolean;
    shouldAnimateHundreds?: boolean;
  }) {
    const isThreeDigits = itemKey === "days";
    const displayValue = isThreeDigits ? String(value).padStart(3, "0") : String(value).padStart(2, "0");
    
    let hundreds, tens, units;
    let prevHundreds, prevTens, prevUnits;
    
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
            <div className="relative h-[2rem] sm:h-[4rem] md:h-[5rem] lg:h-[7rem] w-[1.25rem] sm:w-[2rem] md:w-[2.5rem] lg:w-[3.5rem] flex items-center justify-center overflow-hidden">
              {shouldAnimateHundreds ? (
                <>
                  <div className="absolute animate-slide-up-out">
                    {prevHundreds}
                  </div>
                  <div className="absolute animate-slide-down-top">
                    {hundreds}
                  </div>
                </>
              ) : (
                <div>{hundreds}</div>
              )}
            </div>
          )}

          {/* Chiffre des dizaines */}
          <div className="relative h-[2rem] sm:h-[4rem] md:h-[5rem] lg:h-[7rem] w-[1.25rem] sm:w-[2rem] md:w-[2.5rem] lg:w-[3.5rem] flex items-center justify-center overflow-hidden">
            {shouldAnimateTens ? (
              <>
                <div className="absolute animate-slide-up-out">
                  {prevTens}
                </div>
                <div className="absolute animate-slide-down-top">
                  {tens}
                </div>
              </>
            ) : (
              <div>{tens}</div>
            )}
          </div>

          {/* Chiffre des unités */}
          <div className="relative h-[2rem] sm:h-[4rem] md:h-[5rem] lg:h-[7rem] w-[1.25rem] sm:w-[2rem] md:w-[2.5rem] lg:w-[3.5rem] flex items-center justify-center overflow-hidden">
            {shouldAnimateUnits ? (
              <>
                <div className="absolute animate-slide-up-out">
                  {prevUnits}
                </div>
                <div className="absolute animate-slide-down-top">
                  {units}
                </div>
              </>
            ) : (
              <div>{units}</div>
            )}
          </div>
        </div>
        <div className="text-[0.5rem] sm:text-xs md:text-sm font-medium text-gray-600 uppercase tracking-widest mt-1 sm:mt-2 md:mt-3">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-6 md:gap-12 lg:gap-20">
      <CountdownItem 
        value={time.days} 
        label={dict.common.days} 
        itemKey="days"
        shouldAnimateHundreds={animating.daysHundreds}
        shouldAnimateTens={animating.daysTens} 
        shouldAnimateUnits={animating.daysUnits} 
      />
      <CountdownItem 
        value={time.hours} 
        label={dict.common.hours} 
        itemKey="hours"
        shouldAnimateTens={animating.hoursTens} 
        shouldAnimateUnits={animating.hoursUnits} 
      />
      <CountdownItem 
        value={time.minutes} 
        label={dict.common.minutes} 
        itemKey="minutes"
        shouldAnimateTens={animating.minutesTens} 
        shouldAnimateUnits={animating.minutesUnits} 
      />
      <CountdownItem 
        value={time.seconds} 
        label={dict.common.seconds} 
        itemKey="seconds"
        shouldAnimateTens={animating.secondsTens} 
        shouldAnimateUnits={animating.secondsUnits} 
      />
    </div>
  );
}
