import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  User,
  Building2,
  Briefcase,
  Calendar,
  Globe,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Maximize2,
  Minimize2,
  Layers,
} from 'lucide-react';
import { placementsData } from '../data/placementsData';

// Custom Theme-Matched Animated Dropdown Component
function CustomPlacementDropdown({ icon: Icon, value, options, onChange, defaultLabel = 'All' }) {
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
    <div ref={dropdownRef} className="relative min-w-[140px] shrink-0 z-50">
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
        <div className="absolute right-0 sm:left-0 top-full mt-2 min-w-[170px] w-full bg-[#0e0e11]/95 backdrop-blur-xl border border-neutral-800/90 rounded-2xl shadow-xl p-1.5 z-[100] space-y-1 animate-fadeIn max-h-64 overflow-y-auto custom-scrollbar">
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

// Component for rendering compact company logo in infinite marquee
function CompactCompanyLogo({ companyName, logoUrl }) {
  const [imgError, setImgError] = useState(false);

  const logoFallback = useMemo(() => {
    if (!companyName) return 'CO';
    const words = companyName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return companyName.substring(0, 2).toUpperCase();
  }, [companyName]);

  return (
    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/95 rounded p-0.5 border border-neutral-700/50 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={companyName}
          onError={() => setImgError(true)}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center text-neutral-900 font-bold text-[8px] font-mono leading-none uppercase">
          <span>{logoFallback}</span>
        </div>
      )}
    </div>
  );
}

// Helper to normalize company names
function normalizeCompanyName(name) {
  if (!name) return '';
  return name.trim();
}

// Smooth & Legible Infinite-Scrolling Company Logo Marquee Component (Slowed down to 100s)
function CompanyMarquee({ companies, selectedCompany, onSelectCompany }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pauseTimeoutRef = useRef(null);

  const triggerPause = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const marqueeItems = useMemo(() => {
    if (!companies || companies.length === 0) return [];
    if (companies.length < 8) {
      return [...companies, ...companies, ...companies, ...companies];
    }
    return [...companies, ...companies];
  }, [companies]);

  if (marqueeItems.length === 0) return null;

  return (
    <div
      className="relative z-30 mb-8 overflow-hidden bg-neutral-950/40 border-x border-red-900/40 border-y-0 py-2.5 sm:py-3 px-2 backdrop-blur-md"
    >
      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-10" />

      <div
        className="flex items-center gap-2.5 sm:gap-3.5 w-max animate-marqueeTrack"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        onTouchStart={triggerPause}
        onClick={triggerPause}
      >
        {marqueeItems.map((comp, idx) => {
          const isSelected = selectedCompany === comp.companyName;
          return (
            <button
              key={`${comp.companyName}-${idx}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerPause();
                onSelectCompany(isSelected ? 'ALL' : comp.companyName);
              }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-mono text-xs transition-all duration-200 cursor-pointer shrink-0 border select-none ${
                isSelected
                  ? 'bg-red-600/30 border-red-500 text-white font-bold'
                  : 'bg-neutral-900/90 hover:bg-neutral-850 border-neutral-800/80 text-neutral-300 hover:border-red-600/50 hover:text-white'
              }`}
              title={`Filter by ${comp.companyName}`}
            >
              <CompactCompanyLogo companyName={comp.companyName} logoUrl={comp.logoUrl} />
              <span className="truncate max-w-[130px] sm:max-w-[170px]">{comp.companyName}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes marqueeTrack {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marqueeTrack {
          animation: marqueeTrack 100s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function PlacementsSection({ showAll = false, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpandedAll, setIsExpandedAll] = useState(false);
  const itemsPerPage = 10;

  const effectiveShowAll = showAll || isExpandedAll;

  // Extract counts for placements vs internships
  const { placementCount, internshipCount } = useMemo(() => {
    let pCount = 0;
    let iCount = 0;
    placementsData.forEach(item => {
      if (item.type === 'Placement') pCount++;
      else if (item.type === 'Internship') iCount++;
    });
    return { placementCount: pCount, internshipCount: iCount };
  }, []);

  // Extract unique years and top companies for filters
  const { availableYears, availableCompanies } = useMemo(() => {
    const yearsSet = new Set();
    const companyCountMap = new Map();

    placementsData.forEach((item) => {
      if (item.year) yearsSet.add(item.year);
      if (item.companyName) {
        const normName = normalizeCompanyName(item.companyName);
        companyCountMap.set(
          normName,
          (companyCountMap.get(normName) || 0) + 1
        );
      }
    });

    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
    const sortedCompanies = Array.from(companyCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return {
      availableYears: sortedYears,
      availableCompanies: sortedCompanies,
    };
  }, []);

  // Extract unique company list with logoUrl for infinite marquee
  const uniqueCompaniesList = useMemo(() => {
    const map = new Map();
    placementsData.forEach((item) => {
      if (item.companyName) {
        const normName = normalizeCompanyName(item.companyName);
        if (!map.has(normName)) {
          map.set(normName, {
            companyName: normName,
            logoUrl: item.logoUrl,
            cleanDomain: item.cleanDomain,
          });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.companyName.localeCompare(b.companyName));
  }, []);

  // Theme-matched custom dropdown options for selecting Placements or Internships
  const typeOptions = useMemo(() => [
    { val: 'ALL', label: 'All Opportunities' },
    { val: 'Placement', label: `Placements (${placementCount})` },
    { val: 'Internship', label: `Internships (${internshipCount})` },
  ], [placementCount, internshipCount]);

  const yearOptions = useMemo(() => {
    const opts = [{ val: 'ALL', label: 'All Years' }];
    availableYears.forEach((y) => opts.push({ val: String(y), label: String(y) }));
    return opts;
  }, [availableYears]);

  const companyOptions = useMemo(() => {
    const opts = [{ val: 'ALL', label: 'All Companies' }];
    availableCompanies.forEach((c) => opts.push({ val: c, label: c }));
    return opts;
  }, [availableCompanies]);

  // Filtered dataset based on search, type, year, and company selection
  const filteredPlacements = useMemo(() => {
    return placementsData.filter((item) => {
      const normComp = normalizeCompanyName(item.companyName);
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        normComp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cleanDomain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === 'ALL' || item.type === selectedType;

      const matchesYear =
        selectedYear === 'ALL' || String(item.year) === String(selectedYear);

      const matchesCompany =
        selectedCompany === 'ALL' || normComp === selectedCompany;

      return matchesSearch && matchesType && matchesYear && matchesCompany;
    });
  }, [searchQuery, selectedType, selectedYear, selectedCompany]);

  // Record set calculation
  const totalPages = Math.ceil(filteredPlacements.length / itemsPerPage) || 1;
  const [progressiveLimit, setProgressiveLimit] = useState(null);

  const displayItems = useMemo(() => {
    if (effectiveShowAll) {
      if (progressiveLimit !== null) {
        return filteredPlacements.slice(0, progressiveLimit);
      }
      return filteredPlacements;
    }
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlacements.slice(start, start + itemsPerPage);
  }, [filteredPlacements, currentPage, itemsPerPage, effectiveShowAll, progressiveLimit]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleCompanyChange = (company) => {
    setSelectedCompany(company);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handler for expand / view full page button click
  const handleExpandOrNavigate = () => {
    if (!showAll) {
      if (onNavigate) {
        onNavigate('placements');
      } else {
        window.location.hash = '#/placements';
      }
    } else {
      if (!isExpandedAll) {
        // Immediate 1st frame: load 5 more rows instantly
        const initialChunk = Math.min((currentPage * itemsPerPage) + 5, filteredPlacements.length);
        setProgressiveLimit(initialChunk);
        setIsExpandedAll(true);
        // 2nd frame: load all remaining items seamlessly in background
        requestAnimationFrame(() => {
          setTimeout(() => {
            setProgressiveLimit(null);
          }, 40);
        });
      } else {
        setIsExpandedAll(false);
        setProgressiveLimit(null);
      }
    }
  };

  return (
    <section id="placements" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white scroll-mt-20">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-3">
        <span className="font-mono text-xs tracking-widest text-red-500 uppercase block font-semibold">
          • CAREER MILESTONES &amp; RECRUITMENT
        </span>

        <h2 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          AIDA <span className="text-red-600 italic">Placements &amp; Internships</span>
        </h2>

        <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-sans">
          Celebrating student achievements across leading industry pioneers.
        </p>
      </div>

      {/* Interactive Controls & Filters Toolbar */}
      <div className="relative z-40 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by student, company or role..."
              className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600/60 focus:ring-1 focus:ring-red-600/30 transition-all"
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

          {/* Filter Dropdowns (Theme-matched Type, Year & Company Dropdowns) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Custom Theme-Matched Category Dropdown (Placements vs Internships) */}
            <CustomPlacementDropdown
              icon={Layers}
              value={selectedType}
              options={typeOptions}
              onChange={handleTypeChange}
              defaultLabel="All Opportunities"
            />

            {/* Custom Theme-Matched Year Dropdown */}
            <CustomPlacementDropdown
              icon={Calendar}
              value={selectedYear}
              options={yearOptions}
              onChange={handleYearChange}
              defaultLabel="All Years"
            />

            {/* Custom Theme-Matched Company Dropdown */}
            <CustomPlacementDropdown
              icon={Building2}
              value={selectedCompany}
              options={companyOptions}
              onChange={handleCompanyChange}
              defaultLabel="All Companies"
            />
          </div>
        </div>
      </div>

      {/* Premium Infinite-Scrolling Company Logo Marquee (Slowed down to 100s for legibility) */}
      <CompanyMarquee
        companies={uniqueCompaniesList}
        selectedCompany={selectedCompany}
        onSelectCompany={handleCompanyChange}
      />

      {/* Clean 5-Column Placement & Internship Table Container */}
      <div className="relative z-10 bg-[#080808] border border-neutral-800/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Clean 5-Column Table Header */}
            <thead>
              <tr className="border-b border-neutral-800/90 bg-[#0c0c0e]/90 text-red-500 font-mono text-xs sm:text-sm font-semibold tracking-wide select-none">
                <th className="py-4 px-4 sm:px-6 w-[28%]">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-red-500" />
                    <span>Student</span>
                  </div>
                </th>
                <th className="py-4 px-4 sm:px-6 w-[30%]">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-red-500" />
                    <span>Company</span>
                  </div>
                </th>
                <th className="py-4 px-4 sm:px-6 w-[22%]">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-red-500" />
                    <span>Designation</span>
                  </div>
                </th>
                <th className="py-4 px-4 sm:px-6 w-[10%]">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-red-500" />
                    <span>Year</span>
                  </div>
                </th>
                <th className="py-4 px-4 sm:px-6 w-[10%]">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-red-500" />
                    <span>Site</span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-neutral-800/50 text-sm font-sans">
              {displayItems.length > 0 ? (
                displayItems.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-neutral-900/60 transition-colors duration-150 cursor-pointer"
                  >
                    {/* Student Column (Text Name Only) */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-semibold text-white group-hover:text-red-400 transition-colors text-sm sm:text-base">
                        {item.studentName}
                      </span>
                    </td>

                    {/* Company Name Column */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.logoUrl}
                          alt={item.companyName}
                          className="w-5 h-5 object-contain rounded-full bg-white/10 p-0.5 shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span className="font-medium text-neutral-100 text-sm">
                          {item.companyName}
                        </span>
                      </div>
                    </td>

                    {/* Designation Column */}
                    <td className="py-3.5 px-4 sm:px-6 text-neutral-300 text-sm">
                      {item.designation}
                    </td>

                    {/* Year Column */}
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-neutral-300 text-sm">
                      {item.year}
                    </td>

                    {/* Site Column */}
                    <td className="py-3.5 px-4 sm:px-6">
                      {item.companyWebsite ? (
                        <a
                          href={item.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline font-mono text-xs transition-colors"
                          title={`Visit ${item.cleanDomain}`}
                        >
                          <span className="truncate max-w-[120px]">
                            {item.cleanDomain}
                          </span>
                          <ExternalLink size={13} className="shrink-0" />
                        </a>
                      ) : (
                        <span className="text-neutral-500 font-mono text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="text-neutral-600 mb-1" />
                      <p className="font-semibold text-neutral-300">
                        No placement or internship records found
                      </p>
                      <p className="text-xs text-neutral-500">
                        Try adjusting your search criteria or filter tags.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedType('ALL');
                          setSelectedYear('ALL');
                          setSelectedCompany('ALL');
                        }}
                        className="mt-2 text-xs text-red-500 hover:underline font-mono cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4 p-0 sm:p-4 border-t-0 sm:border-t border-neutral-800/90 bg-transparent sm:bg-[#0c0c0e]/90 text-xs font-mono text-neutral-400 mt-4 sm:mt-0">
          <div className="hidden sm:block">
            {effectiveShowAll ? (
              <>Listing all <span className="text-red-500 font-bold">{displayItems.length}</span> records</>
            ) : (
              <>
                Showing{' '}
                <span className="text-red-500 font-semibold">
                  {filteredPlacements.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                </span>{' '}
                to{' '}
                <span className="text-red-500 font-semibold">
                  {Math.min(currentPage * itemsPerPage, filteredPlacements.length)}
                </span>{' '}
                of{' '}
                <span className="text-red-500 font-semibold">{filteredPlacements.length}</span> records
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

            {/* Expand / View Dedicated Page Button */}
            <button
              type="button"
              onClick={handleExpandOrNavigate}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
                effectiveShowAll
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60'
              }`}
              title={!showAll ? 'Open full Placements & Internships page' : (effectiveShowAll ? 'Switch back to paginated view' : 'Show all records on one page')}
            >
              {!showAll ? (
                <>
                  <span className="hidden sm:inline">VIEW ALL PLACEMENTS & INTERNSHIPS</span>
                  <span className="sm:hidden">VIEW ALL</span>
                  <ExternalLink size={13} className="shrink-0 text-red-400" />
                </>
              ) : effectiveShowAll ? (
                <>
                  <Minimize2 size={13} className="shrink-0 text-white" />
                  <span className="hidden sm:inline">Showing All ({filteredPlacements.length})</span>
                  <span className="sm:hidden">All ({filteredPlacements.length})</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Page {currentPage} of {totalPages}</span>
                  <span className="sm:hidden">{currentPage}/{totalPages}</span>
                  <span className="text-red-400 ml-0.5 flex items-center" title="Show All">
                    <Maximize2 size={13} className="shrink-0" />
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
