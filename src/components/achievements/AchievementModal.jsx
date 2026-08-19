import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, GraduationCap, User, Hash, Mail, Trophy, Tag } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { getLevelBadge } from './AchievementCard';

function TypewriterTitle({ text }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <h2 className="font-serif font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-snug">
      {displayText}
      {displayText.length < (text?.length || 0) && (
        <span className="inline-block w-2 h-7 sm:h-8 ml-1 bg-red-600 animate-pulse align-middle" />
      )}
    </h2>
  );
}

export default function AchievementModal({ achievement, onClose }) {
  useEffect(() => {
    // Add modal-open class to body and dispatch event to hide navbar & brand logo
    document.body.classList.add('modal-open');
    window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: true } }));

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: false } }));
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!achievement) return null;

  const { studentName, registerNumber, email, semester, title, description, level, year, tag, image } = achievement;
  const badge = getLevelBadge(level);
  const BadgeIcon = badge.icon;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop Click Handler */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-[#0b0b10] border border-neutral-800/90 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-[0_0_100px_rgba(229,9,20,0.15)] z-[100001] flex flex-col my-auto">
        {/* Modal Header Bar with Close Button */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-800/80 sticky top-0 bg-[#0b0b10]/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg border font-mono text-xs font-bold ${badge.color}`}>
              <BadgeIcon size={14} />
              <span>{badge.text}</span>
            </span>
            <span className="text-neutral-500 font-mono text-xs hidden sm:inline">• {tag}</span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-red-600 transition-all cursor-pointer shadow-md hover:scale-105"
            aria-label="Close popup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Certificate Image View */}
          <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/80 group">
            <SafeImage
              src={image}
              alt={title}
              title={title}
              category={tag}
              className="w-full max-h-[460px] object-contain mx-auto"
            />
            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 px-4 py-2.5 rounded-xl bg-black/80 hover:bg-red-600 border border-neutral-700 hover:border-red-500 text-white font-mono text-xs font-semibold flex items-center gap-2 backdrop-blur-md transition-all shadow-xl hover:scale-105"
            >
              <ExternalLink size={14} />
              <span>Open Full Certificate Image</span>
            </a>
          </div>

          {/* Typing Title & Details */}
          <div className="space-y-4 pt-2">
            {/* Typewriter Title Animation */}
            <TypewriterTitle text={title} />

            {description && (
              <p className="text-neutral-300 font-sans text-sm sm:text-base leading-relaxed bg-neutral-900/60 p-4 sm:p-5 rounded-2xl border border-neutral-800/80">
                {description}
              </p>
            )}

            {/* Metadata Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                  <User size={13} className="text-red-500" />
                  <span>Student Name</span>
                </div>
                <p className="text-white font-semibold text-sm truncate uppercase">{studentName}</p>
              </div>

              {registerNumber && (
                <div className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                    <Hash size={13} className="text-red-500" />
                    <span>Register Number</span>
                  </div>
                  <p className="text-white font-semibold text-sm font-mono">{registerNumber}</p>
                </div>
              )}

              <div className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                  <GraduationCap size={13} className="text-red-500" />
                  <span>Semester</span>
                </div>
                <p className="text-white font-semibold text-sm">{semester}</p>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                  <Calendar size={13} className="text-red-500" />
                  <span>Year / Date</span>
                </div>
                <p className="text-white font-semibold text-sm">{year}</p>
              </div>
            </div>

            {email && (
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 pt-2">
                <Mail size={13} className="text-red-500" />
                <span>Contact Email:</span>
                <a href={`mailto:${email}`} className="text-red-400 hover:underline">{email}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
