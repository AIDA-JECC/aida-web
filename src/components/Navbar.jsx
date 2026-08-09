import React, { useState, useEffect } from 'react';
import { siteConfig } from '../data/siteData';
import { Home, Info, Calendar, Trophy, Users, Sparkles, ShieldCheck, Mail } from 'lucide-react';
import { NavBar as TubelightNavBar } from './ui/tubelight-navbar';
import MobileCurvedHeader from './ui/curved-menu';

const tubelightNavItems = [
  { name: 'Home', url: '#home', id: 'home', icon: Home },
  { name: 'About', url: '#about', id: 'about', icon: Info },
  { name: 'Events', url: '#events', id: 'events', icon: Calendar },
  { name: 'Achievements', url: '#achievements', id: 'achievements', icon: Trophy },
  { name: 'Faculty', url: '#team', id: 'team', icon: Users },
  { name: 'Core Team', url: '#core-team', id: 'core-team', icon: Sparkles },
  { name: 'Verify', url: '#verify', id: 'verify', icon: ShieldCheck },
  { name: 'Contact', url: '#contact', id: 'contact', icon: Mail },
];

export default function Navbar({ onVerifyClick }) {
  const [activeSection, setActiveSection] = useState('home');

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
      {/* Brand Capsule (Top Left) */}
      <div className="fixed top-5 left-4 sm:left-8 z-50 pointer-events-auto">
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

      {/* Desktop Tubelight Floating Navbar */}
      <TubelightNavBar
        items={tubelightNavItems}
        activeSection={activeSection}
        onSelect={(id) => scrollTo(id)}
      />

      {/* Mobile Off-White SVG Curved Drawer Navbar */}
      <MobileCurvedHeader onSelect={(id) => scrollTo(id)} />
    </>
  );
}
