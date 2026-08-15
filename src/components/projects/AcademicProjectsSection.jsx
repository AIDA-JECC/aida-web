import React, { useState, useMemo } from 'react';
import { academicProjectsData } from '../../data/academicProjectsData';
import { matchesProjectSearch } from '../../utils/projectHelpers';
import ProjectControls from './ProjectControls';
import ProjectCard from './ProjectCard';
import ProjectDetailsModal from './ProjectDetailsModal';
import FacultyProjectsModal from './FacultyProjectsModal';
import ProjectEmptyState from './ProjectEmptyState';
import { ArrowRight, ChevronUp } from 'lucide-react';

const HOMEPAGE_PREVIEW_LIMIT = 3;

export default function AcademicProjectsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedType, setSelectedType] = useState('All Project Types');
  const [isExpanded, setIsExpanded] = useState(false);

  // Modals state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    return academicProjectsData.filter((project) => {
      if (searchQuery && !matchesProjectSearch(project, searchQuery)) {
        return false;
      }
      if (selectedBatch !== 'All Batches' && project.batch !== selectedBatch) {
        return false;
      }
      if (selectedType !== 'All Project Types' && project.projectType !== selectedType) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedBatch, selectedType]);

  const isFiltered =
    searchQuery.trim() !== '' || selectedBatch !== 'All Batches' || selectedType !== 'All Project Types';

  // Automatically show full results if user is actively searching/filtering
  const shouldShowAll = isExpanded || isFiltered;

  const visibleProjects = shouldShowAll
    ? filteredProjects
    : filteredProjects.slice(0, HOMEPAGE_PREVIEW_LIMIT);

  const hasMoreThanLimit = filteredProjects.length > HOMEPAGE_PREVIEW_LIMIT;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBatch('All Batches');
    setSelectedType('All Project Types');
    setIsExpanded(false);
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
          Explore innovative academic projects, research initiatives, and software systems developed by AIDA students across different academic batches.
        </p>

        {/* Action Toggle Button */}
        {!isFiltered && hasMoreThanLimit && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-[0_0_25px_rgba(229,9,20,0.4)] cursor-pointer active:scale-95"
            >
              <span>{isExpanded ? 'SHOW LESS' : `SEE MORE PROJECTS (${academicProjectsData.length})`}</span>
              {isExpanded ? <ChevronUp size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>

      {/* Controls Container: Search & Filters Bar */}
      <ProjectControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onReset={handleResetFilters}
        totalCount={academicProjectsData.length}
        filteredCount={filteredProjects.length}
        isFiltered={isFiltered}
      />

      {/* Projects Grid / Empty State */}
      {visibleProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={(p) => setSelectedProject(p)}
              onSelectFaculty={(f) => setSelectedFaculty(f)}
            />
          ))}
        </div>
      ) : (
        <ProjectEmptyState onReset={handleResetFilters} />
      )}

      {/* Bottom "See More Projects" Action Button */}
      {!isFiltered && hasMoreThanLimit && !isExpanded && (
        <div className="flex items-center justify-center pt-6">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-xl hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] hover:scale-105 cursor-pointer active:scale-95"
          >
            <span>SEE MORE PROJECTS ({academicProjectsData.length})</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSelectFaculty={(f) => setSelectedFaculty(f)}
        />
      )}

      {/* Faculty Profile & Supervised Projects Modal */}
      {selectedFaculty && (
        <FacultyProjectsModal
          faculty={selectedFaculty}
          onClose={() => setSelectedFaculty(null)}
          onSelectProject={(p) => setSelectedProject(p)}
        />
      )}
    </section>
  );
}
