import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import TiltedCards from './components/TiltedCards';
import YodhaSection from './components/YodhaSection';
import EventsSection from './components/EventsSection';
import AchievementsSection from './components/AchievementsSection';
import AcademicProjectsSection from './components/projects/AcademicProjectsSection';
import PublicationsSection from './components/PublicationsSection';
import PlacementsSection from './components/PlacementsSection';
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
import AchievementsPage from './pages/AchievementsPage';
import EventsPage from './pages/EventsPage';
import PlacementsPage from './pages/PlacementsPage';
import PublicationsPage from './pages/PublicationsPage';

function getRouteFromHash() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#/projects')) {
    return { type: 'projects' };
  }
  if (hash.startsWith('#/publications')) {
    return { type: 'publications' };
  }
  if (hash.startsWith('#/placements')) {
    return { type: 'placements' };
  }
  if (hash.startsWith('#/events')) {
    if (hash.includes('filter=bootcamps')) {
      return { type: 'events', filter: 'bootcamps' };
    }
    if (hash.includes('filter=hackathons')) {
      return { type: 'events', filter: 'hackathons' };
    }
    return { type: 'events', filter: 'ALL' };
  }
  if (hash.startsWith('#/achievements')) {
    return { type: 'achievements' };
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
    } else if (pageType === 'publications') {
      window.location.hash = '#/publications';
    } else if (pageType === 'placements') {
      window.location.hash = '#/placements';
    } else if (pageType === 'events') {
      if (param === 'bootcamps' || param === 'hackathons') {
        window.location.hash = `#/events?filter=${param}`;
      } else {
        window.location.hash = '#/events';
      }
    } else if (pageType === 'achievements') {
      window.location.hash = '#/achievements';
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

  return (
    <ThemeProvider>
      {route.type === 'projects' ? (
        <div className="app-main-wrapper bg-[#080808] relative min-h-screen">
          <GlobalDotField />
          <ProjectsPage onNavigate={handleNavigate} />
        </div>
      ) : route.type === 'publications' ? (
        <div className="app-main-wrapper bg-[#080808] relative min-h-screen">
          <GlobalDotField />
          <PublicationsPage onNavigate={handleNavigate} />
        </div>
      ) : route.type === 'placements' ? (
        <div className="app-main-wrapper bg-[#08080c] relative min-h-screen">
          <GlobalDotField />
          <PlacementsPage onNavigate={handleNavigate} />
        </div>
      ) : route.type === 'events' ? (
        <div className="app-main-wrapper bg-[#0e0708] relative min-h-screen">
          <GlobalDotField />
          <EventsPage onNavigate={handleNavigate} filterParam={route.filter} />
        </div>
      ) : route.type === 'achievements' ? (
        <div className="app-main-wrapper bg-[#080808] relative min-h-screen">
          <GlobalDotField />
          <AchievementsPage onNavigate={handleNavigate} />
        </div>
      ) : route.type === 'faculty' ? (
        <div className="app-main-wrapper bg-[#080808] relative min-h-screen">
          <GlobalDotField />
          <FacultyProfilePage slugOrName={route.slug} onNavigate={handleNavigate} />
        </div>
      ) : route.type === 'project' ? (
        <div className="app-main-wrapper bg-[#080808] relative min-h-screen">
          <GlobalDotField />
          <ProjectDetailsPage projectId={route.id} onNavigate={handleNavigate} />
        </div>
      ) : (
        /* Default: Main Single-Page Website */
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
                <TiltedCards onNavigate={handleNavigate} />
              </div>
            </div>

            {/* 3. Events: Yodha + Events collection */}
            <div id="events" className="bg-[#0a0a0a]">
              <YodhaSection />
              <div className="border-t border-neutral-900/80">
                <EventsSection onNavigate={handleNavigate} />
              </div>
            </div>

            {/* 4. Achievements */}
            <div id="achievements" className="bg-[#080808] border-t border-neutral-800/60">
              <AchievementsSection onNavigate={handleNavigate} />
            </div>

            {/* 4.4. Publications Showcase (Staff & Student Publications) */}
            <div id="publications" className="bg-[#080808] border-t border-neutral-800/60">
              <PublicationsSection showAll={false} onNavigate={handleNavigate} />
            </div>

            {/* 4.5. Academic Projects Showcase (Top 4 Priority Projects + VIEW ALL) */}
            <div id="projects" className="bg-neutral-950 border-t border-neutral-800/60">
              <AcademicProjectsSection onNavigate={handleNavigate} />
            </div>

            {/* 4.8. Placements Showcase (Main Homepage Flow: Paginated 10 records per page) */}
            <div id="placements" className="bg-[#080808] border-t border-neutral-800/60">
              <PlacementsSection showAll={false} onNavigate={handleNavigate} />
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
      )}
    </ThemeProvider>
  );
}
