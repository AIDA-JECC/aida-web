import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { siteConfig } from '../../data/siteData';

const MENU_SLIDE_ANIMATION = {
  initial: { x: 'calc(100% + 100px)' },
  enter: { x: '0', transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } },
  exit: {
    x: 'calc(100% + 100px)',
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
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

const CustomFooter = () => {
  return (
    <div className="flex w-full text-xs font-mono justify-between text-neutral-800 px-6 sm:px-10 py-5 border-t border-neutral-300/80 items-center">
      <div className="flex gap-4 items-center">
        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-600 transition-colors flex items-center gap-1 group"
        >
          <span>INSTAGRAM</span>
          <ArrowUpRight size={13} className="group-hover:text-red-600 transition-colors" />
        </a>
        <a
          href={siteConfig.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-600 transition-colors flex items-center gap-1 group"
        >
          <span>LINKEDIN</span>
          <ArrowUpRight size={13} className="group-hover:text-red-600 transition-colors" />
        </a>
      </div>
      <a
        href={`mailto:${siteConfig.contactEmail}`}
        className="text-red-600 font-bold hover:underline transition-all"
      >
        {siteConfig.contactEmail}
      </a>
    </div>
  );
};

const NavLink = ({ heading, href, id, setIsActive, index, onSelect }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsActive(false);
    if (onSelect) onSelect(id);
  };

  return (
    <motion.div
      onClick={handleClick}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b border-neutral-300/60 py-3 transition-colors duration-300 uppercase cursor-pointer"
    >
      <a
        ref={ref}
        onMouseMove={handleMouseMove}
        href={href}
        onClick={handleClick}
        className="relative flex items-center w-full"
      >
        <span className="text-red-600 font-mono text-sm font-bold mr-3 w-6">
          0{index}.
        </span>
        <div className="flex flex-row gap-1 items-center">
          <motion.span
            variants={{
              initial: { x: 0 },
              whileHover: { x: 8 },
            }}
            transition={{
              type: 'spring',
              staggerChildren: 0.04,
              delayChildren: 0.05,
            }}
            className="relative z-10 block text-xl sm:text-2xl font-serif text-neutral-900 group-hover:text-red-600 transition-colors duration-300"
          >
            {heading.split('').map((letter, i) => {
              return (
                <motion.span
                  key={i}
                  variants={{
                    initial: { x: 0 },
                    whileHover: { x: 4 },
                  }}
                  transition={{ type: 'spring' }}
                  className="inline-block"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              );
            })}
          </motion.span>
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
      transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
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

const CurvedNavbar = ({ setIsActive, navItems, footer, onSelect }) => {
  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-[100dvh] w-[88vw] max-w-sm fixed right-0 top-0 z-40 bg-[#f5f5f0] shadow-2xl text-neutral-950 border-l border-neutral-300/80 overflow-hidden flex flex-col justify-between"
    >
      <div className="h-full pt-14 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-2 px-6 sm:px-10">
          <div className="text-neutral-900 font-serif text-2xl font-extrabold tracking-widest text-center pb-3 border-b border-neutral-300/60 mb-1">
            AIDA
            <div className="mt-2 mx-auto w-10 h-[2px] bg-red-600 rounded-full" />
          </div>
          <section className="bg-transparent mt-2">
            <div className="mx-auto">
              {navItems.map((item, index) => {
                return (
                  <NavLink
                    key={item.href}
                    {...item}
                    setIsActive={setIsActive}
                    index={index + 1}
                    onSelect={onSelect}
                  />
                );
              })}
            </div>
          </section>
        </div>
        {footer}
      </div>
      <Curve />
    </motion.div>
  );
};

export default function MobileCurvedHeader({
  navItems = defaultNavItems,
  footer = <CustomFooter />,
  onSelect,
}) {
  const [isActive, setIsActive] = useState(false);

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

  return (
    <div className="md:hidden">
      {/* Mobile Floating Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          aria-label="Toggle Mobile Menu"
          className="fixed right-4 top-5 z-50 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-neutral-950/90 border border-red-900/50 shadow-2xl backdrop-blur-xl text-white hover:border-red-600 transition-all duration-300"
        >
          <div className="relative w-6 h-5 flex flex-col justify-between items-center">
            <span
              className={`block h-0.5 w-5 bg-white transition-transform duration-300 ${
                isActive ? 'rotate-45 translate-y-2 bg-red-600' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-opacity duration-300 ${
                isActive ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-transform duration-300 ${
                isActive ? '-rotate-45 -translate-y-2.5 bg-red-600' : ''
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
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 pointer-events-auto"
            />
            <CurvedNavbar
              setIsActive={setIsActive}
              navItems={navItems}
              footer={footer}
              onSelect={onSelect}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
