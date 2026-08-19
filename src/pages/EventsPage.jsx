import React, { useState, useMemo, useEffect } from 'react';
import { eventsData } from '../data/siteData';
import EventModal from '../components/EventModal';
import EventArtwork from '../components/EventArtwork';
import { ArrowLeft, Search, Calendar, ArrowUpRight, X, Filter, RotateCcw } from 'lucide-react';

function eventSortValue(event) {
  if (event.eventDate) return Date.parse(`${event.eventDate}T00:00:00Z`);
  if (Number.isFinite(Number(event.year))) return Date.UTC(Number(event.year), 0, 1);
  return 0;
}

export default function EventsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extract distinct years and categories
  const yearsList = useMemo(() => {
    const values = [...new Set(eventsData.map((e) => String(e.year)))];
    return [
      'All Years',
      ...values.sort((a, b) => {
        if (a === 'Archive') return 1;
        if (b === 'Archive') return -1;
        return Number(b) - Number(a);
      }),
    ];
  }, []);

  const categoriesList = useMemo(() => {
    const values = [...new Set(eventsData.map((e) => e.category).filter(Boolean))];
    return ['All Categories', ...values.sort()];
  }, []);

  // Filter & sort events
  const filteredEvents = useMemo(() => {
    const list = eventsData.filter((event) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = event.name?.toLowerCase().includes(q);
        const matchDetail = event.detail?.toLowerCase().includes(q);
        const matchCat = event.category?.toLowerCase().includes(q);
        const matchTags = event.tags?.some((t) => t.toLowerCase().includes(q));
        const matchYear = String(event.year).toLowerCase().includes(q);
        const matchStatus = event.status?.toLowerCase().includes(q);

        if (!matchName && !matchDetail && !matchCat && !matchTags && !matchYear && !matchStatus) {
          return false;
        }
      }

      // Year Filter
      if (selectedYear !== 'All Years' && String(event.year) !== selectedYear) {
        return false;
      }

      // Category Filter
      if (selectedCategory !== 'All Categories' && event.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    return list.sort((a, b) => eventSortValue(b) - eventSortValue(a));
  }, [searchQuery, selectedYear, selectedCategory]);

  const isFiltered = searchQuery.trim() !== '' || selectedYear !== 'All Years' || selectedCategory !== 'All Categories';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedYear('All Years');
    setSelectedCategory('All Categories');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      if (onNavigate) onNavigate('home');
      else window.location.hash = '#events';
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0708] text-white pt-6 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-600/30">
      {/* Sticky Header Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-800/80">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60 font-mono text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} className="text-red-500" />
            <span>BACK TO HOME</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} />
              <span>{eventsData.length} TOTAL EVENTS</span>
            </span>
          </div>
        </div>

        {/* Page Title & Subtitle */}
        <div className="mt-8 text-center max-w-3xl mx-auto space-y-3">
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase block">
            • AIDA DEPARTMENT REPOSITORY
          </span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Department <span className="text-red-600 italic">Events</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base font-sans leading-relaxed">
            Explore all {eventsData.length} workshops, hackathons, inaugurations, symposiums, and immersive technical experiences organized by AIDA at Jyothi Engineering College.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, description, category..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 font-mono text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Year Filter Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-mono text-xs font-semibold py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-red-600 transition-all cursor-pointer"
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y}>
                      {y === 'All Years' ? 'All Years' : `Year: ${y}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-mono text-xs font-semibold py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-red-600 transition-all cursor-pointer"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3.5 py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Count Banner */}
          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Showing <strong className="text-white">{filteredEvents.length}</strong> of {eventsData.length} events</span>
            {isFiltered && <span className="text-red-400">• Filtered View</span>}
          </div>
        </div>
      </div>

      {/* Grid of Event Cards */}
      <div className="max-w-7xl mx-auto">
        {filteredEvents.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((event) => (
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
        ) : (
          /* Empty Search State */
          <div className="text-center py-20 px-4 bg-neutral-950/60 border border-neutral-800/80 rounded-3xl max-w-xl mx-auto space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
              <Search size={28} />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">No events found</h3>
            <p className="text-neutral-400 text-xs font-mono max-w-sm mx-auto leading-relaxed">
              No events matched your search filters. Try clearing your filters or using broader search terms.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
