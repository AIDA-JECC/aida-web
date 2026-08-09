import React from 'react';
import { visionMissionData } from '../data/siteData';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-4 block font-semibold">
        • ABOUT AIDA JECC
      </span>
      
      <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl max-w-5xl text-white leading-tight mb-12">
        Creating <span className="text-red-600 italic font-serif">ethical leaders</span> in Artificial Intelligence &amp; Data Science through effectual learning.
      </h2>

      {/* Editorial Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Department Vision Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl ring-1 ring-inset ring-white/5">
          <span className="font-mono font-bold text-xs tracking-widest text-red-500 uppercase mb-3 block">
            • OFFICIAL DEPARTMENT VISION
          </span>

          <h3 className="font-sans font-extrabold text-2xl text-white mb-4">
            Department Vision
          </h3>

          <blockquote className="font-serif text-lg sm:text-xl text-neutral-300 italic leading-relaxed pl-4 border-l-2 border-red-600">
            "{visionMissionData.vision}"
          </blockquote>
        </div>

        {/* Department Mission Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl ring-1 ring-inset ring-white/5">
          <span className="font-mono font-bold text-xs tracking-widest text-red-500 uppercase mb-3 block">
            • STRATEGIC GOALS &amp; MISSION
          </span>

          <h3 className="font-sans font-extrabold text-2xl text-white mb-4">
            Department Mission
          </h3>

          <ul className="space-y-4">
            {visionMissionData.mission.map((item, idx) => (
              <li key={idx} className="text-neutral-300 text-sm sm:text-base leading-relaxed flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                  0{idx + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
