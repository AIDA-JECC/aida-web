import React, { useMemo } from 'react';
import { Camera, UserRound } from 'lucide-react';
import { coreTeamData } from '../data/coreTeamData';
import { CoverflowCarousel } from './ui/coverflow-carousel';

import SafeImage from './ui/SafeImage';

const RESERVED_POSITIONS = 8;

export default function CoreTeamSection() {
  const hasMembers = coreTeamData.length > 0;

  const slides = useMemo(() => {
    return coreTeamData.map((member) => ({
      src: `${member.photo}-400.webp`,
      alt: member.name,
      title: member.name,
      subtitle: member.designation,
      meta: member.semester ? [{ label: 'Semester', value: member.semester }] : [],
      customContent: ({ isSelected }) => (
        <div className="relative w-full h-full bg-neutral-950 border border-red-600/30 rounded-2xl overflow-hidden shadow-2xl group flex flex-col justify-between">
          <div className="relative w-full h-full overflow-hidden bg-neutral-900">
            <SafeImage
              src={`${member.photo}-400.webp`}
              srcSet={`${member.photo}-400.webp 400w, ${member.photo}-800.webp 800w`}
              sizes="300px"
              alt={member.name}
              title={member.name}
              category="EXECUTIVE BOARD"
              draggable={false}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent transition-opacity duration-300 ${
                isSelected ? 'opacity-20' : 'opacity-85'
              }`}
            />

            {/* Content overlay inside side cards positioned safely above bottom edge */}
            {!isSelected && (
              <div className="absolute bottom-2.5 inset-x-2.5 p-2 sm:p-2.5 flex flex-col justify-center bg-neutral-950/95 backdrop-blur-md border border-white/10 rounded-xl z-20 shadow-lg transition-all duration-300">
                <h4 className="font-sans font-extrabold text-xs text-white truncate leading-tight">
                  {member.name}
                </h4>
                <p className="font-mono text-[9px] font-bold text-red-400 uppercase tracking-wider truncate mt-0.5">
                  {member.designation}
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    }));
  }, []);

  return (
    <section
      id="core-team"
      aria-labelledby="core-team-heading"
      className="py-20 sm:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-3 block">
            • AIDA STUDENT LEADERSHIP
          </span>
          <h2 id="core-team-heading" className="font-serif text-3xl sm:text-5xl md:text-6xl text-white">
            Meet the <span className="text-red-600 italic">Core Team</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            The student leadership team coordinating AIDA initiatives, events, and community activities.
          </p>
        </div>

        {hasMembers ? (
          <div className="w-full">
            <CoverflowCarousel
              slides={slides}
              cardWidth="clamp(220px, 26vw, 290px)"
              rotate={42}
              depth={0.65}
              perspective={3.2}
              gap={0.06}
              showCaption={true}
              showPagination={true}
              showNavigation={true}
              label="Meet the Core Team"
            />
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 ring-1 ring-inset ring-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-7">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-red-600/15 border border-red-900/50 grid place-items-center text-red-500">
                  <UserRound size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-white font-bold">Core-team details are being prepared</h3>
                  <p className="text-neutral-500 text-sm mt-1">Names, designations, and official photographs will be added once supplied.</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                Awaiting official details
              </span>
            </div>

            <div aria-hidden="true" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {Array.from({ length: RESERVED_POSITIONS }, (_, index) => (
                <div key={index} className="aspect-[4/5] rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/50 grid place-items-center">
                  <Camera size={18} className="text-neutral-700" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
