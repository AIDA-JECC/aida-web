"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, ExternalLink } from "lucide-react";
import LinkedinIcon from "./LinkedinIcon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the type for a single review / team / faculty member
export type Review = {
  id: string | number;
  name: string;
  affiliation: string;
  quote?: string;
  imageSrc: string;
  thumbnailSrc: string;
  email?: string;
  linkedin?: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

// Define the props for the slider component
export interface TestimonialSliderProps {
  reviews: Review[];
  /** Optional class name for the container */
  className?: string;
  /** Optional initial index */
  initialIndex?: number;
  /** Autoplay interval in milliseconds (default 5000ms) */
  autoplayInterval?: number;
  /** Reverse layout for Faculty section: details on left, upcoming cards on right */
  reverseLayout?: boolean;
}

/**
 * Animated Typewriter effect component for text rendering
 */
const TypewriterText = ({
  text,
  speed = 18,
  className = "",
  showCursor = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && isTyping && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-5 ml-1 bg-red-500 align-middle rounded-sm"
        />
      )}
    </span>
  );
};

/**
 * Core Team & Faculty Testimonial Slider component with transparent background,
 * red highlighted names, live typing effect, LinkedIn & Email links, optional action profile button,
 * 5-second automatic carousel (working on mobile too), and flexible layout order.
 */
export const TestimonialSlider = ({
  reviews,
  className,
  initialIndex = 0,
  autoplayInterval = 5000,
  reverseLayout = false,
}: TestimonialSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // IntersectionObserver with low threshold (0.01) so mobile & desktop start autoplay as soon as section is reached
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
            setCurrentIndex(initialIndex);
          }
        });
      },
      { threshold: 0.01, rootMargin: "50px 0px 50px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [initialIndex]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const activeReview = reviews[currentIndex];

  const handleNext = useCallback(() => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const handlePrev = useCallback(() => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Autoplay carousel timer: runs automatically on mobile & desktop when section is in viewport
  useEffect(() => {
    if (!isInView || isPaused || reviews.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [isInView, isPaused, reviews.length, autoplayInterval, handleNext]);

  // Get the next 5 reviews for thumbnails in order, wrapping around the reviews array
  const thumbnailCount = Math.min(5, reviews.length);
  const thumbnailReviews = Array.from({ length: thumbnailCount }, (_, offset) => {
    const targetIndex = (currentIndex + 1 + offset) % reviews.length;
    return {
      review: reviews[targetIndex],
      originalIndex: targetIndex,
    };
  });

  // Animation variants for the main image
  const imageVariants = {
    enter: (direction: "left" | "right") => ({
      y: direction === "right" ? "60%" : "-60%",
      opacity: 0,
      scale: 0.95,
    }),
    center: { y: 0, opacity: 1, scale: 1 },
    exit: (direction: "left" | "right") => ({
      y: direction === "right" ? "-60%" : "60%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative w-full overflow-hidden bg-transparent text-foreground p-0 sm:p-2 md:p-4",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center h-full">
        {/* === Upcoming Cards Column (Left on Core Team, Right on Faculty) === */}
        <div
          className={cn(
            "md:col-span-4 flex flex-col justify-between gap-3 md:gap-4",
            reverseLayout ? "order-2 md:order-3" : "order-2 md:order-1"
          )}
        >
          {/* Header line with Counter and Minimal Mobile Navigation Arrows */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 md:pb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase bg-neutral-900/80 px-3 py-1 rounded-full border border-white/10">
              {String(currentIndex + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
            </span>

            {/* Inline Minimal Arrows for Mobile View */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full border border-neutral-700 bg-neutral-900/90 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-colors active:scale-95 cursor-pointer"
                aria-label="Previous member"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-red-600 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors active:scale-95 cursor-pointer shadow-md shadow-red-950/40"
                aria-label="Next member"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid of 4 images in 1 row on mobile, 5 vertical rows on desktop */}
          <div className="grid grid-cols-4 md:flex md:flex-col gap-2 md:gap-2.5">
            {thumbnailReviews.map(({ review, originalIndex }, idx) => (
              <button
                key={review.id}
                onClick={() => handleThumbnailClick(originalIndex)}
                className={cn(
                  "group relative flex flex-col md:flex-row items-center gap-1.5 md:gap-3.5 p-1.5 md:p-2.5 rounded-xl md:rounded-2xl border transition-all duration-300 text-left overflow-hidden cursor-pointer",
                  idx >= 4 ? "hidden md:flex" : "flex",
                  originalIndex === currentIndex
                    ? "border-red-500/80 bg-red-950/40 shadow-lg shadow-red-950/50 ring-1 ring-red-500/50"
                    : "border-white/10 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-red-500/40"
                )}
                aria-label={`View ${review.name}`}
              >
                {/* Thumbnail Image */}
                <div className="relative w-full aspect-[4/5] md:w-12 md:h-14 rounded-lg md:rounded-xl overflow-hidden shrink-0 border border-white/10 bg-neutral-950">
                  <img
                    src={review.thumbnailSrc}
                    alt={review.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Member details */}
                <div className="min-w-0 flex-1 w-full text-center md:text-left">
                  <p className="text-[10px] md:text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                    {review.name}
                  </p>
                  <p className="text-[9px] md:text-[10px] font-mono text-neutral-400 truncate mt-0.5 hidden md:block">
                    {review.affiliation}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* === Center Column: Main Image === */}
        <div className="md:col-span-4 relative aspect-[2/3] md:aspect-auto w-full h-auto md:h-80 min-h-0 md:min-h-[460px] order-1 md:order-2 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/50 shadow-2xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={activeReview.imageSrc}
              alt={activeReview.name}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none rounded-2xl" />
        </div>

        {/* === Details & Content Column (Right on Core Team, Left on Faculty) === */}
        <div
          className={cn(
            "md:col-span-4 flex flex-col justify-between min-h-[300px] md:min-h-[440px]",
            reverseLayout ? "order-3 md:order-1 md:pr-4" : "order-3 md:order-3 md:pl-4"
          )}
        >
          {/* Text Content with Typing Animation */}
          <div className="relative overflow-hidden pt-2 min-h-[220px] md:min-h-[260px]">
            <AnimatePresence mode="wait">
              <div key={currentIndex} className="flex flex-col gap-2">
                {/* Affiliation with Typing Animation */}
                <p className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
                  <TypewriterText text={activeReview.affiliation} speed={25} showCursor={false} />
                </p>

                {/* Name written in RED with Typing Animation */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-500 tracking-tight mt-1">
                  <TypewriterText text={activeReview.name} speed={30} showCursor={false} />
                </h3>

                {/* Quote / Description with Live Typing Animation (if present) */}
                {activeReview.quote && (
                  <blockquote className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg font-medium leading-relaxed text-neutral-200 border-l-2 border-red-500/60 pl-3 md:pl-4 py-1 italic">
                    "<TypewriterText text={activeReview.quote} speed={15} showCursor={true} />"
                  </blockquote>
                )}

                {/* Action Profile Navigation Button (e.g. View Profile & Supervised Projects) */}
                {activeReview.onActionClick && (
                  <div className="mt-3">
                    <button
                      onClick={activeReview.onActionClick}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-red-950/50 cursor-pointer active:scale-95 group"
                    >
                      <span>{activeReview.actionLabel || "View Profile & Projects"}</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}

                {/* LinkedIn and Mail ID section */}
                <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-5 pt-3 md:pt-4 border-t border-white/10">
                  {activeReview.email && (
                    <a
                      href={`mailto:${activeReview.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl bg-neutral-900/80 hover:bg-red-600/20 border border-neutral-700/60 hover:border-red-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title={`Send email to ${activeReview.name}`}
                    >
                      <Mail className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                      <span className="truncate max-w-[140px] sm:max-w-[200px]">{activeReview.email}</span>
                    </a>
                  )}
                  {activeReview.linkedin && (
                    <a
                      href={activeReview.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl bg-neutral-900/80 hover:bg-blue-600/20 border border-neutral-700/60 hover:border-blue-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title={`${activeReview.name}'s LinkedIn Profile`}
                    >
                      <LinkedinIcon size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center space-x-3 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 md:w-12 md:h-12 border-neutral-700 bg-neutral-900/80 text-white hover:bg-red-600 hover:border-red-600 transition-colors cursor-pointer"
              onClick={handlePrev}
              aria-label="Previous member"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-950/50 cursor-pointer"
              onClick={handleNext}
              aria-label="Next member"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
