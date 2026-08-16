import React, { useMemo, useState, useRef, useEffect } from 'react';
import { facultyCount, facultyData } from '../data/facultyData';
import { CoverflowCarousel } from './ui/coverflow-carousel';
import SafeImage from './ui/SafeImage';
import FacultyProjectsModal from './projects/FacultyProjectsModal';
import { ChevronDown, Check, Mail, ExternalLink } from 'lucide-react';
import LinkedinIcon from './ui/LinkedinIcon';

const FILTERS = [
  { id: 'all', label: 'All Faculty', match: () => true },
  { id: 'leadership', label: 'Leadership', match: (member) => member.rank <= 1 },
  { id: 'professor', label: 'Professors', match: (member) => member.group === 'Professor' },
  { id: 'associate', label: 'Associate Professors', match: (member) => member.group === 'Associate Professor' },
  { id: 'assistant', label: 'Assistant Professors', match: (member) => member.group === 'Assistant Professor' },
  { id: 'instructor', label: 'Trade Instructors', match: (member) => member.group === 'Trade Instructor' },
];

const GROUP_STYLES = {
  'Head of Department': {
    border: 'border-red-600/50',
    hoverBorder: 'hover:border-red-500',
    badgeText: 'text-red-400',
    dot: 'bg-red-500 animate-pulse',
    tag: 'HOD',
    accentGradient: 'from-red-600 via-red-500 to-red-700',
    avatarBg: 'bg-red-950/40 text-red-400 border border-red-600/30',
  },
  'Professor': {
    border: 'border-red-600/30',
    hoverBorder: 'hover:border-red-500/70',
    badgeText: 'text-red-400',
    dot: 'bg-red-500',
    tag: 'PROFESSOR',
    accentGradient: 'from-red-600/80 via-red-500/50 to-neutral-800',
    avatarBg: 'bg-neutral-900 text-neutral-300 border border-neutral-800',
  },
  'Associate Professor': {
    border: 'border-red-600/30',
    hoverBorder: 'hover:border-red-500/70',
    badgeText: 'text-red-400',
    dot: 'bg-red-500',
    tag: 'ASSOC. PROF',
    accentGradient: 'from-red-600/80 via-red-500/50 to-neutral-800',
    avatarBg: 'bg-neutral-900 text-neutral-300 border border-neutral-800',
  },
  'Assistant Professor': {
    border: 'border-neutral-800',
    hoverBorder: 'hover:border-red-500/60',
    badgeText: 'text-neutral-300',
    dot: 'bg-red-500',
    tag: 'AST. PROF',
    accentGradient: 'from-red-600/60 to-neutral-800',
    avatarBg: 'bg-neutral-900 text-neutral-300 border border-neutral-800',
  },
  'Trade Instructor': {
    border: 'border-neutral-800',
    hoverBorder: 'hover:border-red-500/60',
    badgeText: 'text-neutral-300',
    dot: 'bg-red-500',
    tag: 'INSTRUCTOR',
    accentGradient: 'from-red-600/60 to-neutral-800',
    avatarBg: 'bg-neutral-900 text-neutral-300 border border-neutral-800',
  },
};

// Custom Dark Theme-Matched Animated Dropdown for Faculty Filters (High z-index z-[45] below navbar z-50)
function FacultyCustomDropdown({ filters, activeId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLabel = filters.find((f) => f.id === activeId)?.label || filters[0].label;

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
    <div ref={dropdownRef} className="relative inline-block text-left shrink-0 z-30">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Filter faculty by designation"
        className="flex items-center justify-between gap-2.5 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 hover:border-red-600 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer outline-none transition-all shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] active:scale-98"
      >
        <span>{activeLabel}</span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 sm:w-60 bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-1.5 z-[45] space-y-1 animate-fadeIn ring-1 ring-white/10">
          {filters.map((filter) => {
            const isSelected = activeId === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  onSelect(filter.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-red-400'
                }`}
              >
                <span>{filter.label}</span>
                {isSelected && <Check size={14} className="shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Team({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const normalizeName = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleFacultyClick = (member) => {
    const targetSlug = member.slug || normalizeName(member.name);
    if (onNavigate) {
      onNavigate('faculty', targetSlug);
    } else {
      window.location.hash = `#/faculty/${targetSlug}`;
    }
  };

  const filteredFaculty = useMemo(() => {
    const filter = FILTERS.find((item) => item.id === activeFilter) ?? FILTERS[0];
    return facultyData.filter(filter.match);
  }, [activeFilter]);

  const slides = useMemo(() => {
    return filteredFaculty.map((member, index) => {
      const displayName = member.name ? member.name.replace(/\.+$/, '') : '';
      const style = GROUP_STYLES[member.group] || GROUP_STYLES['Assistant Professor'];
      const isHOD = member.group === 'Head of Department';

      return {
        src: member.img ? `${member.img}-320.webp` : '',
        alt: displayName,
        title: displayName,
        subtitle: member.designation,
        onSelectProfile: () => handleFacultyClick(member),
        meta: [
          { label: 'Role', value: style.tag || 'FACULTY' },
          { label: 'Department', value: 'AI & DS' },
        ],
        customContent: ({ isSelected }) => (
          <div
            onClick={() => handleFacultyClick(member)}
            className={`group relative w-full h-full bg-neutral-950/90 backdrop-blur-md rounded-2xl overflow-hidden border ${style.border} ${style.hoverBorder} transition-all duration-300 flex flex-col justify-between shadow-2xl cursor-pointer`}
          >
            {/* Top Accent Bar */}
            <div className="h-1 w-full bg-neutral-950 relative overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${style.accentGradient} w-full`} />
            </div>

            {/* Image Frame */}
            <div className="relative aspect-[3/3.7] bg-neutral-900 overflow-hidden shrink-0 grow">
              <SafeImage
                src={`${member.img}-320.webp`}
                srcSet={`${member.img}-320.webp 320w, ${member.img}-640.webp 640w`}
                sizes="300px"
                alt={`${displayName}, ${member.designation}`}
                title={displayName}
                category={style.tag || 'FACULTY'}
                initials={member.initials}
                loading={index < 3 ? 'eager' : 'lazy'}
                draggable="false"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 relative z-10"
              />

              {/* Badge Overlay */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md bg-neutral-950/90 border-red-600/30 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <span className={style.badgeText}>{style.tag}</span>
              </div>

              {/* HOD Tag */}
              {isHOD && (
                <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-widest uppercase bg-red-600/20 border border-red-500/60 text-red-400 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  ★ LEAD
                </div>
              )}

              <div className={`absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent z-10 transition-opacity duration-300 ${isSelected ? 'opacity-20' : 'opacity-85'}`} />

              {/* Content overlay inside side cards */}
              {!isSelected && (
                <div className="absolute bottom-2.5 inset-x-2.5 p-2 sm:p-2.5 flex flex-col justify-center bg-neutral-950/95 backdrop-blur-md border border-white/10 rounded-xl z-20 shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-sans font-extrabold text-xs text-white truncate leading-tight">
                      {displayName}
                    </h3>
                    <span
                      onClick={(e) => { e.stopPropagation(); handleFacultyClick(member); }}
                      className="p-0.5 text-red-500 hover:text-red-400 transition-colors shrink-0 cursor-pointer"
                      title="View Faculty Profile & Supervised Projects"
                      aria-label={`View ${displayName} Profile`}
                    >
                      <ExternalLink size={13} />
                    </span>
                  </div>
                  <p className="font-mono text-[9px] font-bold text-red-400 uppercase tracking-wider mt-0.5 truncate">
                    {member.designation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ),
      };
    });
  }, [filteredFaculty, onNavigate]);

  return (
    <section
      id="team"
      aria-labelledby="faculty-heading"
      className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 overflow-hidden"
    >
      <div>
        {/* Centered Section Header */}
        <div className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto mb-6 space-y-3">
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase block">
            • DEPARTMENT FACULTY
          </span>
          <h2 id="faculty-heading" className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-center tracking-tight leading-tight">
            Meet Our <span className="text-red-600 italic">Faculty</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-center font-sans">
            The {facultyCount} faculty members guiding teaching, research, and student innovation in
            Artificial Intelligence &amp; Data Science at Jyothi Engineering College.
          </p>
        </div>

        {/* Right-Aligned Designation Dropdown (z-30) */}
        <div className="flex justify-end mb-8 relative z-30">
          <FacultyCustomDropdown
            filters={FILTERS}
            activeId={activeFilter}
            onSelect={setActiveFilter}
          />
        </div>

        {/* Coverflow Carousel for Faculty */}
        <div className="w-full">
          <CoverflowCarousel
            key={activeFilter}
            slides={slides}
            cardWidth="clamp(220px, 26vw, 290px)"
            rotate={42}
            depth={0.65}
            perspective={3.2}
            gap={0.06}
            showCaption={true}
            showPagination={true}
            showNavigation={true}
            label="Faculty Members Carousel"
          />
        </div>
      </div>
    </section>
  );
}

