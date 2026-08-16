import React, { useState, useEffect } from 'react';
import { siteConfig } from '../data/siteData';
import SterlingGateKineticNavigation from './ui/sterling-gate-kinetic-navigation';

export default function Navbar({ onVerifyClick }) {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const navSections = [
            'home',
            'about',
            'events',
            'achievements',
            'projects',
            'team',
            'core-team',
            'verify',
            'contact',
          ];
          const viewportAnchor = window.innerHeight * 0.35;
          let currentSection = 'home';

          for (let i = 0; i < navSections.length; i++) {
            const el = document.getElementById(navSections[i]);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= viewportAnchor) {
                currentSection = navSections[i];
              }
            }
          }

          setActiveSection((prev) => (prev !== currentSection ? currentSection : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    if (id === 'verify') {
      window.dispatchEvent(new CustomEvent('open-verify-section'));
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Brand Capsule (Top Left): Vanishes when menu is open, appears when menu is closed */}
      <div
        className={`fixed top-5 left-4 sm:left-8 z-[9999] transition-all duration-300 ${
          isMenuOpen
            ? 'opacity-0 pointer-events-none -translate-x-4'
            : 'opacity-100 pointer-events-auto translate-x-0'
        }`}
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('home');
          }}
          className="flex items-center gap-2.5 bg-neutral-950/90 border border-red-900/40 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl text-white shadow-2xl hover:border-red-600 hover:shadow-[0_0_22px_rgba(229,9,20,0.45)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          <img
            src={siteConfig.logo}
            alt="AIDA Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 hover:rotate-6"
          />
          <span className="font-sans font-black text-sm sm:text-base tracking-tight uppercase">
            AIDA <span className="font-serif italic text-red-500 font-normal lowercase text-base sm:text-lg">jecc</span>
          </span>
        </a>
      </div>

      {/* Universal Sterling Gate Kinetic Navigation (PC & Mobile View) */}
      <SterlingGateKineticNavigation
        activeSection={activeSection}
        onSelect={(id) => scrollTo(id)}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </>
  );
}



