import React from 'react';
import { AnimatedTestimonials } from './ui/animated-testimonials';
import { achievementsData } from '../data/achievementsData';

export default function AchievementsSection() {
  return (
    <section id="achievements" className="py-24 border-t border-neutral-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="text-center mb-12">
        <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-3 block">• OUR MILESTONES</span>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white">
          AIDA <span className="text-red-600 italic">Achievements</span> &amp; Glory
        </h2>
        <p className="text-neutral-400 max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
          Celebrating verified student excellence across national examinations and the creative arts.
        </p>
      </div>

      <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-3xl p-4 sm:p-8 backdrop-blur-xl shadow-2xl">
        <AnimatedTestimonials testimonials={achievementsData} autoplay={true} />
      </div>
    </section>
  );
}
