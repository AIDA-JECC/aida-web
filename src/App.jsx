import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import TiltedCards from './components/TiltedCards';
import YodhaSection from './components/YodhaSection';
import EventsSection from './components/EventsSection';
import AchievementsSection from './components/AchievementsSection';
import AcademicProjectsSection from './components/projects/AcademicProjectsSection';
import Team from './components/Team';
import CoreTeamSection from './components/CoreTeamSection';
import FaqSection from './components/FaqSection';
import LightTransitionSection from './components/LightTransitionSection';
import Footer from './components/Footer';
import GlobalDotField from './components/GlobalDotField';
import IntroVideo from './components/IntroVideo';

// Dedicated Full Pages
import ProjectsPage from './pages/ProjectsPage';
import FacultyProfilePage from './pages/FacultyProfilePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

function getRouteFromHash() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#/projects')) {
    return { type: 'projects' };
  }
  if (hash.startsWith('#/faculty/')) {
    const slug = hash.replace('#/faculty/', '');
    return { type: 'faculty', slug: decodeURIComponent(slug) };
  }
  if (hash.startsWith('#/project/')) {
    const id = hash.replace('#/project/', '');
    return { type: 'project', id: decodeURIComponent(id) };
  }
  return { type: 'home' };
}

export default function App() {
  const [route, setRoute] = useState(() => getRouteFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Scroll to section when returning to home view
  useEffect(() => {
    if (route.type === 'home') {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#') && !hash.startsWith('#/')) {
        const id = hash.replace('#', '');
        const elem = document.getElementById(id);
        if (elem) {
          setTimeout(() => {
            elem.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [route]);

  const handleNavigate = (pageType, param) => {
    if (pageType === 'projects') {
      window.location.hash = '#/projects';
    } else if (pageType === 'faculty') {
      window.location.hash = `#/faculty/${param}`;
    } else if (pageType === 'project') {
      window.location.hash = `#/project/${param}`;
    } else {
      window.location.hash = '#projects';
    }
  };

  const scrollTo = (id) => {
    if (route.type !== 'home') {
      window.location.hash = `#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Render dedicated full pages if hash matches dedicated route (No Footer on dedicated pages)
  if (route.type === 'projects') {
    return (
      <div className="app-main-wrapper bg-[#080808] relative min-h-screen">
        <GlobalDotField />
        <ProjectsPage onNavigate={handleNavigate} />
      </div>
    );
  }

  if (route.type === 'faculty') {
    return (
      <div className="app-main-wrapper bg-[#080808] relative min-h-screen">
        <GlobalDotField />
        <FacultyProfilePage slugOrName={route.slug} onNavigate={handleNavigate} />
      </div>
    );
  }

  if (route.type === 'project') {
    return (
      <div className="app-main-wrapper bg-[#080808] relative min-h-screen">
        <GlobalDotField />
        <ProjectDetailsPage projectId={route.id} onNavigate={handleNavigate} />
      </div>
    );
  }

  // Default: Main Single-Page Website
  return (
    <div className="app-main-wrapper bg-[#080808] relative">
      {/* Interactive Video Intro (PC View Only) */}
      <IntroVideo />

      {/* Website-Wide Interactive Particle Dot Background */}
      <GlobalDotField />

      <Navbar onVerifyClick={() => scrollTo('verify')} />

      <main>
        {/* 1. Light editorial hero */}
        <div id="home" className="relative bg-[#f5f5f0]">
          <Hero onExploreEventsClick={() => scrollTo('events')} />
        </div>

        {/* 2. Department context (About & Pillars): rounded transition back into dark theme */}
        <div id="about" className="relative -mt-[5vh] md:-mt-[8vh] z-10 bg-neutral-950 border-t border-neutral-800/60 rounded-t-[2.5rem] sm:rounded-t-[4rem] rounded-b-[2.5rem] sm:rounded-b-[4rem] shadow-[0_-24px_70px_rgba(0,0,0,0.16)] overflow-clip">
          <AboutSection />
          <div className="border-t border-neutral-900/80">
            <TiltedCards />
          </div>
        </div>

        {/* 3. Events: Yodha + Events collection */}
        <div id="events" className="bg-[#0a0a0a]">
          <YodhaSection />
          <div className="border-t border-neutral-900/80">
            <EventsSection />
          </div>
        </div>

        {/* 4. Achievements */}
        <div id="achievements" className="bg-[#080808] border-t border-neutral-800/60">
          <AchievementsSection />
        </div>

        {/* 4.5. Academic Projects Showcase (Top 4 Priority Projects + VIEW ALL) */}
        <div id="projects" className="bg-neutral-950 border-t border-neutral-800/60">
          <AcademicProjectsSection onNavigate={handleNavigate} />
        </div>

        {/* 5. Faculty & Core Team */}
        <div id="team" className="bg-neutral-950 border-t border-neutral-800/60">
          <Team onNavigate={handleNavigate} />
        </div>

        <div id="core-team" className="border-t border-neutral-900/80 bg-[#0a0a0a]">
          <CoreTeamSection />
        </div>

        {/* 6. FAQ section with rounded bottom border & Light verification portal */}
        <div className="relative bg-[#f5f5f0]">
          <div className="relative z-20 bg-neutral-950 border-t border-b border-neutral-800/60 rounded-b-[2.5rem] sm:rounded-b-[4rem] shadow-[0_24px_70px_rgba(0,0,0,0.3)] overflow-clip">
            <FaqSection />
          </div>

          <div id="verify">
            <LightTransitionSection />
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
