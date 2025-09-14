
'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  simple?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: string): TimeLeft | null => {
  const difference = +new Date(targetDate) - +new Date();
  
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return null;
};

export function CountdownTimer({ targetDate, simple = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Set initial value on client mount to avoid hydration mismatch
    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center font-bold text-primary">
        The future is here!
      </div>
    );
  }

  if (simple) {
    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`);
    if (timeLeft.days === 0 && timeLeft.hours === 0) parts.push(`${timeLeft.seconds}s`);

    return (
      <div className="font-mono text-primary">
        Starts in: {parts.slice(0, 2).join(' ')}
      </div>
    )
  }

  const timeParts = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
      {timeParts.map((part, index) => (
        <div key={part.label} className="bg-muted p-6 rounded-lg shadow-inner">
          <div className="text-4xl md:text-6xl font-bold tracking-tighter text-primary font-mono">
            {part.value.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider mt-2">
            {part.label}
          </div>
        </div>
      ))}
    </div>
  );
}
