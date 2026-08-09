import React, { useEffect, useState, useRef, useCallback } from 'react';
import { eventsData } from '../data/siteData';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import EventArtwork from './EventArtwork';
import HeroDotField from './HeroDotField';

const showcaseEvents = eventsData.slice(0, 3);
const ROTATION_INTERVAL = 2500; // 2.5 seconds auto-rotation

// Fixed colors per card index — these never change when cards rotate
const cardColors = [
  { bg: 'bg-red-600 border-red-500/60', meta: 'text-white/80' },
  { bg: 'bg-neutral-950 border-neutral-700/60', meta: 'text-neutral-400' },
  { bg: 'bg-white border-neutral-300', meta: 'text-neutral-500' },
];

// Layout transforms per position (front, middle, back)
const cardLayouts = [
  'shadow-2xl z-30 group-hover:scale-[1.03]',
  'shadow-xl z-20 rotate-4 translate-y-1.5 group-hover:rotate-12 group-hover:translate-x-10 group-hover:translate-y-3',
  'shadow-lg z-10 -rotate-6 -translate-y-3 group-hover:-rotate-12 group-hover:-translate-x-10 group-hover:-translate-y-4',
];

export default function Hero({ onExploreEventsClick }) {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [rotationPaused, setRotationPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Pointer drag gesture state for swiping/dragging top card away to any side (Mobile touch & PC mouse)
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const pointerStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event) => setPrefersReducedMotion(event.matches);

    motionPreference.addEventListener('change', updateMotionPreference);
    return () => motionPreference.removeEventListener('change', updateMotionPreference);
  }, []);

  // Auto-rotate every 2.5 seconds
  useEffect(() => {
    if (rotationPaused || prefersReducedMotion || showcaseEvents.length < 2 || isSwiping) return undefined;

    const interval = window.setInterval(() => {
      setActiveEventIndex((current) => (current + 1) % showcaseEvents.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, rotationPaused, isSwiping]);

  const handlePointerDown = (clientX, clientY) => {
    pointerStartPos.current = { x: clientX, y: clientY };
    setIsSwiping(true);
    setRotationPaused(true);
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isSwiping) return;
    const dx = clientX - pointerStartPos.current.x;
    const dy = clientY - pointerStartPos.current.y;
    setTouchOffset({ x: dx, y: dy });
  };

  const handlePointerEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    setRotationPaused(false);
    const distance = Math.hypot(touchOffset.x, touchOffset.y);
    if (distance > 35) {
      // Swiped card away! Cycle to next card
      setActiveEventIndex((current) => (current + 1) % showcaseEvents.length);
    }
    setTouchOffset({ x: 0, y: 0 });
  };

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
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      // PC: start typing immediately
      startTyping();
      return;
    }

    // Mobile: wait until the subtitle paragraph scrolls into view
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
  }, [startTyping]);

  const activeEvent = showcaseEvents[activeEventIndex];

  return (
    <section
      id="home"
      className="min-h-screen relative flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-32 sm:pb-40 overflow-hidden max-w-7xl mx-auto text-neutral-950"
    >
      {/* Restrained editorial texture & interactive dot field for the warm light canvas. */}
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
        {/* Editorial title with the event collection as its interactive centrepiece. */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-6 text-center lg:text-left mb-12">
          <h1 className="font-serif text-[4.2rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl leading-[0.88] tracking-tight font-extrabold sm:font-bold text-neutral-950">
            Artificial<br />
            <span className="text-neutral-800 font-extrabold sm:font-bold">Intelligence</span>
          </h1>

          <div className="relative mx-auto my-4 lg:my-0">
            <button
              type="button"
              aria-label={`Explore the event showcase. Currently showing ${activeEvent.name}`}
              className={`relative w-[min(88vw,330px)] sm:w-[340px] md:w-[380px] h-[220px] sm:h-[260px] cursor-pointer group select-none text-left touch-none ${prefersReducedMotion || isSwiping ? '' : 'animate-float-slow'}`}
              onClick={(e) => {
                // Trigger click only if user didn't drag
                if (Math.hypot(touchOffset.x, touchOffset.y) < 10) {
                  onExploreEventsClick();
                }
              }}
              onMouseEnter={() => setRotationPaused(true)}
              onMouseLeave={() => { setRotationPaused(false); handlePointerEnd(); }}
              onFocus={() => setRotationPaused(true)}
              onBlur={() => setRotationPaused(false)}
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerEnd}
              onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={handlePointerEnd}
            >
              {showcaseEvents.map((event, eventIndex) => {
                const position = (eventIndex - activeEventIndex + showcaseEvents.length) % showcaseEvents.length;
                const layout = cardLayouts[position];
                const color = cardColors[eventIndex];
                const isFront = position === 0;

                const isCurrentlyDraggingTopCard = isFront && isSwiping && (touchOffset.x !== 0 || touchOffset.y !== 0);

                return (
                  <span
                    key={event.id}
                    aria-hidden={!isFront}
                    style={
                      isCurrentlyDraggingTopCard
                        ? {
                            transform: `translate(${touchOffset.x}px, ${touchOffset.y}px) rotate(${touchOffset.x * 0.08}deg)`,
                            transition: 'none',
                          }
                        : undefined
                    }
                    className={`absolute inset-0 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${color.bg} ${layout}`}
                  >
                    <EventArtwork
                      event={event}
                      className="w-full h-[130px] sm:h-[160px] rounded-lg pointer-events-none"
                      loading={eventIndex === 0 ? 'eager' : 'lazy'}
                    />
                    <span className={`flex items-center justify-between text-xs font-mono ${color.meta}`}>
                      <span className={isFront ? 'font-bold' : ''}>#{event.year}</span>
                      <span className={isFront ? 'text-white font-sans font-semibold truncate max-w-[180px] inline-flex items-center gap-1' : ''}>
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
                  </span>
                );
              })}
            </button>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              Now showing {activeEvent.name}
            </span>
          </div>

          <h1 className="font-serif text-[4.2rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl leading-[0.88] tracking-tight font-extrabold sm:font-bold text-neutral-950 lg:text-right">
            &amp; Data<br />
            <span className="text-red-600 italic font-serif font-extrabold sm:font-bold">Science</span>
          </h1>
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
