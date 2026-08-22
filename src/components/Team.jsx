import React, { useMemo, useState, useRef, useEffect } from 'react';
import { facultyCount, facultyData } from '../data/facultyData';
import { TestimonialSlider } from './ui/testimonial-slider-1';
import { ChevronDown, Check } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All Faculty', match: () => true },
  { id: 'leadership', label: 'Leadership', match: (member) => member.rank <= 1 },
  { id: 'professor', label: 'Professors', match: (member) => member.group === 'Professor' },
  { id: 'associate', label: 'Associate Professors', match: (member) => member.group === 'Associate Professor' },
  { id: 'assistant', label: 'Assistant Professors', match: (member) => member.group === 'Assistant Professor' },
  { id: 'instructor', label: 'Trade Instructors', match: (member) => member.group === 'Trade Instructor' },
];

// Custom Dark Theme-Matched Animated Dropdown for Faculty Filters
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

  const facultyReviews = useMemo(() => {
    return filteredFaculty.map((member) => {
      const displayName = member.name ? member.name.replace(/\.+$/, '') : '';
      const cleanSlug = member.slug || normalizeName(displayName);

      return {
        id: cleanSlug,
        name: displayName,
        affiliation: `${member.designation} • Department of AI & DS`,
        imageSrc: member.img ? `${member.img}-640.webp` : '',
        thumbnailSrc: member.img ? `${member.img}-320.webp` : '',
        email: `${cleanSlug.replace(/-/g, '')}@jecc.ac.in`,
        linkedin: `https://linkedin.com/in/${cleanSlug}`,
        actionLabel: "View Profile & Projects",
        onActionClick: () => handleFacultyClick(member),
      };
    });
  }, [filteredFaculty, onNavigate]);

  return (
    <section
      id="team"
      aria-labelledby="faculty-heading"
      className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 overflow-hidden"
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
        <div className="flex justify-end mb-6 relative z-30">
          <FacultyCustomDropdown
            filters={FILTERS}
            activeId={activeFilter}
            onSelect={setActiveFilter}
          />
        </div>

        {/* Testimonial Slider for Faculty */}
        <div className="w-full">
          <TestimonialSlider
            key={activeFilter}
            reviews={facultyReviews}
            initialIndex={0}
            reverseLayout={true}
            className="bg-transparent"
          />
        </div>
      </div>
    </section>
  );
}
