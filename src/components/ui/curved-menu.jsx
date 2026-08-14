import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../data/siteData';

const MENU_SLIDE_ANIMATION = {
  initial: { x: '100%' },
  enter: { x: '0%', transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
  exit: {
    x: '100%',
    transition: { duration: 0.28, ease: [0.5, 0, 0.75, 0] },
  },
};

const defaultNavItems = [
  { heading: 'Home', href: '#home', id: 'home' },
  { heading: 'About AIDA', href: '#about', id: 'about' },
  { heading: 'Events & Workshops', href: '#events', id: 'events' },
  { heading: 'Achievements', href: '#achievements', id: 'achievements' },
  { heading: 'Meet Our Faculty', href: '#team', id: 'team' },
  { heading: 'Meet Core Team', href: '#core-team', id: 'core-team' },
  { heading: 'Verify Certificate', href: '#verify', id: 'verify' },
  { heading: 'Contact Us', href: '#contact', id: 'contact' },
];

const SECTION_NAMES = {
  home: 'HOME',
  about: 'ABOUT',
  events: 'EVENTS',
  achievements: 'ACHIEVEMENTS',
  team: 'FACULTY',
  'core-team': 'CORE TEAM',
  verify: 'VERIFY',
  contact: 'CONTACT',
};

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.04,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: -14, x: -6 },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 450,
      damping: 30,
    },
  },
};

const CustomFooter = () => {
  return (
    <div className="flex w-full text-xs font-mono justify-between text-neutral-800 px-6 sm:px-10 md:px-12 py-5 border-t border-neutral-300/80 items-center shrink-0">
      <div className="flex gap-4 items-center">
        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-600 transition-colors flex items-center gap-1 group font-semibold"
        >
          <span>INSTAGRAM</span>
          <ArrowUpRight size={13} className="group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
        <a
          href={siteConfig.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-600 transition-colors flex items-center gap-1 group font-semibold"
        >
          <span>LINKEDIN</span>
          <ArrowUpRight size={13} className="group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
      <a
        href={`mailto:${siteConfig.contactEmail}`}
        className="text-red-600 font-bold hover:underline transition-all hover:scale-105"
      >
        {siteConfig.contactEmail}
      </a>
    </div>
  );
};

const NavLink = ({
  heading,
  href,
  id,
  setIsActive,
  index,
  onSelect,
  isActiveSection,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    setIsActive(false);
    if (onSelect) onSelect(id);
  };

  const formattedIndex = index < 10 ? `0${index}` : `${index}`;

  return (
    <motion.div variants={ITEM_VARIANTS}>
      <a
        href={href}
        onClick={handleClick}
        className="group relative flex items-center justify-between py-3 border-b border-neutral-300/60 uppercase cursor-pointer select-none transition-colors duration-200"
      >
        <div className="flex items-center gap-3.5">
          {/* Index Page Manner Prefix */}
          <span className="text-red-600 font-mono text-sm font-bold shrink-0 w-7">
            {formattedIndex}.
          </span>

          {/* Heading Text: Mild Hover Effect */}
          <span
            className={`text-lg sm:text-2xl font-serif tracking-tight transition-all duration-200 uppercase transform group-hover:translate-x-1.5 ${
              isActiveSection
                ? 'text-red-600 font-extrabold'
                : 'text-neutral-900 group-hover:text-red-600 font-bold'
            }`}
          >
            {heading}
          </span>
        </div>

        {/* Mild Action Arrow on Hover */}
        <div className="flex items-center gap-2">
          {isActiveSection && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
          <ArrowUpRight
            size={18}
            className="text-red-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
          />
        </div>
      </a>
    </motion.div>
  );
};

const Curve = () => {
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initialPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q-100 ${windowHeight / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q100 ${windowHeight / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.3, ease: [0.5, 0, 0.75, 0] },
    },
  };

  return (
    <svg
      className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full pointer-events-none"
      style={{ fill: '#f5f5f0' }}
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};

const CurvedNavbar = ({ setIsActive, navItems, footer, onSelect, activeSection }) => {
  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-[100dvh] w-[90vw] sm:w-[420px] md:w-[480px] lg:w-[520px] fixed right-0 top-0 z-40 bg-[#f5f5f0] shadow-[0_0_60px_rgba(0,0,0,0.3)] text-neutral-950 border-l border-neutral-300/80 overflow-hidden flex flex-col justify-between"
    >
      <div className="h-full pt-12 sm:pt-14 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-2 px-6 sm:px-10 md:px-12">
          {/* Header Brand Logo Pill inside Drawer */}
          <div className="flex items-center justify-center pb-4 border-b border-neutral-300/60 mb-3">
            <div className="flex items-center gap-2.5 bg-neutral-950 border border-red-900/40 px-4 py-2 rounded-full backdrop-blur-xl text-white shadow-xl">
              <img
                src={siteConfig.logo}
                alt="AIDA Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              />
              <span className="font-sans font-black text-sm sm:text-base tracking-tight uppercase">
                AIDA <span className="font-serif italic text-red-500 font-normal lowercase text-base sm:text-lg">jecc</span>
              </span>
            </div>
          </div>

          <section className="bg-transparent mt-1">
            {/* Fast Staggered Entry Animation for Drawer Items */}
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              animate="show"
              className="mx-auto flex flex-col"
            >
              {navItems.map((item, index) => {
                const isActiveSection = activeSection === item.id;
                return (
                  <NavLink
                    key={item.href}
                    {...item}
                    setIsActive={setIsActive}
                    index={index + 1}
                    onSelect={onSelect}
                    isActiveSection={isActiveSection}
                  />
                );
              })}
            </motion.div>
          </section>
        </div>
        {footer}
      </div>
      <Curve />
    </motion.div>
  );
};

export default function CurvedHeader({
  navItems = defaultNavItems,
  footer = <CustomFooter />,
  onSelect,
  activeSection = 'home',
  isMenuOpen: externalIsMenuOpen,
  setIsMenuOpen: externalSetIsMenuOpen,
}) {
  const [internalIsActive, setInternalIsActive] = useState(false);

  const isActive = externalIsMenuOpen !== undefined ? externalIsMenuOpen : internalIsActive;
  const setIsActive = externalSetIsMenuOpen !== undefined ? externalSetIsMenuOpen : setInternalIsActive;

  useEffect(() => {
    if (isActive) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isActive]);

  const currentSectionLabel = SECTION_NAMES[activeSection] || 'HOME';

  return (
    <div className="block">
      {/* Universal Floating Trigger Button (PC & Mobile View) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          aria-label="Toggle Navigation Menu"
          className="fixed right-4 sm:right-8 top-5 z-50 h-11 px-4 sm:px-5 rounded-full flex items-center gap-3 cursor-pointer bg-neutral-950/90 border border-red-900/50 shadow-2xl backdrop-blur-xl text-white hover:border-red-600 hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] hover:scale-[1.05] active:scale-95 transition-all duration-300"
        >
          {/* Static Current Section Name + Small Space + Icon when CLOSED; Icon only when OPEN */}
          {!isActive && (
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-neutral-200">
              {currentSectionLabel}
            </span>
          )}
          <div className="relative w-5 h-4 flex flex-col justify-between items-center shrink-0 ml-1">
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-transform duration-300 ${
                isActive ? 'rotate-45 translate-y-1.5 bg-red-600' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${
                isActive ? 'opacity-0 scale-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-transform duration-300 ${
                isActive ? '-rotate-45 -translate-y-2 bg-red-600' : ''
              }`}
            />
          </div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isActive && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsActive(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 pointer-events-auto cursor-pointer"
            />
            <CurvedNavbar
              setIsActive={setIsActive}
              navItems={navItems}
              footer={footer}
              onSelect={onSelect}
              activeSection={activeSection}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export { CurvedHeader as MobileCurvedHeader };






