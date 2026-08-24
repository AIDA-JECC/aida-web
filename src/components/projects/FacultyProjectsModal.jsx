import React, { useEffect, useState, useMemo } from 'react';
import SafeImage from '../ui/SafeImage';
import { getProjectsByFaculty, matchesProjectSearch, sortProjectsByPriority } from '../../utils/projectHelpers';
import { academicProjectsData } from '../../data/academicProjectsData';
import ProjectControls from './ProjectControls';
import ProjectCard from './ProjectCard';
import ProjectEmptyState from './ProjectEmptyState';
import { X, FolderGit2, Mail, Phone, GraduationCap, Globe, Award, UserCheck, Hash, ExternalLink } from 'lucide-react';
import LinkedinIcon from '../ui/LinkedinIcon';

// Typewriter Heading Component for Faculty Name
function TypewriterFacultyName({ name }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (!name) return;

    let index = 0;
    const speed = 25; // 25ms per char fast typewriter effect

    const timer = setInterval(() => {
      index++;
      setDisplayedText(name.slice(0, index));
      if (index >= name.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [name]);

  return (
    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900">
      <span>{displayedText}</span>
      {displayedText.length < (name || '').length && (
        <span className="inline-block w-2 h-5 bg-red-600 ml-1 animate-pulse" />
      )}
    </h2>
  );
}

export default function FacultyProjectsModal({ faculty, onClose, onSelectProject }) {
  if (!faculty) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedType, setSelectedType] = useState('All Project Types');

  // Lock body scroll and add modal-open class while modal is active
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle || 'auto';
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Find all projects guided by this faculty member
  const allGuidedProjects = useMemo(() => {
    return getProjectsByFaculty(faculty.name, academicProjectsData);
  }, [faculty.name]);

  // Filter guided projects dynamically
  const filteredGuidedProjects = useMemo(() => {
    const list = allGuidedProjects.filter((project) => {
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
  }, [allGuidedProjects, searchQuery, selectedBatch, selectedType]);

  const isFiltered =
    searchQuery.trim() !== '' || selectedBatch !== 'All Batches' || selectedType !== 'All Project Types';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBatch('All Batches');
    setSelectedType('All Project Types');
  };

  // Avoid duplicate designation text if it matches group name
  const isDuplicateDesignation =
    faculty.designation &&
    faculty.group &&
    faculty.designation.toLowerCase().replace(/the\s+/i, '') === faculty.group.toLowerCase().replace(/the\s+/i, '');

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-[#f8f8f6] border border-neutral-300 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5"
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-30">
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 border border-neutral-300 text-neutral-700 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer shadow-md"
            aria-label="Close faculty details"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          {/* Faculty Header Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-300 shrink-0 shadow-md">
              <SafeImage
                src={faculty.img ? `${faculty.img}-320.webp` : null}
                alt={faculty.name}
                category="Faculty"
                initials={faculty.initials || 'FC'}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 font-mono text-[10px] font-bold uppercase tracking-wider inline-block">
                {faculty.group || 'Faculty Member'}
              </span>
              
              {/* Typewriter Faculty Name */}
              <TypewriterFacultyName name={faculty.name} />

              {!isDuplicateDesignation && faculty.designation && (
                <p className="text-neutral-600 font-mono text-xs sm:text-sm">
                  {faculty.designation}
                </p>
              )}

              <p className="text-neutral-500 font-sans text-xs pt-0.5">
                Department of Artificial Intelligence & Data Science (AIDA)
              </p>

              {/* About / Bio Text (if non-null) */}
              {faculty.about && (
                <p className="text-neutral-600 font-sans text-xs sm:text-sm pt-2 italic leading-relaxed max-w-2xl">
                  "{faculty.about}"
                </p>
              )}

              {/* All Non-Null Social & Academic Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3 border-t border-neutral-200 mt-2">
                {faculty.email && (
                  <a
                    href={`mailto:${faculty.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 hover:text-red-600 hover:border-red-500 hover:bg-red-50 transition-all font-mono text-xs font-medium shadow-sm group"
                    title={`Email: ${faculty.email}`}
                  >
                    <Mail size={14} className="text-red-600 group-hover:scale-110 transition-transform" />
                    <span>{faculty.email}</span>
                  </a>
                )}

                {faculty.phone && (
                  <a
                    href={`tel:${faculty.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 hover:text-green-600 hover:border-green-500 hover:bg-green-50 transition-all font-mono text-xs font-medium shadow-sm group"
                    title={`Phone: ${faculty.phone}`}
                  >
                    <Phone size={14} className="text-green-600 group-hover:scale-110 transition-transform" />
                    <span>{faculty.phone}</span>
                  </a>
                )}

                {faculty.employeeId && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-semibold shadow-sm">
                    <Hash size={14} className="text-amber-600" />
                    <span>ID: {faculty.employeeId}</span>
                  </span>
                )}

                {faculty.linkedin && (
                  <a
                    href={faculty.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all font-mono text-xs font-medium shadow-sm group"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {faculty.googleScholar && (
                  <a
                    href={faculty.googleScholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 hover:text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 transition-all font-mono text-xs font-medium shadow-sm group"
                    title="Google Scholar Profile"
                  >
                    <GraduationCap size={14} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>Google Scholar</span>
                  </a>
                )}

                {faculty.scopus && (
                  <a
                    href={faculty.scopus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition-all font-mono text-xs font-medium shadow-sm group"
                    title="Scopus Profile"
                  >
                    <Globe size={14} className="text-orange-600 group-hover:scale-110 transition-transform" />
                    <span>Scopus</span>
                  </a>
                )}

                {faculty.orcid && (
                  <a
                    href={faculty.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 hover:text-green-600 hover:border-green-500 hover:bg-green-50 transition-all font-mono text-xs font-medium shadow-sm group"
                    title="ORCID Profile"
                  >
                    <Award size={14} className="text-green-600 group-hover:scale-110 transition-transform" />
                    <span>ORCID</span>
                  </a>
                )}

                {faculty.vidwan && (
                  <a
                    href={faculty.vidwan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 hover:text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition-all font-mono text-xs font-medium shadow-sm group"
                    title="Vidwan Profile"
                  >
                    <UserCheck size={14} className="text-purple-600 group-hover:scale-110 transition-transform" />
                    <span>Vidwan</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Supervised Academic Projects Header */}
          <div className="space-y-6 pt-4 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-mono text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                <FolderGit2 size={16} aria-hidden="true" />
                <span>Supervised Academic Projects ({allGuidedProjects.length})</span>
              </h3>
            </div>

            {/* Minimal Search Bar & Filters for Faculty Supervised Projects */}
            {allGuidedProjects.length > 0 && (
              <ProjectControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedBatch={selectedBatch}
                setSelectedBatch={setSelectedBatch}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                onReset={handleResetFilters}
                totalCount={allGuidedProjects.length}
                filteredCount={filteredGuidedProjects.length}
                isFiltered={isFiltered}
              />
            )}

            {/* Project Grid (Exact Same Card Structure as Main Section) */}
            {filteredGuidedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuidedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelectProject={(p) => {
                      onClose();
                      if (onSelectProject) onSelectProject(p);
                    }}
                  />
                ))}
              </div>
            ) : (
              <ProjectEmptyState onReset={handleResetFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
