"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, ExternalLink, Phone, GraduationCap, Globe, Award, UserCheck, Hash } from "lucide-react";
import LinkedinIcon from "./LinkedinIcon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the type for a single review / team / faculty member
export type Review = {
  id: string | number;
  name: string;
  affiliation: string;
  quote?: string | null;
  imageSrc: string;
  thumbnailSrc: string;
  email?: string | null;
  phone?: string | null;
  about?: string | null;
  linkedin?: string | null;
  googleScholar?: string | null;
  scopus?: string | null;
  orcid?: string | null;
  vidwan?: string | null;
  employeeId?: string | null;
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
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pause timer for 2 seconds after manual user click before resuming autoplay
  const triggerUserPause = useCallback(() => {
    setIsInteractionPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsInteractionPaused(false);
    }, 2000);
  }, []);

  // IntersectionObserver detects when carousel enters viewport to activate autoplay once
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
          }
        });
      },
      { threshold: 0.05, rootMargin: "100px 0px 100px 0px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

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

  const handleNextWithPause = () => {
    triggerUserPause();
    handleNext();
  };

  const handlePrevWithPause = () => {
    triggerUserPause();
    handlePrev();
  };

  const handleThumbnailClick = (index: number) => {
    triggerUserPause();
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Autoplay carousel timer: advances every 5 seconds (5000ms) continuously once section is reached
  useEffect(() => {
    if (!hasEnteredView || isInteractionPaused || reviews.length <= 1) return;

    const timer = setTimeout(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearTimeout(timer);
  }, [currentIndex, hasEnteredView, isInteractionPaused, reviews.length, autoplayInterval, handleNext]);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full overflow-hidden bg-transparent text-foreground p-0 sm:p-2 md:p-4",
        className
      )}
    >
      {/* ========================================================================= */}
      {/* ========================= MOBILE VIEW (< md) ============================ */}
      {/* ========================================================================= */}
      <div className="block md:hidden w-full space-y-4">
        {/* Top Header Controls: Prev Arrow (Left) | Counter (Center) | Next Arrow (Right) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <button
            onClick={handlePrevWithPause}
            className="w-10 h-10 rounded-full border border-neutral-700 bg-neutral-900/90 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-colors active:scale-95 cursor-pointer shadow-md"
            aria-label="Previous member"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase bg-neutral-900/80 px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
            {String(currentIndex + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
          </span>

          <button
            onClick={handleNextWithPause}
            className="w-10 h-10 rounded-full border border-red-600 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors active:scale-95 cursor-pointer shadow-md shadow-red-950/50"
            aria-label="Next member"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top Split Row: Main Photo (~75% Width) + Vertical Image Thumbnails Rail (~25% Width) */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {/* Main Photo Container */}
          <div className="flex-1 min-w-0">
            <div className="relative aspect-[4/5] w-full max-w-[250px] mx-auto rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
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
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
            </div>
          </div>

          {/* Vertical Image Thumbnail Sidebar */}
          <div className="w-14 sm:w-16 shrink-0 border-l border-white/10 pl-2.5 space-y-2.5 flex flex-col items-center">
            {thumbnailReviews.map(({ review, originalIndex }) => (
              <button
                key={review.id}
                onClick={() => handleThumbnailClick(originalIndex)}
                className={cn(
                  "relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer shrink-0",
                  originalIndex === currentIndex
                    ? "border-red-500 ring-2 ring-red-500/60 bg-red-950/40 shadow-lg shadow-red-950/50 scale-105"
                    : "border-white/10 bg-neutral-950 hover:border-red-500/40 opacity-70 hover:opacity-100"
                )}
                aria-label={`View ${review.name}`}
              >
                <img
                  src={review.thumbnailSrc}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Details Container — SPANS 100% FULL WIDTH (No Blank Spaces) */}
        <div className="w-full space-y-3 pt-2">
          {/* Member Name & Designation Pill */}
          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 tracking-tight leading-tight">
              <TypewriterText text={activeReview.name} speed={25} showCursor={false} />
            </h3>

            <p className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase mt-1">
              {activeReview.affiliation}
            </p>
          </div>

          {/* Optional Quote / Bio */}
          {activeReview.quote && (
            <blockquote className="text-xs font-medium leading-relaxed text-neutral-300 border-l-2 border-red-500/60 pl-3 py-1.5 italic bg-neutral-900/40 rounded-r-xl">
              "{activeReview.quote}"
            </blockquote>
          )}

          {/* Full-Width Contact Information Cards */}
          <div className="grid grid-cols-1 gap-2 pt-1 font-mono text-xs">
            {activeReview.email && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
                <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-red-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-sans">Email</p>
                  <a href={`mailto:${activeReview.email}`} className="text-neutral-200 hover:text-white truncate block font-bold">
                    {activeReview.email}
                  </a>
                </div>
              </div>
            )}

            {activeReview.phone && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
                <div className="w-8 h-8 rounded-lg bg-green-950/60 border border-green-800/50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-sans">Phone</p>
                  <a href={`tel:${activeReview.phone}`} className="text-neutral-200 hover:text-white block font-bold">
                    {activeReview.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Full-Width Social & Profile Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeReview.linkedin && (
              <a href={activeReview.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors">
                <LinkedinIcon size={14} className="text-blue-400" /> <span>LinkedIn</span>
              </a>
            )}
            {activeReview.googleScholar && (
              <a href={activeReview.googleScholar} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors">
                <GraduationCap size={14} className="text-emerald-400" /> <span>Scholar</span>
              </a>
            )}
            {activeReview.scopus && (
              <a href={activeReview.scopus} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors">
                <Globe size={14} className="text-orange-400" /> <span>Scopus</span>
              </a>
            )}
            {activeReview.orcid && (
              <a href={activeReview.orcid} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors">
                <Award size={14} className="text-green-400" /> <span>ORCID</span>
              </a>
            )}
            {activeReview.vidwan && (
              <a href={activeReview.vidwan} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors">
                <UserCheck size={14} className="text-purple-400" /> <span>Vidwan</span>
              </a>
            )}
          </div>

          {/* Full-Width Action Profile Navigation Button */}
          {activeReview.onActionClick && (
            <div className="pt-2">
              <button
                onClick={activeReview.onActionClick}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
              >
                <span>{activeReview.actionLabel || "View Profile & Projects"}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ========================= DESKTOP VIEW (≥ md) =========================== */}
      {/* ============ UNTOUCHED & 100% PRESERVED FOR PC & TABLET ================ */}
      {/* ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 md:gap-8 items-center h-full">
        {/* === Upcoming Cards Column (Left on Core Team, Right on Faculty) === */}
        <div
          className={cn(
            "md:col-span-4 flex flex-col justify-between gap-3 md:gap-4",
            reverseLayout ? "order-2 md:order-3" : "order-2 md:order-1"
          )}
        >
          {/* Header line with Counter */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 md:pb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase bg-neutral-900/80 px-3 py-1 rounded-full border border-white/10">
              {String(currentIndex + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
            </span>
          </div>

          {/* 5 vertical cards with names on desktop */}
          <div className="flex flex-col gap-2.5">
            {thumbnailReviews.map(({ review, originalIndex }) => (
              <button
                key={review.id}
                onClick={() => handleThumbnailClick(originalIndex)}
                className={cn(
                  "group relative flex flex-row items-center gap-3.5 p-2.5 rounded-2xl border transition-all duration-300 text-left overflow-hidden cursor-pointer",
                  originalIndex === currentIndex
                    ? "border-red-500/80 bg-red-950/40 shadow-lg shadow-red-950/50 ring-1 ring-red-500/50"
                    : "border-white/10 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-red-500/40"
                )}
                aria-label={`View ${review.name}`}
              >
                {/* Thumbnail Image */}
                <div className="relative w-12 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-neutral-950">
                  <img
                    src={review.thumbnailSrc}
                    alt={review.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Member details */}
                <div className="min-w-0 flex-1 w-full text-left">
                  <p className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                    {review.name}
                  </p>
                  <p className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">
                    {review.affiliation}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* === Center Column: Main Image === */}
        <div className="md:col-span-4 relative aspect-auto w-full h-80 min-h-[460px] order-2 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/50 shadow-2xl">
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
            "md:col-span-4 flex flex-col justify-between min-h-[360px] order-3",
            reverseLayout ? "md:order-1 md:pr-4" : "md:order-3 md:pl-4"
          )}
        >
          {/* Text Content with Typing Animation */}
          <div className="relative overflow-hidden pt-2 min-h-[180px]">
            <AnimatePresence mode="wait">
              <div key={currentIndex} className="flex flex-col gap-2">
                {/* Affiliation with Typing Animation */}
                <p className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
                  <TypewriterText text={activeReview.affiliation} speed={25} showCursor={false} />
                </p>

                {/* Name written in RED with Typing Animation */}
                <h3 className="text-3xl md:text-4xl font-extrabold text-red-500 tracking-tight mt-1">
                  <TypewriterText text={activeReview.name} speed={30} showCursor={false} />
                </h3>

                {/* Quote / Description with Live Typing Animation (if present) */}
                {activeReview.quote && (
                  <blockquote className="mt-4 text-base md:text-lg font-medium leading-relaxed text-neutral-200 border-l-2 border-red-500/60 pl-4 py-1 italic">
                    "<TypewriterText text={activeReview.quote} speed={15} showCursor={true} />"
                  </blockquote>
                )}

                {/* Action Profile Navigation Button */}
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

                {/* All Non-Null Faculty Metadata Links & Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/10">
                  {activeReview.email && (
                    <a
                      href={`mailto:${activeReview.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-red-600/20 border border-neutral-700/60 hover:border-red-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title={`Email: ${activeReview.email}`}
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                      <span className="truncate max-w-[190px]">{activeReview.email}</span>
                    </a>
                  )}
                  {activeReview.phone && (
                    <a
                      href={`tel:${activeReview.phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-green-600/20 border border-neutral-700/60 hover:border-green-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title={`Phone: ${activeReview.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-green-500 group-hover:scale-110 transition-transform" />
                      <span>{activeReview.phone}</span>
                    </a>
                  )}
                  {activeReview.employeeId && (
                    <span
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-700/60 text-neutral-300 text-xs font-mono"
                      title={`Employee ID: ${activeReview.employeeId}`}
                    >
                      <Hash className="w-3.5 h-3.5 text-amber-500" />
                      <span>ID: {activeReview.employeeId}</span>
                    </span>
                  )}
                  {activeReview.linkedin && (
                    <a
                      href={activeReview.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-blue-600/20 border border-neutral-700/60 hover:border-blue-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {activeReview.googleScholar && (
                    <a
                      href={activeReview.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-emerald-600/20 border border-neutral-700/60 hover:border-emerald-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title="Google Scholar Profile"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>Scholar</span>
                    </a>
                  )}
                  {activeReview.scopus && (
                    <a
                      href={activeReview.scopus}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-orange-600/20 border border-neutral-700/60 hover:border-orange-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title="Scopus Profile"
                    >
                      <Globe className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                      <span>Scopus</span>
                    </a>
                  )}
                  {activeReview.orcid && (
                    <a
                      href={activeReview.orcid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-green-600/20 border border-neutral-700/60 hover:border-green-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title="ORCID Profile"
                    >
                      <Award className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform" />
                      <span>ORCID</span>
                    </a>
                  )}
                  {activeReview.vidwan && (
                    <a
                      href={activeReview.vidwan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-purple-600/20 border border-neutral-700/60 hover:border-purple-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono group"
                      title="Vidwan Profile"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                      <span>Vidwan</span>
                    </a>
                  )}
                </div>
              </div>
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 md:w-12 md:h-12 border-neutral-700 bg-neutral-900/80 text-white hover:bg-red-600 hover:border-red-600 transition-colors cursor-pointer"
              onClick={handlePrevWithPause}
              aria-label="Previous member"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-950/50 cursor-pointer"
              onClick={handleNextWithPause}
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
