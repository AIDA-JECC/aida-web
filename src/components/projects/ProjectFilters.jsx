import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';

const BATCH_OPTIONS = [
  'All Batches',
  '2023–2027',
  '2024–2028',
  '2025–2029',
];

const TYPE_OPTIONS = [
  'All Project Types',
  'Micro Project',
  'Mini Project',
  'Main Project',
];

export default function ProjectFilters({
  selectedBatch,
  setSelectedBatch,
  selectedType,
  setSelectedType,
  onReset,
  totalCount,
  filteredCount,
  isFiltered,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl backdrop-blur-md shadow-lg">
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
          <Filter size={14} className="text-red-500" aria-hidden="true" />
          <span>Filters:</span>
        </div>

        {/* Batch Year Filter Dropdown */}
        <div className="relative shrink-0 w-full sm:w-auto">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-neutral-950 border border-neutral-800 focus:border-red-600/70 text-white text-xs font-mono font-bold px-4 py-2.5 pr-8 rounded-xl cursor-pointer outline-none transition-all hover:border-neutral-700 shadow-sm"
            aria-label="Filter by Batch Year"
          >
            {BATCH_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-neutral-950 text-white">
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
            ▼
          </div>
        </div>

        {/* Project Type Filter Dropdown */}
        <div className="relative shrink-0 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-neutral-950 border border-neutral-800 focus:border-red-600/70 text-white text-xs font-mono font-bold px-4 py-2.5 pr-8 rounded-xl cursor-pointer outline-none transition-all hover:border-neutral-700 shadow-sm"
            aria-label="Filter by Project Type"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-neutral-950 text-white">
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
            ▼
          </div>
        </div>

        {/* Reset Filters Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-900/50 bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            aria-label="Reset all search and filters"
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Dynamic Project Counter */}
      <div className="text-xs font-mono font-bold text-neutral-400 tracking-wider shrink-0 text-right sm:text-left">
        Showing <span className="text-white font-extrabold">{filteredCount}</span> of{' '}
        <span className="text-neutral-300">{totalCount}</span> Projects
      </div>
    </div>
  );
}
