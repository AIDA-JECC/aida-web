import React, { useMemo, useState } from 'react';
import { AnimatedTestimonials } from './ui/animated-testimonials';
import { achievementsData } from '../data/achievementsData';
import AchievementModal from './achievements/AchievementModal';

// Fisher-Yates shuffle array helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function AchievementsSection({ onNavigate }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Pick 4 random achievements from the top 15 rows of the excel dataset on initial load
  const randomTopFour = useMemo(() => {
    const topFifteen = achievementsData.slice(0, 15);
    const shuffled = shuffleArray(topFifteen);
    return shuffled.slice(0, 4);
  }, []);

  const handleSeeMore = () => {
    if (onNavigate) {
      onNavigate('achievements');
    } else {
      window.location.hash = '#/achievements';
    }
  };

  return (
    <section id="achievements" className="py-20 sm:py-24 border-t border-neutral-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-3">
        <span className="font-mono text-xs tracking-widest text-red-500 uppercase block">
          • OUR MILESTONES &amp; EXCELLENCE
        </span>
        <h2 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          AIDA <span className="text-red-600 italic">Achievements</span> &amp; Glory
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-sans">
          Celebrating verified student excellence across hackathons, academic distinctions, NPTEL certifications, and competitive honors.
        </p>
      </div>

      {/* Glassmorphism Slideshow Container */}
      <div className="bg-[#0b0b10]/80 border border-neutral-800/80 rounded-3xl p-2 sm:p-6 backdrop-blur-xl shadow-2xl">
        <AnimatedTestimonials
          testimonials={randomTopFour}
          autoplay={true}
          onSeeMore={handleSeeMore}
          onSelectAchievement={(achievement) => setSelectedAchievement(achievement)}
          isModalOpen={selectedAchievement !== null}
        />
      </div>

      {/* Certificate Details Modal */}
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </section>
  );
}
