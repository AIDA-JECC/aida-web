import React from 'react';
import SafeImage from '../ui/SafeImage';
import { findFacultyByGuideName } from '../../utils/projectHelpers';
import { ArrowUpRight, UserCheck, User, Code } from 'lucide-react';

export default function ProjectCard({ project, onSelectProject, onSelectFaculty }) {
  const {
    title,
    abstract,
    batch,
    projectType,
    techStack = [],
    coverImage,
    guideName,
    members = [],
  } = project;

  // Faculty guide matching
  const matchedFaculty = findFacultyByGuideName(guideName);

  const handleGuideClick = (e) => {
    e.stopPropagation();
    if (onSelectFaculty) {
      const facultyToPass = matchedFaculty || {
        slug: guideName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: guideName,
        designation: 'Faculty Supervisor',
        group: 'Faculty Member',
        initials: guideName.replace(/^(Dr|Prof|Mr|Mrs|Ms|Er)\.?\s*/i, '').slice(0, 2).toUpperCase(),
        img: null,
      };
      onSelectFaculty(facultyToPass);
    }
  };

  // Team Leader identification
  const leaderMember = members.find((m) => m.isLeader) || members[0];
  const leaderName = leaderMember ? leaderMember.name : 'Team Leader';

  // Duplicate tech stack array for smooth continuous infinite right-to-left marquee loop
  const marqueeTechStack = techStack.length > 0 ? [...techStack, ...techStack, ...techStack] : [];

  return (
    <div
      onClick={() => onSelectProject(project)}
      className="group w-full h-full text-left bg-white/90 backdrop-blur-md border border-neutral-200 hover:border-red-600/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between ring-1 ring-inset ring-black/5 shadow-lg hover:shadow-2xl"
    >
      <div className="w-full">
        {/* Cover Page Image (First Look - Big & Clear) */}
        <div className="relative w-full h-64 sm:h-72 bg-neutral-100 overflow-hidden border-b border-neutral-200">
          <SafeImage
            src={coverImage}
            alt={title}
            category={projectType || 'Academic Project'}
            initials={title.substring(0, 2).toUpperCase()}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none z-10">
            <span className="bg-black/85 backdrop-blur-md text-white font-mono text-xs font-semibold px-3 py-1 rounded-full border border-neutral-800 shadow-md">
              #{batch} • {projectType}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 space-y-3.5">
          {/* Topic Name */}
          <h3 className="font-sans font-extrabold text-xl text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>

          {/* Small Description Preview */}
          <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 font-sans">
            {abstract}
          </p>

          {/* Continuous Right-to-Left Tech Stack Marquee Ticker */}
          {techStack.length > 0 && (
            <div className="relative w-full overflow-hidden py-1.5 border-y border-neutral-200/80 bg-neutral-100/90 rounded-xl">
              <div className="animate-marquee-left flex items-center gap-2 px-1">
                {marqueeTechStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-white border border-neutral-300 text-neutral-800 font-mono text-[11px] font-medium whitespace-nowrap shrink-0 flex items-center gap-1 shadow-sm"
                  >
                    <Code size={10} className="text-red-600" aria-hidden="true" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Leader & Guide Detail */}
      <div className="w-full px-6 pb-6 pt-3 flex items-center justify-between border-t border-neutral-200/80 mt-2 bg-neutral-50/50">
        <div className="flex flex-col gap-1 text-xs">
          {/* Leader Name */}
          <span className="font-mono text-xs font-bold text-neutral-800 flex items-center gap-1.5">
            <User size={13} className="text-red-600 shrink-0" aria-hidden="true" />
            <span>Leader: <strong className="text-neutral-950">{leaderName}</strong></span>
          </span>

          {/* Guide Detail */}
          {guideName && (
            <span className="font-mono text-[11px] text-neutral-600 flex items-center gap-1.5">
              <UserCheck size={12} className="text-neutral-500 shrink-0" aria-hidden="true" />
              <span>Guide:</span>
              <button
                type="button"
                onClick={handleGuideClick}
                className="font-bold text-red-600 hover:underline transition-colors cursor-pointer"
              >
                {guideName}
              </button>
            </span>
          )}
        </div>

        {/* View Action Button */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300 group-hover:border-red-600 text-xs font-bold text-neutral-800 group-hover:text-red-600 bg-white transition-all shrink-0 shadow-sm">
          <span>SEE DETAILS</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
