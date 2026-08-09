import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Trophy, Rocket, Scale, Layers, ArrowRight } from 'lucide-react';

const pillars = [
  {
    num: "01",
    tag: "HANDS-ON LABS",
    title: "Hands-on AI Research",
    desc: "Jump right into deep learning, computer vision, and GPU-accelerated PyTorch labs.",
    icon: Cpu,
    bgStyle: "bg-gradient-to-br from-red-600 via-red-700 to-red-950 text-white border border-red-500/50 shadow-2xl",
    stackedRotate: -5,
    stackedX: -14,
    stackedY: -16,
    stackedScale: 0.93,
    zIndex: 10,
    accentColor: "text-red-300"
  },
  {
    num: "02",
    tag: "NATIONAL HACKATHONS",
    title: "Competitive Hackathons",
    desc: "Begin with NEOPHYTE, then build further through TINK-HER-HACK team challenges and mentorship.",
    icon: Trophy,
    bgStyle: "bg-white/8 backdrop-blur-xl border border-white/10 text-white shadow-2xl ring-1 ring-inset ring-white/5",
    stackedRotate: 4,
    stackedX: 10,
    stackedY: -6,
    stackedScale: 0.95,
    zIndex: 20,
    accentColor: "text-red-400"
  },
  {
    num: "03",
    tag: "SKILL BOOTCAMPS",
    title: "Industry Skill Bootcamps",
    desc: "Explore Web3, blockchain, AI and the metaverse, and cybersecurity through documented hands-on sessions.",
    icon: Rocket,
    bgStyle: "bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl ring-1 ring-inset ring-white/5",
    stackedRotate: -3,
    stackedX: -8,
    stackedY: 4,
    stackedScale: 0.98,
    zIndex: 30,
    accentColor: "text-neutral-300"
  },
  {
    num: "04",
    tag: "ETHICAL LEADERSHIP",
    title: "Ethical Governance",
    desc: "Focusing on responsible AI development, bias mitigation, data privacy, and KTU credits.",
    icon: Scale,
    bgStyle: "bg-[#f5f5f0] text-neutral-950 border border-white/80 shadow-2xl",
    stackedRotate: 5,
    stackedX: 12,
    stackedY: 16,
    stackedScale: 1.0,
    zIndex: 40,
    accentColor: "text-red-600"
  }
];

function PillarCard({ pillar, index, stackedIndex, isScattered }) {
  const Icon = pillar.icon;
  const isStacked = index + 1 <= stackedIndex;

  return (
    <motion.div
      initial={false}
      animate={{
        y: isScattered ? 0 : isStacked ? pillar.stackedY : '80vh',
        opacity: isStacked || isScattered ? 1 : 0,
        rotate: isScattered ? 0 : isStacked ? pillar.stackedRotate : 0,
        x: isScattered ? 0 : isStacked ? pillar.stackedX : 0,
        scale: isScattered ? 1 : isStacked ? pillar.stackedScale : 0.85,
        zIndex: isScattered ? 10 : pillar.zIndex,
      }}
      transition={{
        duration: 0.65,
        ease: [0.33, 1, 0.68, 1],
        delay: isScattered
          ? index * 0.12
          : isStacked
          ? index * 0.48 // Staggered entrance over 2.5s total
          : (3 - index) * 0.48, // Staggered down/exit over 2.5s total
      }}
      style={{
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
      }}
      className={`
        ${isScattered ? 'relative w-full h-full min-h-[310px]' : 'absolute inset-0 w-full h-full'}
        rounded-3xl p-6 sm:p-7 flex flex-col justify-between select-none
        transition-shadow duration-300 group
        hover:z-50 hover:shadow-2xl hover:-translate-y-2
        ${pillar.bgStyle}
      `}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] font-bold tracking-widest uppercase opacity-90">
            {pillar.tag}
          </span>
          <div className="p-2 rounded-xl bg-black/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
            <Icon className={`w-5 h-5 ${pillar.accentColor}`} />
          </div>
        </div>
        <div className="font-mono text-5xl sm:text-6xl font-extrabold leading-none my-3 tracking-tight drop-shadow-sm">
          {pillar.num}
        </div>
      </div>

      <div>
        <h3 className="font-sans font-extrabold text-xl mb-2 tracking-tight group-hover:text-red-500 transition-colors duration-300">
          {pillar.title}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed opacity-85 font-normal">
          {pillar.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function TiltedCards() {
  const [stackedIndex, setStackedIndex] = useState(1);
  const [isScattered, setIsScattered] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Automatic entrance animation: cards stack one by one over 2.5s when section enters view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          // Sequence from step 1 to step 4 over 2.5 seconds
          const t1 = setTimeout(() => setStackedIndex(2), 625);
          const t2 = setTimeout(() => setStackedIndex(3), 1250);
          const t3 = setTimeout(() => setStackedIndex(4), 1875);
          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
          };
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950 py-16 sm:py-24 flex flex-col justify-center items-center overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-xs tracking-widest uppercase mb-3">
            <Layers size={14} className="text-red-500 animate-pulse" />
            <span>• OUR CORE PILLARS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-center text-white tracking-tight">
            Pioneering Data &amp; Intelligence
          </h2>
        </div>

        {/* Control Toolbar */}
        <div className="flex items-center gap-2 mb-8 bg-neutral-900/90 border border-neutral-800/80 p-2 rounded-full shadow-xl backdrop-blur-md">
          {/* Step Buttons 1, 2, 3, 4 */}
          <div className="flex items-center gap-1.5 px-1">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  setStackedIndex(step);
                  setIsScattered(false);
                }}
                className={`w-9 h-9 rounded-full font-mono text-xs font-bold transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  !isScattered && step <= stackedIndex
                    ? 'bg-red-600 text-white shadow-lg scale-105 ring-2 ring-red-500/40'
                    : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
                aria-label={`Show stack level ${step}`}
              >
                {step}
              </button>
            ))}
          </div>

          {/* Scatter Button with -> Icon */}
          {!isScattered && (
            <div className="hidden lg:flex items-center pl-1 border-l border-neutral-800">
              <button
                type="button"
                onClick={() => setIsScattered(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 hover:bg-red-600 text-white font-mono text-xs font-bold transition-all duration-300 shadow-md cursor-pointer group"
                title="Scatter all cards horizontally"
              >
                <span>SCATTER ALL</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300 text-red-400 group-hover:text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Cards Stage Container */}
        <div
          className={`transition-all duration-500 ease-out ${
            isScattered
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto'
              : 'relative max-w-sm sm:max-w-md w-full h-[360px] sm:h-[380px] mx-auto'
          }`}
        >
          {pillars.map((pillar, idx) => (
            <PillarCard
              key={pillar.num}
              pillar={pillar}
              index={idx}
              stackedIndex={stackedIndex}
              isScattered={isScattered}
            />
          ))}
        </div>
      </div>
    </section>
  );
}







