import React, { useState, useEffect } from 'react';

export default function EventCountdownTimer({ targetDate = '2026-10-01T09:00:00+05:30', className = '' }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  function calculateTimeLeft(target) {
    const diff = +new Date(target) - +new Date();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isEnded: false,
    };
  }

  if (timeLeft.isEnded) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg ${className}`}>
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>HACKATHON IS LIVE</span>
      </div>
    );
  }

  return (
    <div className={`event-countdown-timer inline-flex items-center gap-1.5 sm:gap-2 font-mono text-xs font-bold text-white bg-black/90 backdrop-blur-md border border-amber-500/60 px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.35)] ${className}`}>
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block shrink-0" />
      <span className="text-amber-400 uppercase tracking-widest text-[10px] hidden xs:inline">STARTS IN:</span>
      <span className="text-white font-bold">{timeLeft.days}<span className="text-amber-400 text-[10px] font-normal">d</span></span>
      <span className="text-neutral-500 font-normal">:</span>
      <span className="text-white font-bold">{String(timeLeft.hours).padStart(2, '0')}<span className="text-amber-400 text-[10px] font-normal">h</span></span>
      <span className="text-neutral-500 font-normal">:</span>
      <span className="text-white font-bold">{String(timeLeft.minutes).padStart(2, '0')}<span className="text-amber-400 text-[10px] font-normal">m</span></span>
      <span className="text-neutral-500 font-normal">:</span>
      <span className="text-amber-400 font-bold w-5 text-center inline-block">{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
}
