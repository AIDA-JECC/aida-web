import React, { useState, useMemo, useEffect } from 'react';
import { academicProjectsData } from '../data/academicProjectsData';
import ProjectControls from '../components/projects/ProjectControls';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectEmptyState from '../components/projects/ProjectEmptyState';
import { matchesProjectSearch, sortProjectsByPriority } from '../utils/projectHelpers';
import { ArrowLeft, Sparkles, FolderGit2 } from 'lucide-react';

export default function ProjectsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedType, setSelectedType] = useState('All Project Types');

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter projects based on search query, batch, and project type
  const filteredProjects = useMemo(() => {
    const list = academicProjectsData.filter((project) => {
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
    return sortProjectsByPriority(list);
  }, [searchQuery, selectedBatch, selectedType]);

  const isFiltered =
    searchQuery.trim() !== '' || selectedBatch !== 'All Batches' || selectedType !== 'All Project Types';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBatch('All Batches');
    setSelectedType('All Project Types');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      if (onNavigate) {
        onNavigate('home');
      } else {
        window.location.hash = '#projects';
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Sticky Header Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-800">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600 font-mono text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} className="text-red-500" />
            <span>BACK TO HOME</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FolderGit2 size={14} />
              <span>{academicProjectsData.length} TOTAL PROJECTS</span>
            </span>
          </div>
        </div>

        {/* Page Title & Subtitle */}
        <div className="mt-8 text-center max-w-3xl mx-auto space-y-3">
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase block">
            • AIDA DEPARTMENT REPOSITORY
          </span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Academic <span className="text-red-600 italic">Projects</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base font-sans leading-relaxed">
            Explore all {academicProjectsData.length} student innovations, AI models, full-stack systems, and research projects guided by the AIDA faculty at Jyothi Engineering College.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="max-w-7xl mx-auto mb-10">
        <ProjectControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedBatch={selectedBatch}
          onBatchChange={setSelectedBatch}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
          totalCount={academicProjectsData.length}
          filteredCount={filteredProjects.length}
        />
      </div>

      {/* Project Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelectProject={(p) => onNavigate('project', p.id)}
                onSelectFaculty={(f) => onNavigate('faculty', f.slug || f.name)}
              />
            ))}
          </div>
        ) : (
          <ProjectEmptyState
            searchQuery={searchQuery}
            selectedBatch={selectedBatch}
            selectedType={selectedType}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
}
