import React, { useEffect } from 'react';
import PlacementsSection from '../components/PlacementsSection';
import { ArrowLeft } from 'lucide-react';

export default function PlacementsPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      if (onNavigate) onNavigate('home');
      else window.location.hash = '#placements';
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-6 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-red-600/30">
      {/* Sticky Top Header with Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-800/80">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60 font-mono text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} className="text-red-500" />
            <span>BACK TO HOME</span>
          </button>
        </div>
      </div>

      {/* Dedicated Placements & Internships View (Lists all placement records completely) */}
      <PlacementsSection showAll={true} />
    </div>
  );
}
