import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function ProjectEmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 sm:p-16 bg-white/90 border border-neutral-200 rounded-3xl text-center space-y-4 max-w-lg mx-auto backdrop-blur-md shadow-md">
      <div className="p-4 rounded-full bg-red-50 border border-red-200 text-red-600 mb-1">
        <SearchX size={36} aria-hidden="true" />
      </div>

      <h3 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900">
        No Projects Found
      </h3>

      <p className="text-neutral-600 text-xs sm:text-sm max-w-sm leading-relaxed font-sans">
        No academic projects match your current search criteria and filters. Try adjusting your search term or reset all active filters.
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-[0_0_25px_rgba(229,9,20,0.4)] cursor-pointer active:scale-95 mt-2"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}
