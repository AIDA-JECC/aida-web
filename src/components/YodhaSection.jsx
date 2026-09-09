import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Archive, Flame, ArrowUpRight, Phone } from 'lucide-react';
import { eventsData } from '../data/siteData';
import EventArtwork from './EventArtwork';
import EventCountdownTimer from './ui/EventCountdownTimer';

export default function YodhaSection() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const pauseTimerRef = useRef(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const featuredEvents = eventsData.filter((event) => event.status === 'Upcoming' || event.isUpcoming);

  const triggerPause = useCallback(() => {
    setIsInteractionPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsInteractionPaused(false);
    }, 3000);
  }, []);

  const handleNext = useCallback(() => {
    triggerPause();
    setCurrentIndex((previous) => (previous + 1) % (featuredEvents.length || 1));
  }, [featuredEvents.length, triggerPause]);

  const handlePrev = useCallback(() => {
    triggerPause();
    setCurrentIndex((previous) => (previous - 1 + (featuredEvents.length || 1)) % (featuredEvents.length || 1));
  }, [featuredEvents.length, triggerPause]);

  const handleSelectIndex = (index) => {
    triggerPause();
    setCurrentIndex(index);
  };

  // Touch swipe handlers for mobile devices
  const handleTouchStart = (e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
    touchStartRef.current = 0;
    touchEndRef.current = 0;
  };

  // IntersectionObserver detects when YodhaSection is visible in viewport
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Autoplay control: advances every 4 seconds ONLY when in viewport & not hovered or manually paused
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !isInView ||
      isInteractionPaused ||
      isHovered ||
      featuredEvents.length <= 1
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % featuredEvents.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [featuredEvents.length, isInView, isInteractionPaused, isHovered]);

  const current = featuredEvents[currentIndex] || featuredEvents[0];
  if (!current) return null;

  return (
    <section
      ref={containerRef}
      id="yodha"
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-800/80"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-2 block">• UPCOMING EVENTS</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white">
            Upcoming <span className="text-red-600 italic font-serif">Events</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-md"
            aria-label="Previous official event"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          <span aria-live="polite" className="font-mono text-xs text-neutral-400 font-bold px-2 tabular-nums">
            {String(currentIndex + 1).padStart(2, '0')} / {String(featuredEvents.length).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-md"
            aria-label="Next official event"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="grid grid-cols-1 md:grid-cols-[minmax(260px,0.8fr)_1.2fr] bg-gradient-to-b from-[#1d070a] via-[#120406] to-[#0a0203] border-2 border-red-500/80 hover:border-amber-400 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.35)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] ring-1 ring-inset ring-red-500/40 transition-all duration-500 select-none cursor-pointer"
      >
        <EventArtwork
          key={current.id}
          event={current}
          className="min-h-[300px] md:min-h-[520px]"
          imageClassName="p-2 sm:p-4"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute left-5 bottom-5 bg-gradient-to-r from-amber-500 to-red-600 text-white font-mono text-xs font-bold px-3.5 py-1.5 rounded-full uppercase shadow-lg border border-amber-400/50">
            {current.category}
          </span>
          <div className="absolute top-5 right-5 z-30">
            <EventCountdownTimer targetDate={current.targetDate || '2026-10-01T09:00:00+05:30'} />
          </div>
        </EventArtwork>

        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                <Flame size={14} aria-hidden="true" />
                <span>
                  {current.status === 'Upcoming' ? 'Upcoming National Hackathon' : 'Published at aidajecc.in/events'}
                </span>
              </div>
            </div>

            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white leading-snug mb-4">
              {current.name}
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed line-clamp-6">
              {current.detail}
            </p>

            {/* Contact Personnel Info Bar */}
            {current.contacts && (
              <div className="mt-4 p-3 rounded-2xl bg-black/60 border border-red-900/50 flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-300">
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <Phone size={13} /> Contacts:
                </span>
                {current.contacts.map((c, idx) => (
                  <a
                    key={idx}
                    href={`tel:${c.phone.replace(/\s+/g, '')}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    <span className="font-bold">{c.name}:</span> <span>{c.phone}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-300 border-t border-b border-red-900/40 py-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-amber-400" aria-hidden="true" />
                <span className="text-amber-300 font-bold">{current.dateLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={15} className="text-red-500" aria-hidden="true" />
                <span>{current.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Archive size={15} className="text-red-500" aria-hidden="true" />
                <span>{current.mode}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
              <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 max-w-full whitespace-nowrap pb-1 touch-pan-x">
                {current.tags.map((tag) => (
                  <span key={tag} className="bg-neutral-950 text-neutral-400 border border-neutral-800 px-3 py-1 rounded-md text-xs font-mono shrink-0">
                    #{tag}
                  </span>
                ))}
              </div>

              {(current.registrationUrl || current.registrationLink) && (
                <a
                  href={current.registrationUrl || current.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm tracking-wider rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>REGISTER NOW</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </article>

      <div className="flex justify-center gap-2 mt-6">
        {featuredEvents.map((event, index) => (
          <button
            key={event.id}
            type="button"
            onClick={() => handleSelectIndex(index)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === index ? 'w-8 bg-red-600' : 'w-2 bg-neutral-800'
            }`}
            aria-label={`Show ${event.name}`}
            aria-current={currentIndex === index ? 'true' : undefined}
          />
        ))}
      </div>

      {/* Red line progress bar indicator */}
      <div className="mt-6 h-px bg-neutral-800 overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-red-600 origin-left transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${(currentIndex + 1) / (featuredEvents.length || 1)})` }}
        />
      </div>
    </section>
  );
}
