import React, { useMemo, useState } from 'react';
import { facultyCount, facultyData } from '../data/facultyData';
import { CoverflowCarousel } from './ui/coverflow-carousel';
import SafeImage from './ui/SafeImage';

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

export default function Team() {
  const [activeFilter, setActiveFilter] = useState('all');

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
        meta: [
          { label: 'Role', value: style.tag || 'FACULTY' },
          { label: 'Department', value: 'AI & DS' },
        ],
        customContent: ({ isSelected }) => (
          <div className={`group relative w-full h-full bg-neutral-950/90 backdrop-blur-md rounded-2xl overflow-hidden border ${style.border} ${style.hoverBorder} transition-all duration-300 flex flex-col justify-between shadow-2xl`}>
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

              {/* Content overlay inside side cards positioned safely above bottom edge */}
              {!isSelected && (
                <div className="absolute bottom-2.5 inset-x-2.5 p-2 sm:p-2.5 flex flex-col justify-center bg-neutral-950/95 backdrop-blur-md border border-white/10 rounded-xl z-20 shadow-lg transition-all duration-300">
                  <h3 className="font-sans font-extrabold text-xs text-white truncate leading-tight">
                    {displayName}
                  </h3>
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
  }, [filteredFaculty]);

  return (
    <section
      id="team"
      aria-labelledby="faculty-heading"
      className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 overflow-hidden"
    >
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-2 block">
            • DEPARTMENT FACULTY
          </span>
          <h2 id="faculty-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl text-white">
            Meet Our <span className="text-red-600 italic">Faculty</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto mt-3 text-xs sm:text-sm leading-relaxed">
            The {facultyCount} faculty members guiding teaching, research, and student innovation in
            Artificial Intelligence &amp; Data Science at Jyothi Engineering College.
          </p>
        </div>

        {/* Designation Filters */}
        <div role="group" aria-label="Filter faculty by designation" className="flex flex-nowrap overflow-x-auto no-scrollbar justify-start sm:justify-center gap-2 mb-8 pb-2 w-full whitespace-nowrap max-w-full touch-pan-x">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3.5 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider border shrink-0 transition-all duration-300 cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-red-600 border-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:border-neutral-700 bg-neutral-950 border-neutral-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
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
