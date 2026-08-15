import React, { useMemo, useRef, useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
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

// Custom Dark Theme-Matched Animated Dropdown for Event Year Filter
function EventYearDropdown({ years, selectedYear, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Filter events by year"
        className="flex items-center justify-between gap-2.5 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 hover:border-red-600 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer outline-none transition-all shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] active:scale-98"
      >
        <span>Year: {selectedYear}</span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 sm:left-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 top-full mt-2 w-48 sm:w-52 bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-1.5 z-40 space-y-1 animate-fadeIn ring-1 ring-white/10">
          {years.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => {
                  onSelect(year);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-red-400'
                }`}
              >
                <span>{year === 'All' ? 'All Years' : year}</span>
                {isSelected && <Check size={14} className="shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
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
      {/* Centered Uniform Section Header */}
      <div className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto mb-10 space-y-3">
        <span className="font-mono text-xs tracking-widest text-red-500 uppercase block">
          • OFFICIAL EVENTS, NEWEST FIRST
        </span>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-center tracking-tight leading-tight">
          Events Showcase &amp; Hackathons
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm font-mono">
          Showing {visibleEvents.length} of {filteredEvents.length} events
        </p>

        {/* Custom Dark Theme Animated Year Dropdown */}
        <div className="pt-2">
          <EventYearDropdown
            years={years}
            selectedYear={selectedYear}
            onSelect={selectYear}
          />
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
