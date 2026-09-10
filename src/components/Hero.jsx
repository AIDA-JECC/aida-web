import React, { useEffect, useState, useRef, useCallback } from 'react';
import { eventsData } from '../data/siteData';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import EventArtwork from './EventArtwork';
import HeroDotField from './HeroDotField';
import { motion } from 'framer-motion';

const showcaseEvents = eventsData.slice(0, 3);
const ROTATION_INTERVAL = 5000; // 5 seconds auto-rotation

// Fixed colors per card index — these never change when cards rotate
const cardColors = [
  { bg: 'bg-red-600 border-red-500/70', meta: 'text-white/90' },
  { bg: 'bg-neutral-950 border-neutral-700/70', meta: 'text-neutral-400' },
  { bg: 'bg-white border-neutral-300', meta: 'text-neutral-500' },
];

export default function Hero({ onExploreEventsClick }) {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [rotationPaused, setRotationPaused] = useState(false);
  const [isStackHovered, setIsStackHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Responsive device check
  const [isMobileDevice, setIsMobileDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Wait for intro video completion before starting kinetic entrance animations
  const [startEntrance, setStartEntrance] = useState(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const seen = sessionStorage.getItem('aida_intro_seen') === 'true';
      return isMobile || seen;
    }
    return true;
  });

  const [hasCompletedEntrance, setHasCompletedEntrance] = useState(false);

  useEffect(() => {
    const handleIntroFinish = () => {
      setStartEntrance(true);
    };

    window.addEventListener('intro-video-finished', handleIntroFinish);
    return () => window.removeEventListener('intro-video-finished', handleIntroFinish);
  }, []);

  // Set initial entrance completed state after drop animation (~1.3s)
  useEffect(() => {
    if (!startEntrance) return;
    const timer = setTimeout(() => {
      setHasCompletedEntrance(true);
    }, 1300);
    return () => clearTimeout(timer);
  }, [startEntrance]);

  // Trigger dot field impact bounce shockwave at collision moment (~600ms after entrance starts)
  useEffect(() => {
    if (!startEntrance) return;
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('hero-impact-bounce'));
    }, 600);
    return () => clearTimeout(timer);
  }, [startEntrance]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event) => setPrefersReducedMotion(event.matches);

    motionPreference.addEventListener('change', updateMotionPreference);
    return () => motionPreference.removeEventListener('change', updateMotionPreference);
  }, []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (rotationPaused || isStackHovered || prefersReducedMotion || showcaseEvents.length < 2) return undefined;

    const interval = window.setInterval(() => {
      setActiveEventIndex((current) => (current + 1) % showcaseEvents.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, rotationPaused, isStackHovered]);

  const HERO_SUBTITLE = "Official student association of the Department of Artificial Intelligence & Data Science at Jyothi Engineering College. Empowering ethical leaders with precision & care.";
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const typingStarted = useRef(false);
  const subtitleRef = useRef(null);

  const startTyping = useCallback(() => {
    if (typingStarted.current) return;
    typingStarted.current = true;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayedText(HERO_SUBTITLE.slice(0, i));
      if (i >= HERO_SUBTITLE.length) {
        clearInterval(timer);
        setIsTypingDone(true);
      }
    }, 30);
  }, []);

  useEffect(() => {
    if (!startEntrance) return;

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      startTyping();
      return;
    }

    const el = subtitleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startEntrance, startTyping]);

  const activeEvent = showcaseEvents[activeEventIndex];

  // Helper to compute card stack variant physics based on position & screen size
  const getCardVariant = (position, isHovered, isMobile) => {
    if (position === 0) {
      // Top Front Card
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: isHovered ? 1.02 : 1,
        zIndex: 30,
        opacity: 1,
      };
    }
    if (position === 1) {
      // Middle Card
      return {
        x: isHovered ? (isMobile ? 16 : 28) : (isMobile ? 8 : 14),
        y: isHovered ? (isMobile ? 10 : 16) : (isMobile ? 5 : 8),
        rotate: isHovered ? (isMobile ? 6 : 10) : (isMobile ? 3 : 5),
        scale: 0.95,
        zIndex: 20,
        opacity: 0.92,
      };
    }
    // Back Card (position 2)
    return {
      x: isHovered ? (isMobile ? -16 : -28) : (isMobile ? -8 : -14),
      y: isHovered ? (isMobile ? -10 : -14) : (isMobile ? -5 : -8),
      rotate: isHovered ? (isMobile ? -6 : -10) : (isMobile ? -3 : -5),
      scale: 0.9,
      zIndex: 10,
      opacity: 0.82,
    };
  };

  return (
    <section
      id="home"
      className="min-h-screen relative flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-32 sm:pb-40 overflow-hidden max-w-7xl mx-auto text-neutral-950"
    >
      <HeroDotField />
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] bg-red-200/35 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-35 pointer-events-none -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(23,23,23,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,23,23,0.055) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, black, transparent 78%)',
        }}
      />

      <div className="w-full flex flex-col items-center justify-center my-auto mt-[10vh]">
        {/* Editorial title with interactive card stack showcase */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-6 text-center lg:text-left mb-12">
          {/* Bouncy Left Heading: Artificial Intelligence */}
          <motion.h1
            initial={{ x: -350, opacity: 0 }}
            animate={startEntrance ? { x: 0, opacity: 1 } : { x: -350, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, mass: 1.1, delay: 0.1 }}
            className="font-serif text-[4.2rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl leading-[0.88] tracking-tight font-extrabold sm:font-bold text-neutral-950"
          >
            Artificial<br />
            <span className="text-neutral-800 font-extrabold sm:font-bold">Intelligence</span>
          </motion.h1>

          {/* Interactive Stack Showcase Container */}
          <div className="relative mx-auto my-4 lg:my-0">
            <div
              onMouseEnter={() => setIsStackHovered(true)}
              onMouseLeave={() => setIsStackHovered(false)}
              aria-label={`Explore the event showcase. Currently showing ${activeEvent.name}`}
              className={`relative w-[min(86vw,310px)] sm:w-[340px] md:w-[370px] h-[210px] sm:h-[250px] cursor-pointer select-none text-left ${
                prefersReducedMotion || rotationPaused || isStackHovered ? '' : 'animate-float-slow'
              }`}
            >
              {showcaseEvents.map((event, eventIndex) => {
                const position = (eventIndex - activeEventIndex + showcaseEvents.length) % showcaseEvents.length;
                const color = cardColors[eventIndex];
                const isFront = position === 0;

                // Initial drop delay: Card 0 @ 0.4s, Card 1 @ 0.75s, Card 2 @ 1.1s
                const dropDelay = 0.4 + (2 - position) * 0.35;
                const variant = getCardVariant(position, isStackHovered, isMobileDevice);

                return (
                  <motion.div
                    key={event.id}
                    drag={isFront ? true : false}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.6}
                    dragSnapToOrigin={true}
                    onDragStart={() => setRotationPaused(true)}
                    onDragEnd={(e, info) => {
                      const distance = Math.hypot(info.offset.x, info.offset.y);
                      const velocity = Math.hypot(info.velocity.x, info.velocity.y);
                      if (distance > 25 || velocity > 250) {
                        setActiveEventIndex((current) => (current + 1) % showcaseEvents.length);
                      }
                      setTimeout(() => setRotationPaused(false), 3500);
                    }}
                    onClick={(e) => {
                      if (!isFront) {
                        e.stopPropagation();
                        setActiveEventIndex(eventIndex);
                      } else if (onExploreEventsClick) {
                        onExploreEventsClick();
                      }
                    }}
                    initial={{ y: -450, opacity: 0 }}
                    animate={
                      startEntrance
                        ? {
                            y: variant.y,
                            x: variant.x,
                            rotate: variant.rotate,
                            scale: variant.scale,
                            zIndex: variant.zIndex,
                            opacity: variant.opacity,
                          }
                        : { y: -450, opacity: 0 }
                    }
                    transition={
                      hasCompletedEntrance
                        ? {
                            type: 'spring',
                            stiffness: 280,
                            damping: 24,
                            mass: 0.8,
                          }
                        : {
                            type: 'spring',
                            stiffness: 220,
                            damping: 18,
                            mass: 0.9,
                            delay: isFront ? 0 : dropDelay,
                          }
                    }
                    whileDrag={{ scale: 1.04, cursor: 'grabbing' }}
                    aria-hidden={!isFront}
                    className={`absolute inset-0 border rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-shadow duration-300 ${color.bg} ${
                      isFront ? 'cursor-grab active:cursor-grabbing touch-none' : 'cursor-pointer hover:brightness-110'
                    }`}
                  >
                    <EventArtwork
                      event={event}
                      className="w-full h-[125px] sm:h-[155px] rounded-lg pointer-events-none object-cover"
                      loading={eventIndex === 0 ? 'eager' : 'lazy'}
                    />
                    <span className={`flex items-center justify-between text-xs font-mono ${color.meta} pointer-events-none`}>
                      <span className={isFront ? 'font-bold' : ''}>#{event.year}</span>
                      <span className={isFront ? 'text-white font-sans font-semibold truncate max-w-[170px] sm:max-w-[200px] inline-flex items-center gap-1' : ''}>
                        {isFront ? (
                          <>
                            <span className="truncate">{event.name}</span>
                            <ArrowUpRight size={13} className="text-red-500 shrink-0" aria-hidden="true" />
                          </>
                        ) : (
                          event.category
                        )}
                      </span>
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              Now showing {activeEvent.name}
            </span>
          </div>

          {/* Bouncy Right Heading: & Data Science */}
          <motion.h1
            initial={{ x: 350, opacity: 0 }}
            animate={startEntrance ? { x: 0, opacity: 1 } : { x: 350, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, mass: 1.1, delay: 0.1 }}
            className="font-serif text-[4.2rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl leading-[0.88] tracking-tight font-extrabold sm:font-bold text-neutral-950 lg:text-right"
          >
            &amp; Data<br />
            <span className="text-red-600 italic font-serif font-extrabold sm:font-bold">Science</span>
          </motion.h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between w-full pt-8 border-t border-neutral-300 gap-6 text-center md:text-left">
          <p ref={subtitleRef} className="max-w-md text-sm sm:text-base text-neutral-600 leading-relaxed font-normal min-h-[4.5em]">
            {displayedText}
            {!isTypingDone && (
              <span className="inline-block w-[2px] h-[1em] bg-red-600 ml-0.5 align-middle animate-pulse" />
            )}
          </p>

          <button
            type="button"
            onClick={onExploreEventsClick}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-red-600 hover:bg-neutral-950 text-white font-semibold text-xs sm:text-sm tracking-wider rounded-full shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 min-h-[44px]"
          >
            <span>EXPLORE EVENTS</span>
            <ArrowDownRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

