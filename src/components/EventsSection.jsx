import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowRight, Calendar } from 'lucide-react';
import { eventsData } from '../data/siteData';
import EventModal from './EventModal';
import EventArtwork from './EventArtwork';

import EventCountdownTimer from './ui/EventCountdownTimer';
import { Phone } from 'lucide-react';

const HOMEPAGE_PREVIEW_LIMIT = 3;

/**
 * Sort by exact event date where supplied, or year.
 */
function eventSortValue(event) {
  if (!event) return 0;
  if (event.eventDate) {
    const parsed = Date.parse(`${event.eventDate}T00:00:00Z`);
    if (!isNaN(parsed)) return parsed;
  }
  if (event.rawDate || event.dateLabel) {
    const parsedRaw = Date.parse(event.rawDate || event.dateLabel);
    if (!isNaN(parsedRaw)) return parsedRaw;
  }
  if (Number.isFinite(Number(event.year))) return Date.UTC(Number(event.year), 0, 1);
  return 0;
}

export default function EventsSection({ onNavigate }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sort events by date newest first and take top 3 for homepage preview
  const topThreeEvents = useMemo(() => {
    const sorted = [...eventsData].sort((a, b) => eventSortValue(b) - eventSortValue(a));
    return sorted.slice(0, HOMEPAGE_PREVIEW_LIMIT);
  }, []);

  const handleNavigateEvents = () => {
    if (onNavigate) {
      onNavigate('events');
    } else {
      window.location.hash = '#/events';
    }
  };

  return (
    <section id="events" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Centered Uniform Section Header */}
      <div className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="font-mono text-xs tracking-widest text-red-500 uppercase block">
          • DEPARTMENT EVENTS &amp; HACKATHONS
        </span>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-center tracking-tight leading-tight">
          Events <span className="text-red-600 italic">Showcase</span> &amp; Hackathons
        </h2>
        <p className="text-neutral-400 font-sans text-xs sm:text-sm md:text-base leading-relaxed text-center max-w-2xl">
          Recent workshops, hackathons, inaugurations, and technical symposiums organized by AIDA at Jyothi Engineering College.
        </p>
      </div>

      {/* Grid of Top 3 Recent Events */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {topThreeEvents.map((event) => {
          const isUpcoming = event.status === 'Upcoming' || event.isUpcoming;

          if (isUpcoming) {
            return (
              <li key={event.id} className="md:col-span-2 lg:col-span-1">
                <div
                  onClick={() => setSelectedEvent(event)}
                  className="w-full h-full text-left group relative bg-gradient-to-b from-[#1c080b] via-[#130507] to-[#0a0203] border-2 border-red-500/80 hover:border-amber-400 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between shadow-[0_0_35px_rgba(220,38,38,0.3)] hover:shadow-[0_0_55px_rgba(245,158,11,0.45)] ring-1 ring-red-500/40"
                >
                  {/* Glowing Top Ribbon */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-rose-600 animate-pulse z-30" />

                  <div className="w-full">
                    <EventArtwork event={event} className="w-full h-64 sm:h-72">
                      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2">
                        <span className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-mono text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg border border-amber-400/50 flex items-center gap-1.5 animate-pulse">
                          <span>⚡ UPCOMING</span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 z-30">
                        <EventCountdownTimer targetDate={event.targetDate || '2026-10-01T09:00:00+05:30'} />
                      </div>
                    </EventArtwork>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                          <span>OCTOBER 1, 2 &amp; 3</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-600/60 px-2.5 py-0.5 rounded-md">
                          ₹1 LAKH PRIZES
                        </span>
                      </div>

                      <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white group-hover:text-amber-400 transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {event.detail}
                      </p>

                      {/* Contact Info Footer */}
                      <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-neutral-300 border-t border-red-900/40">
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <Phone size={12} /> Contact:
                        </span>
                        <span>Alinto: 99478 17803</span>
                        <span>•</span>
                        <span>Amal P S: 92079 82258</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full px-6 pb-6 pt-2 flex items-center justify-between gap-2">
                    <a
                      href={event.registrationLink || 'https://yodha.aidajecc.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs font-extrabold shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all"
                    >
                      <span>yodha.aidajecc.in</span>
                      <ArrowUpRight size={14} />
                    </a>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-700 hover:border-amber-400 text-xs font-mono text-neutral-300 hover:text-white transition-all"
                    >
                      <span>DETAILS</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          }

          return (
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
          );
        })}
      </ul>

      {/* Prominent View All Events Navigation Button */}
      <div className="pt-10 text-center">
        <button
          type="button"
          onClick={handleNavigateEvents}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-xl hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Calendar size={18} />
          <span>VIEW ALL EVENTS</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
