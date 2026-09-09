import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Archive, Flame, ArrowUpRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-800/80 scroll-mt-24"
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
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Previous official event"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          <span aria-live="polite" className="font-mono text-xs text-neutral-400 font-bold px-2 tabular-nums select-none">
            {String(currentIndex + 1).padStart(2, '0')} / {String(featuredEvents.length).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Next official event"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl min-w-0">
        <AnimatePresence mode="wait">
          <motion.article
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="yodha-card grid grid-cols-1 md:grid-cols-12 bg-gradient-to-b from-[#1d070a] via-[#120406] to-[#0a0203] border-2 border-red-500/80 hover:border-amber-400 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.35)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] ring-1 ring-inset ring-red-500/40 transition-all duration-300 select-none min-w-0 w-full"
          >
            {/* Left Column: Event Poster Artwork */}
            <div className="md:col-span-5 lg:col-span-4 relative min-w-0 overflow-hidden bg-black/60 border-b md:border-b-0 md:border-r border-red-900/40">
              <EventArtwork
                event={current}
                className="min-h-[280px] sm:min-h-[340px] md:min-h-[500px] h-full"
                imageClassName="p-3 sm:p-4"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute left-4 bottom-4 bg-gradient-to-r from-amber-500 to-red-600 text-white font-mono text-[11px] font-bold px-3 py-1 rounded-full uppercase shadow-lg border border-amber-400/50">
                  {current.category}
                </span>
                <div className="absolute top-4 right-4 z-30 pointer-events-auto">
                  <EventCountdownTimer targetDate={current.targetDate || '2026-10-01T09:00:00+05:30'} />
                </div>
              </EventArtwork>
            </div>

            {/* Right Column: Event Details & Registration */}
            <div className="md:col-span-7 lg:col-span-8 p-5 sm:p-7 lg:p-8 flex flex-col justify-between min-w-0 overflow-hidden">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <Flame size={14} aria-hidden="true" />
                    <span>
                      {current.status === 'Upcoming' ? 'Upcoming National Hackathon' : 'Published at aidajecc.in/events'}
                    </span>
                  </div>
                </div>

                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight mb-3 break-words">
                  {current.name}
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-4 break-words">
                  {current.detail}
                </p>

                {/* Contact Personnel Info Bar */}
                {current.contacts && (
                  <div className="mt-4 p-3 rounded-xl bg-black/60 border border-red-900/50 flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-300 min-w-0">
                    <span className="text-red-400 font-bold flex items-center gap-1 shrink-0">
                      <Phone size={13} /> Contacts:
                    </span>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {current.contacts.map((c, idx) => (
                        <a
                          key={idx}
                          href={`tel:${c.phone.replace(/\s+/g, '')}`}
                          className="hover:text-amber-400 transition-colors whitespace-nowrap"
                        >
                          <span className="font-bold">{c.name}:</span> <span>{c.phone}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 min-w-0">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono text-neutral-300 border-t border-b border-red-900/40 py-3 mb-4">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar size={14} className="text-amber-400" aria-hidden="true" />
                    <span className="text-amber-300 font-bold">{current.dateLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <MapPin size={14} className="text-red-500" aria-hidden="true" />
                    <span>{current.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Archive size={14} className="text-red-500" aria-hidden="true" />
                    <span>{current.mode}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
                  <div className="flex flex-wrap gap-1.5 max-w-full min-w-0">
                    {current.tags.map((tag) => (
                      <span key={tag} className="bg-neutral-950 text-neutral-400 border border-neutral-800 px-2.5 py-1 rounded-md text-[11px] font-mono truncate max-w-[200px]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {(current.registrationUrl || current.registrationLink) && (
                    <a
                      href={current.registrationUrl || current.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm tracking-wider rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <span>REGISTER NOW</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {featuredEvents.map((event, index) => (
          <button
            key={event.id}
            type="button"
            onClick={() => handleSelectIndex(index)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === index ? 'w-8 bg-red-600' : 'w-2 bg-neutral-800 hover:bg-neutral-700'
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
