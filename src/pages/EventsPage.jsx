import React, { useState, useMemo, useEffect, useRef } from 'react';
import { eventsData } from '../data/siteData';
import EventModal from '../components/EventModal';
import EventArtwork from '../components/EventArtwork';
import PaginationBar from '../components/ui/PaginationBar';
import { ArrowLeft, Search, Calendar, ArrowUpRight, X, RotateCcw, ChevronDown, Check } from 'lucide-react';

function eventSortValue(event) {
  if (event.eventDate) return Date.parse(`${event.eventDate}T00:00:00Z`);
  if (Number.isFinite(Number(event.year))) return Date.UTC(Number(event.year), 0, 1);
  return 0;
}

// Custom Theme Animated Dropdown Component with High Z-Index
function CustomEventDropdown({ icon: Icon, value, options, onChange, defaultLabel = 'All Years' }) {
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

  const selectedOption = options.find((opt) => opt.val === value);
  const displayLabel = selectedOption ? selectedOption.label : defaultLabel;

  return (
    <div ref={dropdownRef} className="relative shrink-0 z-[100]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-red-600/60 text-white font-mono text-xs font-medium px-3.5 py-2.5 rounded-xl cursor-pointer outline-none transition-all shadow-sm active:scale-98"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={15} className="text-red-500 shrink-0" />}
          <span className="truncate">{displayLabel}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-neutral-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-red-500' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 min-w-[170px] w-full bg-[#0e0e11]/98 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-1.5 z-[9999] space-y-1 animate-fadeIn max-h-64 overflow-y-auto custom-scrollbar">
          {options.map((opt) => {
            const isSelected = value === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => {
                  onChange(opt.val);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs font-medium text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white font-bold shadow-sm'
                    : 'text-neutral-300 hover:bg-red-950/50 hover:text-red-400'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={14} className="shrink-0 text-white" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function isHackathonEvent(event) {
  const cat = (event.category || '').toLowerCase();
  const name = (event.name || '').toLowerCase();
  const detail = (event.detail || '').toLowerCase();
  const tags = (event.tags || []).map(t => String(t).toLowerCase());

  return cat.includes('hackathon') ||
    name.includes('hackathon') ||
    detail.includes('hackathon') ||
    tags.some(t => t.includes('hackathon'));
}

export default function EventsPage({ onNavigate, filterParam }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState(() => {
    if (filterParam === 'bootcamps' || filterParam === 'hackathons') {
      return filterParam;
    }
    const hash = window.location.hash || '';
    if (hash.includes('filter=bootcamps')) return 'bootcamps';
    if (hash.includes('filter=hackathons')) return 'hackathons';
    return 'ALL';
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12; // 4 rows of 3-column grid

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync filterParam if prop changes
  useEffect(() => {
    if (filterParam) {
      setActiveCategory(filterParam);
    }
  }, [filterParam]);

  // Extract distinct years list (clean numbers without "Year:" label)
  const yearOptions = useMemo(() => {
    const yearsSet = new Set();
    eventsData.forEach((e) => {
      if (e.year) yearsSet.add(String(e.year));
    });

    const sortedYears = Array.from(yearsSet).sort((a, b) => {
      if (a === 'Archive') return 1;
      if (b === 'Archive') return -1;
      return Number(b) - Number(a);
    });

    const opts = [{ val: 'ALL', label: 'All Years' }];
    sortedYears.forEach((y) => opts.push({ val: y, label: y }));
    return opts;
  }, []);

  // Filter & sort events
  const filteredEvents = useMemo(() => {
    const list = eventsData.filter((event) => {
      // Category filter: bootcamps (no hackathons) vs hackathons (only hackathons)
      if (activeCategory === 'bootcamps' && isHackathonEvent(event)) {
        return false;
      }
      if (activeCategory === 'hackathons' && !isHackathonEvent(event)) {
        return false;
      }

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

      if (selectedYear !== 'ALL' && String(event.year) !== selectedYear) {
        return false;
      }

      return true;
    });

    return list.sort((a, b) => eventSortValue(b) - eventSortValue(a));
  }, [searchQuery, selectedYear, activeCategory]);

  // Reset page to 1 whenever search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear, activeCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const isFiltered = searchQuery.trim() !== '' || selectedYear !== 'ALL' || activeCategory !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedYear('ALL');
    setActiveCategory('ALL');
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
              <span>
                {activeCategory === 'bootcamps'
                  ? 'BOOTCAMPS & WORKSHOPS'
                  : activeCategory === 'hackathons'
                  ? 'COMPETITIVE HACKATHONS'
                  : 'DEPARTMENT EVENTS'}
              </span>
            </span>
          </div>
        </div>

        {/* Page Title & Subtitle */}
        <div className="mt-8 text-center max-w-3xl mx-auto space-y-3">
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase block">
            • AIDA DEPARTMENT REPOSITORY
          </span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            {activeCategory === 'bootcamps' ? (
              <>Department <span className="text-red-600 italic">Bootcamps &amp; Workshops</span></>
            ) : activeCategory === 'hackathons' ? (
              <>Competitive <span className="text-red-600 italic">Hackathons</span> Showcase</>
            ) : (
              <>Department <span className="text-red-600 italic">Events</span> Showcase</>
            )}
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base font-sans leading-relaxed">
            {activeCategory === 'bootcamps'
              ? 'Explore skill-building bootcamps, technical workshops, guest lectures, and hands-on training sessions.'
              : activeCategory === 'hackathons'
              ? 'Explore national and institutional competitive hackathons, innovation challenges, and hack sprints.'
              : 'Explore workshops, hackathons, inaugurations, symposiums, and immersive technical experiences organized by AIDA at Jyothi Engineering College.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="max-w-7xl mx-auto mb-10 relative z-40">
        <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-xl space-y-4 relative z-40">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'ALL'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('bootcamps')}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'bootcamps'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                Bootcamps &amp; Workshops
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('hackathons')}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'hackathons'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                Hackathons
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, description..."
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
            <div className="flex flex-wrap items-center gap-3 relative z-50">
              {/* Year Custom Theme Dropdown */}
              <CustomEventDropdown
                icon={Calendar}
                value={selectedYear}
                options={yearOptions}
                onChange={setSelectedYear}
                defaultLabel="All Years"
              />

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
        </div>
      </div>

      {/* Grid of Event Cards */}
      <div className="max-w-7xl mx-auto">
        {filteredEvents.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedEvents.map((event) => (
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

            {/* Pagination Controls */}
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
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
