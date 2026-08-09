import React, { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventsData } from '../data/siteData';
import EventModal from './EventModal';
import EventArtwork from './EventArtwork';

const PAGE_SIZE = 6;

/**
 * Sort by exact event date where supplied. Older migrated records only expose a
 * year, so they sort after dated records in that year without inventing a day.
 * Undated archive records remain last.
 */
function eventSortValue(event) {
  if (event.eventDate) return Date.parse(`${event.eventDate}T00:00:00Z`);
  if (Number.isFinite(Number(event.year))) return Date.UTC(Number(event.year), 0, 1);
  return 0;
}

export default function EventsSection() {
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const sectionTopRef = useRef(null);

  const years = useMemo(() => {
    const values = [...new Set(eventsData.map((event) => String(event.year)))];
    return [
      'All',
      ...values.sort((a, b) => {
        if (a === 'Archive') return 1;
        if (b === 'Archive') return -1;
        return Number(b) - Number(a);
      }),
    ];
  }, []);

  const filteredEvents = useMemo(() => {
    const matching = selectedYear === 'All'
      ? eventsData
      : eventsData.filter((event) => String(event.year) === selectedYear);

    return [...matching].sort((a, b) => eventSortValue(b) - eventSortValue(a));
  }, [selectedYear]);

  const pageCount = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const visibleEvents = filteredEvents.slice(
    safePageIndex * PAGE_SIZE,
    safePageIndex * PAGE_SIZE + PAGE_SIZE,
  );

  const selectYear = (year) => {
    setSelectedYear(year);
    setPageIndex(0);
  };

  const changePage = (nextPage) => {
    const bounded = Math.min(pageCount - 1, Math.max(0, nextPage));
    setPageIndex(bounded);
    window.requestAnimationFrame(() => {
      sectionTopRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };

  return (
    <section id="events" ref={sectionTopRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-3 block">
            • OFFICIAL EVENTS, NEWEST FIRST
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white">
            Events Showcase &amp; Hackathons
          </h2>
          <p className="text-neutral-500 mt-3 text-sm font-mono">
            Showing {visibleEvents.length} of {filteredEvents.length} events
          </p>
        </div>

        <div role="group" aria-label="Filter events by year" className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 pb-2 max-w-full whitespace-nowrap touch-pan-x">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              aria-pressed={selectedYear === year}
              onClick={() => selectYear(year)}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider border border-neutral-800 shrink-0 transition-all cursor-pointer ${
                selectedYear === year
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:border-neutral-700 bg-neutral-950'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {visibleEvents.map((event) => (
          <li key={event.id}>
            <button
              type="button"
              onClick={() => setSelectedEvent(event)}
              aria-label={`Open details for ${event.name}`}
              className="w-full h-full text-left group bg-white/5 backdrop-blur-md border border-white/10 hover:border-red-600/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-4 ring-1 ring-inset ring-white/5 shadow-xl"
            >
              <div className="w-full">
                <EventArtwork event={event} className="w-full h-64 sm:h-72">
                  <span className="absolute top-4 left-4 bg-black/85 backdrop-blur-md text-white font-mono text-xs font-semibold px-3 py-1 rounded-full border border-neutral-800">
                    #{event.year} • {event.category}
                  </span>
                </EventArtwork>

                <div className="p-6">
                  <h3 className="font-sans font-extrabold text-xl text-white mb-2 group-hover:text-red-500 transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">
                    {event.detail}
                  </p>
                </div>
              </div>

              <div className="w-full px-6 pb-6 pt-2 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider">
                  {event.status}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-800 group-hover:border-red-600 text-xs font-semibold text-neutral-300 group-hover:text-white transition-all">
                  <span>SEE DETAILS</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <nav aria-label="Event pages" className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => changePage(safePageIndex - 1)}
            disabled={safePageIndex === 0}
            className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer"
            aria-label="Previous events page"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          <p aria-live="polite" className="font-mono text-xs tabular-nums text-neutral-400">
            PAGE <span className="text-white">{String(safePageIndex + 1).padStart(2, '0')}</span>
            <span className="text-neutral-600"> / {String(pageCount).padStart(2, '0')}</span>
          </p>

          <button
            type="button"
            onClick={() => changePage(safePageIndex + 1)}
            disabled={safePageIndex >= pageCount - 1}
            className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer"
            aria-label="Next events page"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </nav>
      )}

      {/* Red line progress bar indicator */}
      <div className="mt-7 h-px bg-neutral-800 overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-red-600 origin-left transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${(safePageIndex + 1) / pageCount})` }}
        />
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
