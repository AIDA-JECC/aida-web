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
} from 'lucide-react';
import { placementsData } from '../data/placementsData';
import SafeImage from './ui/SafeImage';

// Floating Awwwards-style Hover Preview Card showing ONLY the student image dynamically
function StudentHoverPreviewCard({ student, mousePos }) {
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!mousePos) return;

    const CARD_WIDTH = 140;
    const CARD_HEIGHT = 175;
    const OFFSET = 18;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Position horizontally (right of cursor if room, else left)
    let left = mousePos.x + OFFSET;
    if (left + CARD_WIDTH > viewportWidth - 12) {
      left = mousePos.x - CARD_WIDTH - OFFSET;
    }

    // Position vertically (below cursor if room, else above)
    let top = mousePos.y + OFFSET;
    if (top + CARD_HEIGHT > viewportHeight - 12) {
      top = mousePos.y - CARD_HEIGHT - OFFSET;
    }

    // Clamp inside screen bounds
    left = Math.max(10, Math.min(left, viewportWidth - CARD_WIDTH - 10));
    top = Math.max(10, Math.min(top, viewportHeight - CARD_HEIGHT - 10));

    setPos({ left, top });
  }, [mousePos]);

  if (!student || !mousePos) return null;

  const displayInitials = student.studentName
    ? student.studentName.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
    : 'ST';

  return (
    <div
      className="fixed z-[99999] pointer-events-none transition-all duration-75 ease-out animate-fadeIn select-none hidden md:block"
      style={{
        left: `${pos.left}px`,
        top: `${pos.top}px`,
      }}
    >
      <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden border border-red-900/60 bg-neutral-900 shadow-2xl">
        <SafeImage
          src={student.studentImage}
          alt={student.studentName}
          category=""
          initials={displayInitials}
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  );
}

// Component for rendering student avatar with placeholder fallback
function StudentAvatar({ studentName, imageSrc }) {
  const [imgError, setImgError] = useState(false);

  // Generate fallback initials from student name
  const initials = useMemo(() => {
    if (!studentName) return 'ST';
    const parts = studentName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return studentName.substring(0, 2).toUpperCase();
  }, [studentName]);

  // Color generator for avatar placeholder ring
  const avatarGradient = useMemo(() => {
    const gradients = [
      'from-red-950/40 to-neutral-900 border-red-900/40 text-red-400',
      'from-neutral-900 to-red-950/50 border-red-800/40 text-red-300',
      'from-red-900/30 to-zinc-900 border-red-900/50 text-red-400',
    ];
    let hash = 0;
    for (let i = 0; i < studentName.length; i++) {
      hash = studentName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  }, [studentName]);

  if (imageSrc && !imgError) {
    return (
      <img
        src={imageSrc}
        alt={studentName}
        onError={() => setImgError(true)}
        className="w-10 h-10 rounded-full object-cover border border-red-900/40 shadow-sm shrink-0"
      />
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} border flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300`}
    >
      <span className="font-mono text-xs font-bold tracking-wider">{initials}</span>
    </div>
  );
}

// Component for rendering company logo with fallback box
function CompanyLogo({ companyName, logoUrl }) {
  const [imgError, setImgError] = useState(false);

  const logoFallback = useMemo(() => {
    if (!companyName) return 'CO';
    const words = companyName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return companyName.substring(0, 3).toUpperCase();
  }, [companyName]);

  return (
    <div className="w-16 h-8 sm:w-20 sm:h-9 bg-white/95 rounded-md p-1 border border-neutral-700/50 flex items-center justify-center shrink-0 shadow-sm overflow-hidden group-hover:border-red-600/50 transition-colors">
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={companyName}
          onError={() => setImgError(true)}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center gap-1 text-neutral-900 font-bold text-[10px] font-mono tracking-tighter uppercase px-1">
          <Building2 size={11} className="text-red-700 shrink-0" />
          <span className="truncate">{logoFallback}</span>
        </div>
      )}
    </div>
  );
}

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
    <div ref={dropdownRef} className="relative min-w-[150px] shrink-0 z-50">
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

// Component for rendering compact company logo in infinite marquee with fallback
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

// Helper to normalize company names (merges variations like ESAF / ESAF Small Finance Bank & TCS / TCSL)
function normalizeCompanyName(name) {
  if (!name) return '';
  const trimmed = name.trim();
  if (/^esaf/i.test(trimmed)) {
    return 'ESAF Small Finance Bank';
  }
  if (/^tata consultancy services/i.test(trimmed)) {
    return 'Tata Consultancy Services';
  }
  return trimmed;
}

// Small, Premium Infinite-Scrolling Company Logo Marquee Component
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left/Right Edge Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-10" />

      {/* Marquee Inner Track */}
      <div
        className="flex items-center gap-2.5 sm:gap-3.5 w-max animate-marqueeTrack"
        style={{
          animationPlayState: isHovered || isPaused ? 'paused' : 'running',
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
          animation: marqueeTrack 45s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function PlacementsSection({ showAll = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const itemsPerPage = 10;

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

  // Format options for CustomPlacementDropdown
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

  // Filtered dataset based on search, year, and company selection
  const filteredPlacements = useMemo(() => {
    return placementsData.filter((item) => {
      const normComp = normalizeCompanyName(item.companyName);
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        normComp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cleanDomain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear =
        selectedYear === 'ALL' || String(item.year) === String(selectedYear);

      const matchesCompany =
        selectedCompany === 'ALL' || normComp === selectedCompany;

      return matchesSearch && matchesYear && matchesCompany;
    });
  }, [searchQuery, selectedYear, selectedCompany]);

  // Record set calculation (list all records directly if showAll is true)
  const totalPages = Math.ceil(filteredPlacements.length / itemsPerPage) || 1;
  const displayItems = useMemo(() => {
    if (showAll) return filteredPlacements;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlacements.slice(start, start + itemsPerPage);
  }, [filteredPlacements, currentPage, itemsPerPage, showAll]);

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

  return (
    <section id="placements" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white scroll-mt-20">
      {/* Section Header matching exact website section title style */}
      <div className="text-center mb-10 space-y-3">
        <span className="font-mono text-xs tracking-widest text-red-500 uppercase block font-semibold">
          • CAMPUS PLACEMENTS &amp; RECRUITMENT
        </span>

        <h2 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          AIDA <span className="text-red-600 italic">Placements &amp; Internships</span>
        </h2>

        <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-sans">
          Celebrating our students securing career opportunities across leading global technology corporations and industry pioneers.
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

          {/* Filter Dropdowns (Year & Company) */}
          <div className="flex items-center gap-3 shrink-0">
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

      {/* Premium Infinite-Scrolling Company Logo Marquee */}
      <CompanyMarquee
        companies={uniqueCompaniesList}
        selectedCompany={selectedCompany}
        onSelectCompany={handleCompanyChange}
      />

      {/* Main Placement Table Container matching reference image UI */}
      <div className="relative z-10 bg-[#080808] border border-neutral-800/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Table Header with Header Icons */}
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
                    onMouseEnter={(e) => {
                      setHoveredStudent(item);
                      setMousePos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setMousePos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setHoveredStudent(null)}
                    className="group hover:bg-neutral-900/60 transition-colors duration-150 cursor-pointer"
                  >
                    {/* Student Column */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <StudentAvatar
                          studentName={item.studentName}
                          imageSrc={item.studentImage}
                        />
                        <span className="font-semibold text-white group-hover:text-red-400 transition-colors text-sm sm:text-base">
                          {item.studentName}
                        </span>
                      </div>
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
                        No placement records found
                      </p>
                      <p className="text-xs text-neutral-500">
                        Try adjusting your search criteria or filter tags.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-neutral-800/90 bg-[#0c0c0e]/90 text-xs font-mono text-neutral-400">
          <div>
            Listing <span className="text-red-500 font-bold">{displayItems.length}</span> placement records
          </div>

          {!showAll && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Awwwards-style Hover Preview Card */}
      <StudentHoverPreviewCard student={hoveredStudent} mousePos={mousePos} />
    </section>
  );
}
