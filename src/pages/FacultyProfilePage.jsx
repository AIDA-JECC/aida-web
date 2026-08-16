import React, { useState, useMemo, useEffect } from 'react';
import { facultyData } from '../data/facultyData';
import { academicProjectsData } from '../data/academicProjectsData';
import SafeImage from '../components/ui/SafeImage';
import ProjectControls from '../components/projects/ProjectControls';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectEmptyState from '../components/projects/ProjectEmptyState';
import LinkedinIcon from '../components/ui/LinkedinIcon';
import { getProjectsByFaculty, matchesProjectSearch, sortProjectsByPriority, findFacultyByGuideName, normalizeName } from '../utils/projectHelpers';
import { ArrowLeft, Mail, FolderGit2, Sparkles, UserCheck } from 'lucide-react';

// Sequential Typewriter Component: Types Name first, then types Role/Designation after Name completes
function SequentialTypewriterHeader({ name, designation }) {
  const [nameText, setNameText] = useState('');
  const [isNameDone, setIsNameDone] = useState(false);
  const [roleText, setRoleText] = useState('');
  const [isRoleDone, setIsRoleDone] = useState(false);

  useEffect(() => {
    setNameText('');
    setIsNameDone(false);
    setRoleText('');
    setIsRoleDone(false);
    if (!name) return;

    let index = 0;
    const speed = 25; // 25ms per char fast typing speed for Name

    const nameTimer = setInterval(() => {
      index++;
      setNameText(name.slice(0, index));
      if (index >= name.length) {
        clearInterval(nameTimer);
        setIsNameDone(true);
      }
    }, speed);

    return () => clearInterval(nameTimer);
  }, [name]);

  useEffect(() => {
    if (!isNameDone || !designation) return;

    let index = 0;
    const speed = 20; // 20ms per char fast typing speed for Role

    const roleTimer = setInterval(() => {
      index++;
      setRoleText(designation.slice(0, index));
      if (index >= designation.length) {
        clearInterval(roleTimer);
        setIsRoleDone(true);
      }
    }, speed);

    return () => clearInterval(roleTimer);
  }, [isNameDone, designation]);

  return (
    <div className="space-y-1.5">
      <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
        <span>{nameText}</span>
        {!isNameDone && <span className="inline-block w-2.5 h-8 bg-red-600 ml-1 animate-pulse" />}
      </h1>

      <p className="text-sm sm:text-base text-red-500 font-mono font-bold tracking-wider uppercase min-h-[1.5em]">
        <span>{roleText}</span>
        {isNameDone && !isRoleDone && <span className="inline-block w-2 h-4 bg-red-500 ml-1 animate-pulse" />}
      </p>
    </div>
  );
}

export default function FacultyProfilePage({ slugOrName, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedType, setSelectedType] = useState('All Project Types');

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slugOrName]);

  // Match official faculty data member or synthesize object
  const faculty = useMemo(() => {
    if (!slugOrName) return null;
    const normKey = normalizeName(slugOrName);

    const match = facultyData.find((f) => {
      const fSlug = f.slug || normalizeName(f.name);
      return fSlug === slugOrName || normalizeName(f.name) === normKey || fSlug.includes(normKey) || normKey.includes(fSlug);
    });

    if (match) return match;

    // Fallback: search by guide name helper
    const matchedByGuide = findFacultyByGuideName(slugOrName);
    if (matchedByGuide) return matchedByGuide;

    // Synthesized faculty object if not found in static faculty list
    return {
      slug: slugOrName,
      name: slugOrName,
      designation: 'Faculty Supervisor',
      group: 'Department Faculty',
      initials: slugOrName.replace(/^(Dr|Prof|Mr|Mrs|Ms|Er)\.?\s*/i, '').slice(0, 2).toUpperCase(),
      img: null,
    };
  }, [slugOrName]);

  // Find all projects guided by this faculty member
  const allGuidedProjects = useMemo(() => {
    if (!faculty) return [];
    return getProjectsByFaculty(faculty.name, academicProjectsData);
  }, [faculty]);

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

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      if (onNavigate) {
        onNavigate('home');
      } else {
        window.location.hash = '#team';
      }
    }
  };

  if (!faculty) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Top Header Bar with Back Button */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-800">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600 font-mono text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} className="text-red-500" />
            <span>BACK</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
            FACULTY PROFILE
          </span>
        </div>
      </div>

      {/* Faculty Hero Card Container */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="relative rounded-3xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            {/* Faculty Photo Avatar */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden bg-neutral-900 border-2 border-red-600/40 shrink-0 shadow-2xl relative">
              <SafeImage
                src={faculty.img ? `${faculty.img}-320.webp` : ''}
                alt={faculty.name}
                category="Faculty"
                initials={faculty.initials || 'FC'}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Faculty Information */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
                  {faculty.group || 'Faculty Member'}
                </span>
                <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FolderGit2 size={13} className="text-red-500" />
                  <span>{allGuidedProjects.length} Supervised Projects</span>
                </span>
              </div>

              {/* Sequential Typewriter Animation: Name first, then Designation/Role */}
              <SequentialTypewriterHeader
                name={faculty.name}
                designation={faculty.designation || 'Department of Artificial Intelligence & Data Science'}
              />

              {/* Social Icons */}
              <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-red-500 hover:border-red-600 transition-all shadow-md cursor-pointer"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon size={18} />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-red-500 hover:border-red-600 transition-all shadow-md cursor-pointer"
                  title="Email Address"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supervised Academic Projects Section */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white flex items-center gap-2">
            <UserCheck className="text-red-600" />
            <span>Supervised <span className="text-red-600 italic">Academic Projects</span> ({allGuidedProjects.length})</span>
          </h2>
        </div>

        {allGuidedProjects.length > 0 && (
          <ProjectControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedBatch={selectedBatch}
            onBatchChange={setSelectedBatch}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
            totalCount={allGuidedProjects.length}
            filteredCount={filteredGuidedProjects.length}
          />
        )}

        {filteredGuidedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredGuidedProjects.map((project) => (
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
