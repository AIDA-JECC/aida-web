import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";
import SafeImage from "./SafeImage";
import { Eye, Trophy, Calendar, GraduationCap, User, Hash } from "lucide-react";
import { getLevelBadge } from "../achievements/AchievementCard";

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
  onSeeMore,
  onSelectAchievement,
  isModalOpen = false,
}) => {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDelayPaused, setIsDelayPaused] = useState(false);
  const delayTimeoutRef = useRef(null);

  // Trigger 3-second pause before resuming autoplay after interactions
  const trigger3SecPause = () => {
    setIsDelayPaused(true);
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    delayTimeoutRef.current = setTimeout(() => {
      setIsDelayPaused(false);
    }, 3000);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
    trigger3SecPause();
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    trigger3SecPause();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    trigger3SecPause();
  };

  const isActive = (index) => {
    return index === active;
  };

  // Autoplay control with pause on hover, button click, or modal open + 3s resume delay
  useEffect(() => {
    if (!autoplay || isHovered || isDelayPaused || isModalOpen) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplay, isHovered, isDelayPaused, isModalOpen, testimonials.length]);

  // When modal closes, trigger 3s pause before resuming autoplay
  useEffect(() => {
    if (!isModalOpen) {
      trigger3SecPause();
    }
  }, [isModalOpen]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 11) - 5;
  };

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[active] || testimonials[0];
  const badge = getLevelBadge(current.level || current.designation);
  const BadgeIcon = badge.icon || Trophy;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn("max-w-sm md:max-w-5xl lg:max-w-6xl mx-auto px-4 md:px-8 py-6", className)}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
        {/* Certificate Image Stack */}
        <div className="relative h-[320px] sm:h-[380px] md:h-[420px] w-full">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={(testimonial.image || testimonial.src || '') + index}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.4,
                  scale: isActive(index) ? 1 : 0.92,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index)
                    ? 99
                    : testimonials.length + 2 - index,
                  y: isActive(index) ? 0 : 10,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom cursor-pointer"
                onClick={() => {
                  trigger3SecPause();
                  if (onSelectAchievement) onSelectAchievement(testimonial);
                }}
              >
                <div className="relative h-full w-full rounded-3xl overflow-hidden border border-neutral-800/80 shadow-2xl group bg-neutral-950">
                  <SafeImage
                    src={testimonial.image || testimonial.src}
                    alt={testimonial.title || testimonial.name}
                    title={testimonial.title || testimonial.name}
                    category={testimonial.tag || testimonial.designation || 'ACHIEVEMENT'}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge Overlay */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold shadow-lg backdrop-blur-md ${badge.color}`}>
                      <BadgeIcon size={14} />
                      <span>{badge.text}</span>
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Content & Navigation Details */}
        <div className="flex justify-between flex-col space-y-6 py-2">
          <motion.div
            key={active}
            initial={{
              y: 15,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -15,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="space-y-4"
          >
            {/* Tag / Category Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
                {current.tag || 'ACHIEVEMENT'}
              </span>
              {current.semester && (
                <span className="text-neutral-500 font-mono text-xs">
                  • {current.semester}
                </span>
              )}
            </div>

            {/* Achievement Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif leading-tight">
              {current.title || current.name}
            </h3>

            {/* Fixed Height Description Area with Smooth Scrollbar */}
            <div className="h-28 max-h-28 overflow-y-auto custom-scrollbar bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/60 pr-3">
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {current.description || current.quote || 'Outstanding performance and recognition achieved by student.'}
              </p>
            </div>

            {/* Student & Metadata Info */}
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="flex items-center gap-2 bg-neutral-900/70 border border-neutral-800 p-2.5 rounded-xl">
                <User size={14} className="text-red-500 shrink-0" />
                <div className="truncate">
                  <span className="text-neutral-400 text-[10px] block">STUDENT</span>
                  <span className="text-white font-semibold uppercase truncate block">{current.studentName || current.name}</span>
                </div>
              </div>

              {current.registerNumber && (
                <div className="flex items-center gap-2 bg-neutral-900/70 border border-neutral-800 p-2.5 rounded-xl">
                  <Hash size={14} className="text-red-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-neutral-400 text-[10px] block">REG NO</span>
                    <span className="text-white font-semibold truncate block">{current.registerNumber}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation Controls Bar with SEE MORE Button directly between Left & Right Arrows */}
          <div className="flex items-center gap-4 pt-4 border-t border-neutral-800/80">
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="h-11 w-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group/button hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-lg shrink-0"
              aria-label="Previous Achievement"
            >
              <IconArrowLeft className="h-5 w-5 text-white group-hover/button:-translate-x-0.5 transition-transform duration-300" />
            </button>

            {/* Prominent SEE MORE Button between Left and Right Arrows */}
            <button
              type="button"
              onClick={() => {
                trigger3SecPause();
                if (onSeeMore) onSeeMore();
                else window.location.hash = '#/achievements';
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex-1 sm:flex-initial"
            >
              <Eye size={16} />
              <span>SEE MORE</span>
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={handleNext}
              className="h-11 w-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group/button hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-lg shrink-0"
              aria-label="Next Achievement"
            >
              <IconArrowRight className="h-5 w-5 text-white group-hover/button:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
