import React, { useMemo } from 'react';
import { academicProjectsData } from '../../data/academicProjectsData';
import { sortProjectsByPriority } from '../../utils/projectHelpers';
import ProjectCard from './ProjectCard';
import { ArrowRight, FolderGit2 } from 'lucide-react';

const HOMEPAGE_PREVIEW_LIMIT = 3;

export default function AcademicProjectsSection({ onNavigate }) {
  // Sort projects by priority so Main Projects always display top on homepage
  const topProjects = useMemo(() => {
    const sorted = sortProjectsByPriority(academicProjectsData);
    return sorted.slice(0, HOMEPAGE_PREVIEW_LIMIT);
  }, []);

  const handleNavigateProjects = () => {
    if (onNavigate) {
      onNavigate('projects');
    } else {
      window.location.hash = '#/projects';
    }
  };

  return (
    <section id="projects" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 scroll-mt-20">
      {/* Centered Section Header */}
      <div className="text-center flex flex-col items-center justify-center max-w-3xl mx-auto mb-8 space-y-3">
        <span className="font-mono text-xs tracking-widest text-red-500 uppercase block">
          • INNOVATION &amp; ENGINEERING SHOWCASE
        </span>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-center tracking-tight leading-tight">
          Academic <span className="text-red-600 italic">Projects</span> Showcase
        </h2>
        <p className="text-neutral-400 font-sans text-xs sm:text-sm md:text-base leading-relaxed text-center max-w-2xl">
          Featured academic projects, AI models, and software engineering systems developed by AIDA students at Jyothi Engineering College.
        </p>
      </div>

      {/* Grid of Top 3 Priority Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {topProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelectProject={(p) => {
              if (onNavigate) onNavigate('project', p.id);
              else window.location.hash = `#/project/${p.id}`;
            }}
            onSelectFaculty={(f) => {
              if (onNavigate) onNavigate('faculty', f.slug || f.name);
              else window.location.hash = `#/faculty/${f.slug || f.name}`;
            }}
          />
        ))}
      </div>

      {/* Prominent View All Projects Navigation Button */}
      <div className="pt-6 text-center">
        <button
          type="button"
          onClick={handleNavigateProjects}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-xl hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <FolderGit2 size={18} />
          <span>VIEW ALL PROJECTS ({academicProjectsData.length})</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
