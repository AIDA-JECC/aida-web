import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Trophy, Rocket, Users, ArrowRight, ArrowUpRight, Layers } from 'lucide-react';

const pillars = [
  {
    id: 1,
    num: "01",
    tag: "SERVICES PROVIDED",
    title: "Services We Provide",
    desc: "Cutting-edge AI research, hands-on training, and innovative solutions tailored to empower the next generation.",
    icon: Briefcase,
    accentColor: "text-red-500",
    numColor: "text-red-500",
    badgeBg: "bg-red-950/80 border border-red-600/60 text-red-400",
    lineBg: "bg-red-600",
    bgStyle: "bg-gradient-to-b from-[#320606] via-[#1f0303] to-[#0e0101] border border-red-600/70 text-white",
    dotColor: "#ef4444",
    btnText: "What We Do",
    btnIcon: ArrowRight,
    btnStyle: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    targetSection: "about",
  },
  {
    id: 2,
    num: "02",
    tag: "NATIONAL HACKATHONS",
    title: "Competitive Hackathons",
    desc: "Begin with NEOPHYTE, then build further through TINK-HER-HACK team challenges and mentorship.",
    icon: Trophy,
    accentColor: "text-neutral-400",
    numColor: "text-white",
    badgeBg: "bg-neutral-900/90 border border-neutral-700 text-neutral-200",
    lineBg: "bg-white",
    bgStyle: "bg-gradient-to-b from-[#18181b] via-[#111113] to-[#09090b] border border-neutral-800 text-white",
    dotColor: "#e5e5e5",
    btnText: "Join the Challenge",
    btnIcon: ArrowRight,
    btnStyle: "bg-white hover:bg-neutral-100 text-neutral-950 shadow-sm",
    targetSection: "events",
  },
  {
    id: 3,
    num: "03",
    tag: "SKILL BOOTCAMPS",
    title: "Industry Skill Bootcamps",
    desc: "Explore Web3, blockchain, AI and the metaverse, and cybersecurity through documented hands-on sessions.",
    icon: Rocket,
    accentColor: "text-red-500",
    numColor: "text-red-500",
    badgeBg: "bg-red-950/60 border border-red-600/60 text-red-500",
    lineBg: "bg-red-600",
    bgStyle: "bg-gradient-to-b from-[#18181b] via-[#111113] to-[#09090b] border border-neutral-800 text-white relative overflow-hidden",
    dotColor: "#ef4444",
    hasRedWave: true,
    btnText: "Level Up",
    btnIcon: ArrowUpRight,
    btnStyle: "bg-[#ef4444] hover:bg-red-600 text-white shadow-sm",
    targetSection: "events",
  },
  {
    id: 4,
    num: "04",
    tag: "PLACEMENTS & INTERNSHIPS",
    title: "Placements & Internships",
    desc: "Connecting talent with top opportunities through strong industry partnerships and career support.",
    icon: Users,
    accentColor: "text-neutral-700",
    numColor: "text-neutral-950",
    badgeBg: "bg-white border border-neutral-300 text-neutral-900 shadow-sm",
    lineBg: "bg-red-600",
    bgStyle: "bg-[#f8f8f6] text-neutral-900 border border-neutral-300",
    dotColor: "#ef4444",
    btnText: "Start Your Journey",
    btnIcon: ArrowRight,
    btnStyle: "bg-[#18181b] hover:bg-black text-white shadow-sm",
    targetSection: "verify",
  }
];

export default function TiltedCards() {
  const [activeStep, setActiveStep] = useState(1);
  const cardRefs = useRef([]);
  const mobileScrollRef = useRef(null);

  // Sync active step button when user swipes horizontally on mobile
  const handleMobileScroll = () => {
    const container = mobileScrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    
    // Find closest card to viewport center
    let closestIndex = 1;
    let minDistance = Infinity;
    const viewportCenter = scrollLeft + containerWidth / 2;

    cardRefs.current.slice(0, 4).forEach((card, idx) => {
      if (card) {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(viewportCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx + 1;
        }
      }
    });

    setActiveStep(closestIndex);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
    const targetCard = cardRefs.current[step - 1];
    const container = mobileScrollRef.current;
    
    if (targetCard && container && window.innerWidth < 768) {
      const containerWidth = container.clientWidth;
      const cardLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.clientWidth;
      const scrollToLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);

      container.scrollTo({
        left: scrollToLeft,
        behavior: 'smooth',
      });
    } else if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  const handleActionClick = (e, targetSection) => {
    e.stopPropagation();
    const elem = document.getElementById(targetSection);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="pillars"
      className="relative bg-neutral-950 py-16 sm:py-24 flex flex-col justify-center items-center overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-xs tracking-widest uppercase mb-1">
            <Layers size={14} className="text-red-500 animate-pulse" />
            <span>• OUR CORE PILLARS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-center text-white tracking-tight leading-tight">
            Pioneering Data &amp; <span className="text-red-600 italic">Intelligence</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm md:text-base font-sans max-w-2xl mx-auto">
            Four foundational pillars driving innovation, research, hackathons, industry bootcamps, and career success.
          </p>
        </div>

        {/* Top Rounded Pill Navigation Bar (Matching exact Crimson Red active button from screenshot) */}
        <div className="flex items-center gap-3 bg-[#111113]/95 border border-neutral-800 px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-xl z-30">
          <div className="flex items-center gap-2 px-1">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => handleStepClick(step)}
                className={`w-9 h-9 rounded-full font-mono text-xs font-bold transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  step === activeStep
                    ? 'bg-red-600 text-white shadow-[0_0_18px_rgba(220,38,38,0.7)] scale-105 font-extrabold ring-2 ring-red-500/40'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
                aria-label={`Select pillar card ${step}`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid & Mobile Smooth Carousel Container with Equal Spacing */}
        <div className="w-full">
          {/* Mobile Horizontal Snap View (< 768px) Controlled by Buttons 1, 2, 3, 4 */}
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="md:hidden flex overflow-x-auto snap-x snap-mandatory space-x-5 py-4 px-4 scrollbar-none w-full scroll-smooth"
          >
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const BtnIcon = pillar.btnIcon;
              const isActive = idx + 1 === activeStep;

              return (
                <div
                  key={pillar.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  onClick={() => handleStepClick(idx + 1)}
                  className={`relative overflow-hidden snap-center shrink-0 w-[88vw] max-w-[330px] rounded-[1.75rem] p-6 sm:p-7 flex flex-col justify-between select-none cursor-pointer transition-all duration-300 ${
                    isActive ? 'ring-2 ring-red-600/80 shadow-lg scale-[1.01]' : 'opacity-90'
                  } ${pillar.bgStyle}`}
                >
                  {/* Top Header Row: Tag & Icon Badge */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className={`font-mono text-[11px] font-bold tracking-widest uppercase ${pillar.accentColor}`}>
                        {pillar.tag}
                      </span>
                      <div className={`p-2.5 rounded-2xl ${pillar.badgeBg} backdrop-blur-md shrink-0`}>
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Giant Number */}
                    <div className={`font-mono text-6xl font-extrabold leading-none tracking-tight ${pillar.numColor}`}>
                      {pillar.num}
                    </div>
                  </div>

                  {/* Bottom Content: Title, Underline Bar, Description & Action Button */}
                  <div className="relative z-10 space-y-3.5 mt-5">
                    <h3 className="font-sans font-extrabold text-xl tracking-tight leading-snug">
                      {pillar.title}
                    </h3>

                    <div className={`w-10 h-1 rounded-full ${pillar.lineBg}`} />

                    <p className="text-xs leading-relaxed opacity-85 font-sans font-normal">
                      {pillar.desc}
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={(e) => handleActionClick(e, pillar.targetSection)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 ${pillar.btnStyle}`}
                      >
                        <span>{pillar.btnText}</span>
                        <BtnIcon size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {pillar.hasRedWave && (
                    <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-red-600/35 via-red-900/10 to-transparent pointer-events-none z-0" />
                  )}

                  {/* Dot Matrix Decorative SVG Pattern */}
                  <svg className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-25 z-0" viewBox="0 0 100 100" fill="none">
                    <pattern id={`dots-mobile-${pillar.num}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                      <circle cx="3.5" cy="3.5" r="1.6" fill={pillar.dotColor} />
                    </pattern>
                    <rect width="100" height="100" fill={`url(#dots-mobile-${pillar.num})`} />
                  </svg>
                </div>
              );
            })}
          </div>

          {/* Desktop Standard 4-Column Grid (≥ 768px) with Equal Spacing */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-7xl mx-auto items-stretch">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const BtnIcon = pillar.btnIcon;
              const isActive = idx + 1 === activeStep;

              return (
                <motion.div
                  key={pillar.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => setActiveStep(idx + 1)}
                  className={`
                    relative overflow-hidden w-full h-full min-h-[420px] rounded-[1.75rem] p-6 sm:p-7 flex flex-col justify-between select-none cursor-pointer
                    transition-all duration-300 group hover:-translate-y-1.5
                    ${isActive ? 'ring-2 ring-red-600/70 shadow-lg' : ''}
                    ${pillar.bgStyle}
                  `}
                >
                  {/* Top Header Row: Tag & Icon Badge */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <span className={`font-mono text-[11px] font-bold tracking-widest uppercase ${pillar.accentColor}`}>
                        {pillar.tag}
                      </span>
                      <div className={`p-2.5 rounded-2xl ${pillar.badgeBg} backdrop-blur-md group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Giant Number */}
                    <div className={`font-mono text-6xl sm:text-7xl font-extrabold leading-none tracking-tight ${pillar.numColor}`}>
                      {pillar.num}
                    </div>
                  </div>

                  {/* Bottom Content: Title, Underline Bar, Description & Action Button */}
                  <div className="relative z-10 space-y-4 mt-4">
                    <h3 className="font-sans font-extrabold text-xl sm:text-2xl tracking-tight leading-snug">
                      {pillar.title}
                    </h3>

                    {/* Accent Underline Bar */}
                    <div className={`w-10 h-1 rounded-full ${pillar.lineBg}`} />

                    <p className="text-xs sm:text-sm leading-relaxed opacity-85 font-sans font-normal">
                      {pillar.desc}
                    </p>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={(e) => handleActionClick(e, pillar.targetSection)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 ${pillar.btnStyle}`}
                      >
                        <span>{pillar.btnText}</span>
                        <BtnIcon size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Subdued Red Wave Graphic Overlay for Card 03 */}
                  {pillar.hasRedWave && (
                    <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-red-600/35 via-red-900/10 to-transparent pointer-events-none z-0" />
                  )}

                  {/* Bottom-Right Subdued Dot Matrix Decorative SVG Pattern */}
                  <svg className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-25 z-0" viewBox="0 0 100 100" fill="none">
                    <pattern id={`dots-standard-${pillar.num}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                      <circle cx="3.5" cy="3.5" r="1.6" fill={pillar.dotColor} />
                    </pattern>
                    <rect width="100" height="100" fill={`url(#dots-standard-${pillar.num})`} />
                  </svg>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
