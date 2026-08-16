import * as React from "react";
import { ChevronLeft, ChevronRight, Mail, ExternalLink } from "lucide-react";
import LinkedinIcon from "./LinkedinIcon";
import { cn } from "../../lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// Subcomponent for typing animation on designation/role
const CoverflowTypingText = ({ text }) => {
  const [displayedText, setDisplayedText] = React.useState('');

  React.useEffect(() => {
    setDisplayedText('');
    if (!text) return undefined;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export function CoverflowCarousel({
  slides = [],
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(200px, 24vw, 280px)",
  gap = 0.05,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  pauseAutoPlay = false,
  label = "Cover carousel",
  className,
  cardClassName,
}) {
  const count = slides.length;

  const frameRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const velocityRef = React.useRef(0);
  const pauseTimerRef = React.useRef(null);

  const [selected, setSelected] = React.useState(0);
  const [isInView, setIsInView] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  // Pause timer handler (1.5 seconds delay on button click or touch action)
  const triggerPause = React.useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1500);
  }, []);

  // IntersectionObserver: auto-scroll activates ONLY when section enters viewport
  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const indexAt = React.useCallback(
    (pos) => ((Math.round(pos) % count) + count) % count,
    [count]
  );

  // Optimized paint with smoother transitions
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    const updates = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      const transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      const opacity = Math.max(0, 1 - fade * distance) * edge;
      const zIndex = 100 - Math.round(distance);

      updates.push({ card, transform, opacity, zIndex });
    });

    for (const update of updates) {
      update.card.style.transform = update.transform;
      update.card.style.opacity = String(update.opacity);
      update.card.style.zIndex = String(update.zIndex);
    }
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  // Enhanced settle with physics-based easing for smoother motion
  const settle = React.useCallback(
    (target) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));
      velocityRef.current = 0;

      const startPos = posRef.current;
      const distance = target - startPos;
      const startTime = performance.now();
      const duration = Math.min(400, 200 + Math.abs(distance) * 30);

      const step = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / duration);

        const eased = 1 - Math.pow(1 - progress, 3);
        posRef.current = startPos + distance * eased;

        paint();

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          posRef.current = target;
          paint();
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint]
  );

  const clamp = React.useCallback(
    (pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop]
  );

  const goTo = React.useCallback(
    (index) => {
      triggerPause();
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle, triggerPause]
  );

  const nudge = React.useCallback(
    (by) => {
      triggerPause();
      const currentTarget = Math.round(targetRef.current);
      settle(clamp(currentTarget + by));
    },
    [clamp, settle, triggerPause]
  );

  // Improved drag with momentum and smoother tracking
  const onPointerDown = (event) => {
    triggerPause();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    velocityRef.current = 0;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      time: performance.now(),
      prevPos: posRef.current,
      prevTime: performance.now(),
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const dt = Math.max(now - drag.time, 1);
    const newPos = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    
    const instantVelocity = (newPos - posRef.current) / dt * 16;
    velocityRef.current = velocityRef.current * 0.7 + instantVelocity * 0.3;
    
    posRef.current = newPos;
    drag.time = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    triggerPause();
    
    const momentum = Math.max(-3, Math.min(3, velocityRef.current * 0.12));
    const target = Math.round(posRef.current + momentum);
    settle(clamp(target));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  // Auto-play: starts ONLY when section is in view and NOT paused or modal open
  React.useEffect(() => {
    if (!isInView || isPaused || pauseAutoPlay || count <= 1) return undefined;
    const timer = setInterval(() => {
      if (!dragRef.current && rafRef.current === null) {
        const currentTarget = Math.round(targetRef.current);
        const target = loop ? currentTarget + 1 : Math.min(count - 1, currentTarget + 1);
        settle(target);
      }
    }, 3200);
    return () => clearInterval(timer);
  }, [count, isInView, isPaused, pauseAutoPlay, loop, settle]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    },
    []
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card"]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden pt-10 pb-16 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "calc(var(--cf-card) * 1.35)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isSelected = index === selected;
              return (
                <div
                  key={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-950 border border-red-600/30 shadow-2xl will-change-transform flex flex-col justify-between",
                    cardClassName
                  )}
                  style={{ 
                    width: "var(--cf-card)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "translateZ(0)",
                  }}
                >
                  {typeof slide.customContent === "function" ? (
                    slide.customContent({ isSelected, index })
                  ) : slide.customContent ? (
                    slide.customContent
                  ) : (
                    <img
                      src={slide.src}
                      alt={slide.alt || slide.title || ""}
                      draggable={false}
                      className="h-full w-full select-none object-cover object-top"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-2 sm:left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-neutral-950/85 border border-neutral-800 p-2.5 text-white backdrop-blur transition hover:bg-red-600 hover:border-red-600 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-2 sm:right-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-neutral-950/85 border border-neutral-800 p-2.5 text-white backdrop-blur transition hover:bg-red-600 hover:border-red-600 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active && (active.title || active.name) && (
        <div
          key={selected}
          className="mt-6 flex flex-col items-center px-6 duration-300 animate-in fade-in text-center"
        >
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              {active.title || active.name}
            </h3>
            {active.onSelectProfile && (
              <button
                type="button"
                onClick={active.onSelectProfile}
                className="p-1.5 rounded-full text-red-500 hover:text-red-400 hover:scale-110 transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
                title="View Faculty Profile & Supervised Projects"
                aria-label={`View profile of ${active.title || active.name}`}
              >
                <ExternalLink className="size-5 sm:size-6" />
              </button>
            )}
          </div>

          {(active.subtitle || active.designation) && (
            <p className="mt-2 text-sm sm:text-base font-mono font-bold text-red-500 uppercase tracking-widest min-h-[1.5em]">
              <CoverflowTypingText text={active.subtitle || active.designation} />
            </p>
          )}

          {/* Social Icons for LinkedIn & Email */}
          {active.showSocials !== false && (
            <div className="flex items-center gap-2.5 mt-3">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-red-500 hover:border-red-600 transition-all shadow-sm cursor-pointer"
                title="LinkedIn Profile"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-red-500 hover:border-red-600 transition-all shadow-sm cursor-pointer"
                title="Email Address"
                aria-label="Email Address"
              >
                <Mail className="size-4" />
              </a>
            </div>
          )}

          {active.meta && active.meta.length > 0 && (
            <dl className="mt-3.5 w-full max-w-[260px] text-xs sm:text-sm">
              {active.meta.map((row) => (
                <div key={row.label} className="flex justify-between py-1 border-b border-white/10">
                  <dt className="text-neutral-400 font-mono">{row.label}</dt>
                  <dd className="font-semibold text-white">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-5 flex items-center justify-center">
          <div aria-live="polite" className="font-mono text-xs font-bold tracking-wider text-neutral-400 bg-neutral-950/90 border border-red-600/30 px-4 py-1.5 rounded-full shadow-lg tabular-nums flex items-center gap-1 backdrop-blur-md">
            <span className="sr-only">Carousel position: </span>
            <span className="text-white font-extrabold">{String(selected + 1).padStart(2, '0')}</span>
            <span className="text-red-500 font-sans font-normal mx-0.5">/</span>
            <span className="text-neutral-500 font-medium">{String(count).padStart(2, '0')}</span>
          </div>
        </div>
      )}
    </div>
  );
}