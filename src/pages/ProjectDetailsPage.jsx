import React, { useState, useEffect, useMemo } from 'react';
import { academicProjectsData } from '../data/academicProjectsData';
import SafeImage from '../components/ui/SafeImage';
import { findFacultyByGuideName, normalizeName } from '../utils/projectHelpers';
import { ArrowLeft, X, Calendar, UserCheck, Users, Code, ExternalLink, Sparkles, ZoomIn } from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// Fast Typewriter Heading Component for Project Title in Crimson Red Color
function TypewriterTitle({ title }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (!title) return;

    let index = 0;
    const speed = 18;

    const timer = setInterval(() => {
      index++;
      setDisplayedText(title.slice(0, index));
      if (index >= title.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [title]);

  return (
    <h1 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-red-600 leading-tight">
      <span>{displayedText}</span>
      {displayedText.length < (title || '').length && (
        <span className="inline-block w-2 h-6 bg-red-600 ml-1 animate-pulse" />
      )}
    </h1>
  );
}

export default function ProjectDetailsPage({ projectId, onNavigate }) {
  const [showImageLightbox, setShowImageLightbox] = useState(false);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const project = useMemo(() => {
    return academicProjectsData.find((p) => p.id === projectId) || academicProjectsData[0];
  }, [projectId]);

  const handleBack = () => {
    window.location.hash = '#projects';
  };

  if (!project) return null;

  const {
    title,
    abstract,
    batch,
    projectType,
    techStack = [],
    demoImage,
    coverImage,
    guideName,
    members = [],
    githubUrl,
    githubUsername,
  } = project;

  // Faculty guide matching
  const matchedFaculty = findFacultyByGuideName(guideName);

  const handleGuideClick = () => {
    const facultyToPass = matchedFaculty || {
      slug: guideName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: guideName,
    };
    onNavigate('faculty', facultyToPass.slug || normalizeName(guideName));
  };

  const workingDemoImage = demoImage || coverImage;

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
            PROJECT DETAILS
          </span>
        </div>
      </div>

      {/* Main Content Layout Card */}
      <div className="max-w-7xl mx-auto bg-[#f8f8f6] text-neutral-900 rounded-3xl border border-neutral-300 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* LEFT SIDE: 9:16 Working Demo Image Frame */}
          <div className="w-full lg:w-5/12 bg-neutral-100 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-neutral-200 flex items-center justify-center relative shrink-0">
            <div
              onClick={() => setShowImageLightbox(true)}
              className="group relative w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl flex items-center justify-center p-2 cursor-pointer hover:border-red-600 transition-all"
              title="Click to view full preview"
            >
              <SafeImage
                src={workingDemoImage}
                alt={`${title} Working Demo`}
                category="Working Demo"
                initials={title.substring(0, 2).toUpperCase()}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />

              {/* Standalone Red Preview Icon on Top Left */}
              <div
                onClick={(e) => { e.stopPropagation(); setShowImageLightbox(true); }}
                className="absolute top-3 left-3 z-30 p-2 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-red-600/40 text-red-600 hover:text-red-500 hover:scale-110 hover:border-red-500 transition-all shadow-lg cursor-pointer"
                title="Preview Full Image"
                aria-label="Preview full demo image"
              >
                <ZoomIn size={18} className="text-red-600" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Content Section */}
          <div className="w-full lg:w-7/12 p-6 sm:p-8 md:p-10 space-y-6">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 font-mono text-xs font-bold uppercase tracking-wider">
                {projectType}
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-neutral-300 text-neutral-800 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                <Calendar size={13} aria-hidden="true" />
                Batch {batch}
              </span>
            </div>

            {/* Title */}
            <TypewriterTitle title={title} />

            {/* Complete Project Description */}
            <div className="space-y-2 pt-3 border-t border-neutral-200">
              <h3 className="font-mono text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} aria-hidden="true" />
                <span>Project Description</span>
              </h3>
              <div className="text-neutral-800 text-sm leading-relaxed font-sans whitespace-pre-line bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-sm">
                {abstract}
              </div>
            </div>

            {/* Parsed Tech Stack */}
            {techStack.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-neutral-200">
                <h3 className="font-mono text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <Code size={14} aria-hidden="true" />
                  <span>Tech Stack ({techStack.length})</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-white border border-neutral-300 text-neutral-800 font-mono text-xs font-medium shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Guide Detail */}
            {guideName && (
              <div className="space-y-2 pt-3 border-t border-neutral-200">
                <h3 className="font-mono text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <UserCheck size={14} aria-hidden="true" />
                  <span>Project Guide</span>
                </h3>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3.5">
                    {matchedFaculty && matchedFaculty.img ? (
                      <div
                        onClick={handleGuideClick}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-300 shrink-0 shadow-md cursor-pointer group hover:border-red-600 transition-colors"
                      >
                        <SafeImage
                          src={`${matchedFaculty.img}-320.webp`}
                          alt={matchedFaculty.name}
                          category="Faculty"
                          initials={matchedFaculty.initials || 'FC'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={handleGuideClick}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-neutral-100 flex items-center justify-center font-serif text-sm sm:text-base font-bold text-red-600 border border-neutral-300 shrink-0 cursor-pointer hover:border-red-600"
                      >
                        {matchedFaculty?.initials || guideName.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <span className="text-[11px] text-neutral-500 block font-mono">Faculty Supervisor</span>
                      <button
                        type="button"
                        onClick={handleGuideClick}
                        className="font-serif font-bold text-base sm:text-lg text-neutral-900 hover:text-red-600 underline underline-offset-4 transition-colors cursor-pointer text-left"
                      >
                        {guideName}
                      </button>
                      {matchedFaculty?.designation && matchedFaculty.designation !== matchedFaculty.group && (
                        <span className="text-xs text-neutral-600 block font-mono">{matchedFaculty.designation}</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGuideClick}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 border border-red-700 text-white hover:bg-red-700 font-mono text-xs font-bold transition-all cursor-pointer shadow-md shrink-0"
                  >
                    Profile →
                  </button>
                </div>
              </div>
            )}

            {/* Project Team Members */}
            {members.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-neutral-200">
                <h3 className="font-mono text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <Users size={14} aria-hidden="true" />
                  <span>Project Team Members ({members.length})</span>
                </h3>
                <ul className="space-y-2 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                  {members.map((member, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-neutral-200/80 last:border-0 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400 font-bold">{idx + 1}.</span>
                        <span className="font-bold text-neutral-950 text-sm">{member.name}</span>
                        {member.isLeader && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-300 text-[9px] font-bold uppercase">
                            Leader
                          </span>
                        )}
                      </div>
                      {member.registerNumber && (
                        <span className="text-neutral-800 font-mono font-semibold">
                          {member.registerNumber}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Team Leader GitHub */}
            {githubUrl && (
              <div className="pt-3 border-t border-neutral-200">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl bg-white border border-neutral-300 text-neutral-900 font-mono text-xs font-bold hover:bg-neutral-50 hover:border-red-600 hover:text-red-600 transition-all cursor-pointer shadow-sm"
                >
                  <GithubIcon className="w-4 h-4 text-neutral-900" aria-hidden="true" />
                  <span>GitHub Repository ({githubUsername || 'Profile'})</span>
                  <ExternalLink size={13} className="text-neutral-500" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Working Demo Image Lightbox (z-[20000]) */}
      {showImageLightbox && (
        <div
          className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn"
          onClick={() => setShowImageLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setShowImageLightbox(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-red-600 transition-all cursor-pointer z-30 shadow-2xl"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center p-2">
            <SafeImage
              src={workingDemoImage}
              alt={`${title} Full Preview`}
              category="Working Demo Preview"
              initials="PREVIEW"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-neutral-800 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
