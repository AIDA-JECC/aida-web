import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Archive, Flame, ArrowUpRight } from 'lucide-react';
import { eventsData } from '../data/siteData';
import EventArtwork from './EventArtwork';

export default function YodhaSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredEvents = eventsData.filter((event) => event.status === 'Upcoming');

  const handleNext = () => {
    setCurrentIndex((previous) => (previous + 1) % featuredEvents.length);
  };

  const handlePrev = () => {
    setCurrentIndex((previous) => (previous - 1 + featuredEvents.length) % featuredEvents.length);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % featuredEvents.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [featuredEvents.length]);

  const current = featuredEvents[currentIndex];
  if (!current) return null;

  return (
    <section id="yodha" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-800/80">
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

      <article className="grid grid-cols-1 md:grid-cols-[minmax(260px,0.8fr)_1.2fr] bg-white/5 backdrop-blur-md border border-white/10 hover:border-red-900/50 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-inset ring-white/5 transition-all duration-500">
        <EventArtwork
          key={current.id}
          event={current}
          className="min-h-[300px] md:min-h-[520px]"
          imageClassName="p-2 sm:p-4"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute left-5 bottom-5 bg-red-600 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-full uppercase">
            {current.category}
          </span>
        </EventArtwork>

        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 text-red-500 font-mono text-xs font-bold uppercase">
                <Flame size={14} aria-hidden="true" />
                <span>
                  {current.status === 'Upcoming' ? 'Upcoming at AIDA JECC' : 'Published at aidajecc.in/events'}
                </span>
              </div>
              <span className="bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs font-semibold px-3 py-1 rounded-full">
                {current.status}
              </span>
            </div>

            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-white leading-snug mb-4">
              {current.name}
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed line-clamp-6">
              {current.detail}
            </p>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-300 border-t border-b border-neutral-800/80 py-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-red-500" aria-hidden="true" />
                <span>{current.dateLabel}</span>
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

              {current.registrationUrl && (
                <a
                  href={current.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm tracking-wider rounded-full shadow-md transition-all whitespace-nowrap shrink-0"
                >
                  <span>REGISTER FREE</span>
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
            onClick={() => setCurrentIndex(index)}
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
          style={{ transform: `scaleX(${(currentIndex + 1) / featuredEvents.length})` }}
        />
      </div>
    </section>
  );
}
