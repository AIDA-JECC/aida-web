import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import TiltedCards from './components/TiltedCards';
import YodhaSection from './components/YodhaSection';
import EventsSection from './components/EventsSection';
import AchievementsSection from './components/AchievementsSection';
import Team from './components/Team';
import CoreTeamSection from './components/CoreTeamSection';
import FaqSection from './components/FaqSection';
import LightTransitionSection from './components/LightTransitionSection';
import Footer from './components/Footer';
import GlobalDotField from './components/GlobalDotField';
import IntroVideo from './components/IntroVideo';

export default function App() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

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

        {/* 5. Faculty & Core Team */}
        <div id="team" className="bg-neutral-950 border-t border-neutral-800/60">
          <Team />
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
