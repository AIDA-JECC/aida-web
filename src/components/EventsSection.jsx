import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowRight, Calendar } from 'lucide-react';
import { eventsData } from '../data/siteData';
import EventModal from './EventModal';
import EventArtwork from './EventArtwork';

const HOMEPAGE_PREVIEW_LIMIT = 3;

/**
 * Sort by exact event date where supplied, or year.
 */
function eventSortValue(event) {
  if (event.eventDate) return Date.parse(`${event.eventDate}T00:00:00Z`);
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
        {topThreeEvents.map((event) => (
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
