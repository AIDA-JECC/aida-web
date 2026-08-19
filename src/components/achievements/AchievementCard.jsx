import React from 'react';
import { Calendar, GraduationCap, User, Hash, Eye, Trophy, Award, Medal, Star } from 'lucide-react';
import SafeImage from '../ui/SafeImage';

export function getLevelBadge(levelStr) {
  if (!levelStr) {
    return { text: 'ACHIEVEMENT', color: 'bg-red-600/90 border-red-400/50 text-white', icon: Trophy };
  }
  const str = String(levelStr).toLowerCase();
  if (str.includes('winner') || str.includes('1st prize') || str.includes('gold')) {
    return { text: levelStr.toUpperCase(), color: 'bg-gradient-to-r from-red-600 to-red-800 text-white border-red-400/50 shadow-red-900/40', icon: Trophy };
  }
  if (str.includes('2nd prize') || str.includes('runner') || str.includes('silver')) {
    return { text: levelStr.toUpperCase(), color: 'bg-neutral-800 text-red-400 border-red-600/50', icon: Award };
  }
  if (str.includes('topper') || str.includes('3rd prize') || str.includes('bronze')) {
    return { text: levelStr.toUpperCase(), color: 'bg-gradient-to-r from-amber-600 to-red-700 text-white border-amber-400/40', icon: Star };
  }
  if (str.includes('elite') || str.includes('certif')) {
    return { text: levelStr.toUpperCase(), color: 'bg-neutral-900 text-red-300 border-red-700/60', icon: Medal };
  }
  return { text: levelStr.toUpperCase(), color: 'bg-neutral-800 text-neutral-300 border-neutral-700', icon: Award };
}

export default function AchievementCard({ achievement, onViewDetails }) {
  const { studentName, registerNumber, semester, title, level, year, image, tag, description } = achievement;
  const badge = getLevelBadge(level);
  const BadgeIcon = badge.icon;

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(achievement)}
      className="group relative bg-[#0c0c10] border border-neutral-800/80 hover:border-red-600/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(229,9,20,0.2)] transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Preview Container */}
      <div className="relative w-full aspect-[16/10] bg-neutral-950 overflow-hidden">
        <SafeImage
          src={image}
          alt={title}
          title={title}
          category={tag}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Level Badge Overlay */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-[11px] font-bold tracking-wider shadow-md backdrop-blur-md ${badge.color}`}>
            <BadgeIcon size={13} />
            <span className="truncate max-w-[140px]">{badge.text}</span>
          </span>
        </div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-black/20 opacity-80" />
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-sans font-bold text-white text-base sm:text-lg line-clamp-1 group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          <p className="text-neutral-400 text-xs font-medium line-clamp-1 mt-1">
            {description || tag}
          </p>
        </div>

        {/* Metadata Lines */}
        <div className="space-y-2 pt-2 border-t border-neutral-800/60 font-mono text-xs text-neutral-400">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar size={13} className="text-red-500 shrink-0" />
              <span>{year}</span>
            </div>
            <span className="text-neutral-700">|</span>
            <div className="flex items-center gap-1.5 truncate">
              <GraduationCap size={13} className="text-red-500 shrink-0" />
              <span>{semester}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <User size={13} className="text-neutral-400 shrink-0" />
              <span className="font-semibold text-neutral-300 truncate uppercase">{studentName}</span>
            </div>
            {registerNumber && (
              <>
                <span className="text-neutral-700">|</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Hash size={13} className="text-neutral-400 shrink-0" />
                  <span className="text-neutral-400 font-mono text-[11px]">{registerNumber}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* View Certificate Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onViewDetails) onViewDetails(achievement);
          }}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-red-600/20 text-neutral-300 hover:text-red-400 border border-neutral-800 hover:border-red-500/50 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 group-hover:bg-red-600/10 cursor-pointer"
        >
          <Eye size={14} className="text-red-500 group-hover:scale-110 transition-transform" />
          <span>View Certificate</span>
        </button>
      </div>
    </div>
  );
}
