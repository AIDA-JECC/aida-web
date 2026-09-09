import React, { useState, useEffect } from 'react';
import { siteConfig } from '../data/siteData';
import SterlingGateKineticNavigation from './ui/sterling-gate-kinetic-navigation';
import { useTheme } from '../context/ThemeContext';
import { AnimatedThemeToggle } from './ui/animated-theme-toggle';

const TAB_PHRASES = [
  'AIDA JECC',
  'Department of Artificial Intelligence & Data Science',
];

export default function Navbar({ onVerifyClick }) {
  const { theme, toggleTheme, isLight } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Typewriter animation strictly for browser tab title (document.title near URL bar)
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TAB_PHRASES[phraseIndex];
    let timer;

    if (!isDeleting && typedText === currentPhrase) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TAB_PHRASES.length);
    } else {
      const speed = isDeleting ? 25 : 55;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentPhrase.slice(0, typedText.length - 1)
          : currentPhrase.slice(0, typedText.length + 1);
        setTypedText(nextText);
      }, speed);
    }

    document.title = typedText ? `${typedText}` : 'AIDA JECC';

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex]);

  useEffect(() => {
    const checkModalOpen = () => {
      setIsModalOpen(document.body.classList.contains('modal-open'));
    };

    checkModalOpen();

    const handleModalChange = (e) => {
      if (e.detail && typeof e.detail.isOpen === 'boolean') {
        setIsModalOpen(e.detail.isOpen);
      } else {
        checkModalOpen();
      }
    };

    const observer = new MutationObserver(checkModalOpen);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('modal-state-change', handleModalChange);
    return () => {
      observer.disconnect();
      window.removeEventListener('modal-state-change', handleModalChange);
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const navSections = [
            'home',
            'about',
            'services',
            'events',
            'achievements',
            'publications',
            'projects',
            'placements',
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

  if (isModalOpen) return null;

  return (
    <>
      {/* Top Left Bar: Brand Capsule (visible when menu is closed) */}
      <div className="fixed top-5 left-4 sm:left-8 z-[9999] flex items-center pointer-events-auto">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('home');
          }}
          className={`flex items-center gap-2.5 bg-neutral-950/90 border border-red-900/40 px-3.5 sm:px-4 h-[2.75rem] rounded-full backdrop-blur-xl text-white shadow-2xl hover:border-red-600 hover:shadow-[0_0_22px_rgba(229,9,20,0.45)] hover:scale-[1.03] active:scale-95 transition-all duration-300 ${
            isMenuOpen
              ? 'opacity-0 pointer-events-none -translate-x-4 hidden'
              : 'opacity-100 pointer-events-auto translate-x-0'
          }`}
        >
          <img
            src={siteConfig.logo}
            alt="AIDA Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 hover:rotate-6"
          />
          <span className="font-sans font-black text-sm sm:text-base tracking-tight uppercase whitespace-nowrap">
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



