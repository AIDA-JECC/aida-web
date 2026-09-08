import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookOpen,
  UserCheck,
  GraduationCap,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Calendar,
  Layers,
  Award,
  Maximize2,
  Minimize2,
  FileText,
  Bookmark,
  Users,
  Landmark,
  Grid,
  List,
} from 'lucide-react';
import { staffPublications, studentPublications } from '../data/publicationsData';
import SafeImage from './ui/SafeImage';

// Mappings for Indexing Short Forms & Dropdown Labels
const INDEXING_MAP = {
  'google scholar': { short: 'GS', full: 'Google Scholar' },
  'gs': { short: 'GS', full: 'Google Scholar' },
  'iterative international publishers': { short: 'IIP', full: 'Iterative International Publishers' },
  'iip': { short: 'IIP', full: 'Iterative International Publishers' },
  'scopus': { short: 'Scopus', full: 'Scopus' },
  'scie': { short: 'SCIE', full: 'Science Citation Index Expanded' },
  'sci': { short: 'SCI', full: 'Science Citation Index' },
  'ugc care': { short: 'UGC CARE', full: 'UGC CARE' },
  'esci': { short: 'ESCI', full: 'Emerging Sources Citation Index' },
};

function formatIndexingBadge(val) {
  if (!val) return 'N/A';
  const k = String(val).toLowerCase().trim();
  if (INDEXING_MAP[k]) return INDEXING_MAP[k].short;
  if (k.includes('iterative')) return 'IIP';
  if (k.includes('google')) return 'GS';
  return val;
}

function formatIndexingDropdownLabel(val) {
  if (!val || val === 'ALL') return 'All Indexings';
  const k = String(val).toLowerCase().trim();
  if (INDEXING_MAP[k]) {
    const { short, full } = INDEXING_MAP[k];
    if (short === full) return short;
    return `${short} (${full})`;
  }
  if (k.includes('iterative')) return 'IIP (Iterative Intl)';
  if (k.includes('google')) return 'GS (Google Scholar)';
  return val;
}

function parseYearForSort(item) {
  if (item.year) {
    const p = parseInt(item.year, 10);
    if (!isNaN(p)) return p;
  }
  if (item.date) {
    const match = item.date.match(/\d{4}/);
    if (match) return parseInt(match[0], 10);
  }
  if (item.batch) {
    const match = item.batch.match(/\d{4}/);
    if (match) return parseInt(match[0], 10);
  }
  return 0;
}

// Custom Dropdown Component for Publications Filter
function CustomPubDropdown({ icon: Icon, value, options, onChange, defaultLabel = 'All' }) {
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
    <div ref={dropdownRef} className="relative min-w-[130px] sm:min-w-[140px] shrink-0 z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-red-600/60 text-white font-mono text-xs font-medium px-3 sm:px-3.5 py-2.5 rounded-xl cursor-pointer outline-none transition-all shadow-sm active:scale-98"
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
        <div className="absolute right-0 sm:left-0 top-full mt-2 min-w-[190px] w-full bg-[#0e0e11]/95 backdrop-blur-xl border border-neutral-800/90 rounded-2xl shadow-xl p-1.5 z-[100] space-y-1 animate-fadeIn max-h-64 overflow-y-auto custom-scrollbar">
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

export default function PublicationsSection({ showAll = false, defaultTab = 'staff', onNavigate }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'staff' | 'student'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedIndexing, setSelectedIndexing] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpandedAll, setIsExpandedAll] = useState(false);
  const itemsPerPage = 10;

  const effectiveShowAll = showAll || isExpandedAll;

  // Reset page and filters when switching tab
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedIndexing('ALL');
    setCurrentPage(1);
  };

  // Staff Publications options & filtered list
  const staffTypes = useMemo(() => {
    const set = new Set();
    staffPublications.forEach((p) => {
      if (p.publicationType) set.add(p.publicationType);
    });
    return Array.from(set);
  }, []);

  const staffIndexings = useMemo(() => {
    const set = new Set();
    staffPublications.forEach((p) => {
      if (p.indexing) set.add(p.indexing);
    });
    return Array.from(set);
  }, []);

  const filteredStaffPubs = useMemo(() => {
    const filtered = staffPublications.filter((pub) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pub.paperTitle.toLowerCase().includes(q) ||
        pub.facultyName.toLowerCase().includes(q) ||
        pub.venue.toLowerCase().includes(q) ||
        pub.publisher.toLowerCase().includes(q) ||
        pub.indexing.toLowerCase().includes(q);

      const matchesType = selectedType === 'ALL' || pub.publicationType === selectedType;
      const matchesIndexing = selectedIndexing === 'ALL' || pub.indexing === selectedIndexing;

      return matchesSearch && matchesType && matchesIndexing;
    });

    // Ensure latest-first sort
    return filtered.sort((a, b) => parseYearForSort(b) - parseYearForSort(a));
  }, [searchQuery, selectedType, selectedIndexing]);

  // Student Publications options & filtered list
  const studentConferences = useMemo(() => {
    const set = new Set();
    studentPublications.forEach((p) => {
      if (p.conference) set.add(p.conference);
    });
    return Array.from(set);
  }, []);

  const filteredStudentPubs = useMemo(() => {
    const filtered = studentPublications.filter((pub) => {
      const q = searchQuery.toLowerCase().trim();
      const authorsMatch = pub.authors ? pub.authors.some((a) => a.toLowerCase().includes(q)) : false;
      const regNosMatch = pub.registerNumbers ? pub.registerNumbers.some((r) => r.toLowerCase().includes(q)) : false;
      const matchesSearch =
        !q ||
        pub.paperTitle.toLowerCase().includes(q) ||
        authorsMatch ||
        regNosMatch ||
        (pub.guide && pub.guide.toLowerCase().includes(q)) ||
        (pub.conference && pub.conference.toLowerCase().includes(q));

      const matchesType = selectedType === 'ALL' || pub.conference === selectedType;

      return matchesSearch && matchesType;
    });

    // Ensure latest-first sort
    return filtered.sort((a, b) => parseYearForSort(b) - parseYearForSort(a));
  }, [searchQuery, selectedType]);

  // Active Dataset & Pagination
  const activeDataset = activeTab === 'staff' ? filteredStaffPubs : filteredStudentPubs;
  const totalPages = Math.ceil(activeDataset.length / itemsPerPage) || 1;

  const displayItems = useMemo(() => {
    if (effectiveShowAll) return activeDataset;
    const start = (currentPage - 1) * itemsPerPage;
    return activeDataset.slice(start, start + itemsPerPage);
  }, [activeDataset, currentPage, itemsPerPage, effectiveShowAll]);

  // Dropdown options
  const staffTypeOptions = useMemo(() => {
    const opts = [{ val: 'ALL', label: 'All Publication Types' }];
    staffTypes.forEach((t) => opts.push({ val: t, label: t }));
    return opts;
  }, [staffTypes]);

  const staffIndexingOptions = useMemo(() => {
    const opts = [{ val: 'ALL', label: 'All Indexings' }];
    staffIndexings.forEach((i) => opts.push({ val: i, label: formatIndexingDropdownLabel(i) }));
    return opts;
  }, [staffIndexings]);

  const studentConferenceOptions = useMemo(() => {
    const opts = [{ val: 'ALL', label: 'All Conferences' }];
    studentConferences.forEach((c) => opts.push({ val: c, label: c }));
    return opts;
  }, [studentConferences]);

  const handleExpandOrNavigate = () => {
    if (!showAll) {
      if (onNavigate) {
        onNavigate('publications');
      } else {
        window.location.hash = '#/publications';
      }
    } else {
      setIsExpandedAll(!isExpandedAll);
    }
  };

  return (
    <section id="publications" className="relative py-12 sm:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white scroll-mt-20">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-2 sm:space-y-3">
        <span className="font-mono text-xs tracking-widest text-red-500 uppercase block font-semibold">
          • ACADEMIC WORKS
        </span>

        <h2 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          Research &amp; <span className="text-red-600 italic">Publications</span>
        </h2>

        <p className="text-neutral-400 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed font-sans px-2">
          Discover innovative research, projects, and conference papers from the students and faculty of AIDA JECC.
        </p>
      </div>

      {/* Tabs Switcher: Student Publications vs Staff Publications */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        {/* Desktop View (Tabs buttons) */}
        <div className="hidden sm:inline-flex p-1 sm:p-1.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-lg backdrop-blur-md max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabSwitch('student')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-mono text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
              activeTab === 'student'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-[1.02]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <GraduationCap size={15} className={activeTab === 'student' ? 'text-white' : 'text-red-500'} />
            <span>STUDENT PUBLICATIONS</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('staff')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-mono text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
              activeTab === 'staff'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-[1.02]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <UserCheck size={15} className={activeTab === 'staff' ? 'text-white' : 'text-red-500'} />
            <span>STAFF PUBLICATIONS</span>
          </button>
        </div>

        {/* Mobile View Dropdown Switcher */}
        <div className="block sm:hidden w-full max-w-xs px-2">
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => handleTabSwitch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-white font-mono text-xs font-bold px-4 py-3 rounded-xl appearance-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-md cursor-pointer"
            >
              <option value="student">STUDENT PUBLICATIONS</option>
              <option value="staff">STAFF PUBLICATIONS</option>
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Controls Toolbar: Search & Filters */}
      <div className="relative z-40 mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                activeTab === 'staff'
                  ? 'Search by faculty, title, journal or indexing...'
                  : 'Search papers, authors...'
              }
              className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600/60 focus:ring-1 focus:ring-red-600/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white bg-neutral-800 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
            {activeTab === 'staff' ? (
              <>
                <CustomPubDropdown
                  icon={Layers}
                  value={selectedType}
                  options={staffTypeOptions}
                  onChange={(val) => {
                    setSelectedType(val);
                    setCurrentPage(1);
                  }}
                  defaultLabel="All Publication Types"
                />
                <CustomPubDropdown
                  icon={Award}
                  value={selectedIndexing}
                  options={staffIndexingOptions}
                  onChange={(val) => {
                    setSelectedIndexing(val);
                    setCurrentPage(1);
                  }}
                  defaultLabel="All Indexings"
                />
              </>
            ) : (
              <CustomPubDropdown
                icon={Award}
                value={selectedType}
                options={studentConferenceOptions}
                onChange={(val) => {
                  setSelectedType(val);
                  setCurrentPage(1);
                }}
                defaultLabel="All Conferences"
              />
            )}
          </div>
        </div>
      </div>

      {/* Publications List Container */}
      <div className="relative z-10">
        {activeTab === 'staff' ? (
          <div className="bg-[#080808] border border-neutral-800/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-neutral-800/90 bg-[#0c0c0e]/90 text-red-500 font-mono text-xs sm:text-sm font-semibold tracking-wide select-none">
                    <th className="py-4 px-4 sm:px-6 w-[25%]">Faculty Member</th>
                    <th className="py-4 px-4 sm:px-6 w-[35%]">Paper Title</th>
                    <th className="py-4 px-4 sm:px-6 w-[22%]">Journal / Conference</th>
                    <th className="py-4 px-4 sm:px-6 w-[10%]">Indexing</th>
                    <th className="py-4 px-4 sm:px-6 w-[8%] text-center">DOI / Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50 text-sm font-sans">
                  {displayItems.length > 0 ? (
                    displayItems.map((item) => (
                      <tr
                        key={item.id}
                        className="group hover:bg-neutral-900/60 transition-colors duration-150"
                      >
                        <td className="py-4 px-4 sm:px-6">
                          <button
                            type="button"
                            onClick={() => {
                              if (onNavigate) {
                                onNavigate('faculty', item.facultySlug || item.facultyName);
                              } else {
                                window.location.hash = `#/faculty/${item.facultySlug || item.facultyName}`;
                              }
                            }}
                            className="flex items-center gap-3 text-left group/fac cursor-pointer"
                          >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-neutral-900 border-2 border-red-600/40 shrink-0 shadow-md group-hover/fac:border-red-500 group-hover/fac:scale-105 transition-all">
                              <SafeImage
                                src={item.facultyImage ? `${item.facultyImage}-320.webp` : ''}
                                alt={item.facultyName}
                                category="Faculty"
                                initials={item.initials || 'FC'}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-white group-hover/fac:text-red-400 transition-colors text-sm sm:text-base block">
                                {item.facultyName}
                              </span>
                              <span className="text-[11px] font-mono text-neutral-400 block">
                                {item.publicationType}
                              </span>
                            </div>
                          </button>
                        </td>

                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-semibold text-neutral-100 group-hover:text-white transition-colors text-sm leading-snug block">
                            {item.paperTitle}
                          </span>
                          {item.publisher && (
                            <span className="text-xs text-neutral-500 font-mono block mt-1">
                              Publisher: {item.publisher}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-neutral-300 text-xs sm:text-sm">
                          <span className="line-clamp-2">{item.venue || '—'}</span>
                          <span className="text-[11px] font-mono text-neutral-500 block mt-0.5">
                            {item.date}
                          </span>
                        </td>

                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider ${
                              item.indexing && item.indexing.toLowerCase().includes('scopus')
                                ? 'bg-purple-950/70 border border-purple-500/40 text-purple-300'
                                : item.indexing && item.indexing.toLowerCase().includes('sci')
                                ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                                : 'bg-neutral-900 border border-neutral-700 text-neutral-300'
                            }`}
                          >
                            {formatIndexingBadge(item.indexing)}
                          </span>
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-center">
                          {item.doiUrl ? (
                            <a
                              href={item.doiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center p-2 rounded-xl bg-neutral-900 hover:bg-red-600/20 border border-neutral-800 hover:border-red-500/60 text-red-400 hover:text-white transition-all group/link"
                              title={item.doi ? `DOI: ${item.doi}` : 'View Publication Link'}
                            >
                              <ExternalLink size={15} className="group-hover/link:scale-110 transition-transform" />
                            </a>
                          ) : (
                            <span className="text-neutral-600 font-mono text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-neutral-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search size={32} className="text-neutral-600 mb-1" />
                          <p className="font-semibold text-neutral-300">No staff publication records found</p>
                          <p className="text-xs text-neutral-500">Try adjusting your search query or filter tags.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* STUDENT PUBLICATIONS MINIMAL TABLE VIEW */
          <div className="bg-[#080808] border border-neutral-800/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-neutral-800/90 bg-[#0c0c0e]/90 text-red-500 font-mono text-xs sm:text-sm font-semibold tracking-wide select-none">
                    <th className="py-4 px-4 sm:px-6 w-[36%]">Paper Title</th>
                    <th className="py-4 px-4 sm:px-6 w-[28%]">Student Authors</th>
                    <th className="py-4 px-4 sm:px-6 w-[22%]">Conference &amp; Guide</th>
                    <th className="py-4 px-4 sm:px-5 w-[8%] text-center">Batch</th>
                    <th className="py-4 px-4 sm:px-5 w-[6%] text-center">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50 text-sm font-sans">
                  {displayItems.length > 0 ? (
                    displayItems.map((item) => {
                      let authorsList = [];
                      if (item.teamMembers && item.teamMembers.length > 0) {
                        authorsList = item.teamMembers.map((m) => m.name);
                      } else if (item.authors && Array.isArray(item.authors)) {
                        authorsList = item.authors;
                      }

                      const badgeLabel = (item.projectType || 'MAIN PROJECT').toUpperCase();
                      const venueText = item.conference || 'ACCESS 2025';
                      const guideText = item.guide ? `Guide: ${item.guide}` : null;
                      const yearText = item.batch || item.year || '2021 – 25';
                      const doiLink = item.doiUrl || (item.doi ? `https://doi.org/${item.doi}` : null);

                      return (
                        <tr
                          key={item.id}
                          className="group hover:bg-neutral-900/60 transition-colors duration-150"
                        >

                          {/* Paper Title + Project Type Badge */}
                          <td className="py-4 px-4 sm:px-6">
                            <span className="font-semibold text-neutral-100 group-hover:text-white transition-colors text-sm leading-snug block">
                              {item.paperTitle}
                            </span>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="border border-red-600/60 bg-red-950/30 text-red-400 text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                                {badgeLabel}
                              </span>
                            </div>
                          </td>

                          {/* Student Authors */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex flex-wrap gap-1.5">
                              {authorsList.map((author, aIdx) => (
                                <span
                                  key={aIdx}
                                  className="bg-[#14141d] border border-neutral-800 px-2.5 py-0.5 rounded-lg text-xs font-sans text-neutral-300 font-medium"
                                >
                                  {author}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Conference / Venue & Guide */}
                          <td className="py-4 px-4 sm:px-6 text-xs text-neutral-300">
                            <span className="font-mono font-bold text-white block uppercase">
                              {venueText}
                            </span>
                            {guideText && (
                              <span className="text-neutral-400 font-sans text-[11px] block mt-0.5">
                                {guideText}
                              </span>
                            )}
                          </td>

                          {/* Batch / Year */}
                          <td className="py-4 px-4 sm:px-5 text-center font-mono text-xs text-neutral-300 whitespace-nowrap">
                            {yearText}
                          </td>

                          {/* DOI / External Link */}
                          <td className="py-4 px-4 sm:px-5 text-center">
                            {doiLink ? (
                              <a
                                href={doiLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center p-2 rounded-xl bg-neutral-900 hover:bg-red-600/20 border border-neutral-800 hover:border-red-500/60 text-red-400 hover:text-white transition-all group/link"
                                title={item.doi ? `DOI: ${item.doi}` : 'View Publication Link'}
                              >
                                <ExternalLink size={15} className="group-hover/link:scale-110 transition-transform" />
                              </a>
                            ) : (
                              <span className="text-neutral-600 font-mono text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search size={32} className="text-neutral-600 mb-1" />
                          <p className="font-semibold text-neutral-300">No student publication records found</p>
                          <p className="text-xs text-neutral-500">Try adjusting your search query or filter tags.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-neutral-800/90 bg-[#0c0c0e]/90 text-xs font-mono text-neutral-400 mt-4 rounded-2xl">
          <div>
            {effectiveShowAll ? (
              <>Listing all <span className="text-red-500 font-bold">{displayItems.length}</span> records</>
            ) : (
              <>
                Showing{' '}
                <span className="text-red-500 font-semibold">
                  {activeDataset.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                </span>{' '}
                to{' '}
                <span className="text-red-500 font-semibold">
                  {Math.min(currentPage * itemsPerPage, activeDataset.length)}
                </span>{' '}
                of{' '}
                <span className="text-red-500 font-semibold">{activeDataset.length}</span> records
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={effectiveShowAll || currentPage === 1}
              className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={handleExpandOrNavigate}
              className={`px-3.5 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
                effectiveShowAll
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60'
              }`}
              title={!showAll ? 'Open full Publications page' : (effectiveShowAll ? 'Switch back to paginated view' : 'Show all records on one page')}
            >
              {!showAll ? (
                <>
                  <span>VIEW ALL PUBLICATIONS</span>
                  <ExternalLink size={13} className="shrink-0 text-red-400" />
                </>
              ) : effectiveShowAll ? (
                <>
                  <Minimize2 size={13} className="shrink-0 text-white" />
                  <span>Showing All ({activeDataset.length})</span>
                </>
              ) : (
                <>
                  <span>Page {currentPage} of {totalPages}</span>
                  <span className="text-red-400 ml-0.5 flex items-center" title="Show All">
                    <Maximize2 size={13} className="shrink-0" />
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={effectiveShowAll || currentPage === totalPages}
              className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
