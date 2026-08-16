import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, RotateCcw, X, ChevronDown, Check } from 'lucide-react';

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

// Custom Theme-Matched Animated Dropdown (z-40)
function CustomDropdown({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select ${label}`}
        className="flex items-center justify-between gap-2.5 bg-white border border-neutral-300 hover:border-red-600 text-neutral-900 font-mono text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer outline-none transition-all shadow-sm hover:shadow-md active:scale-98"
      >
        <span className="truncate max-w-[130px] sm:max-w-[160px]">{value}</span>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-2xl p-1.5 z-[60] space-y-1 animate-fadeIn ring-1 ring-black/5">
          {options.map((option) => {
            const isSelected = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-800 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <span>{option}</span>
                {isSelected && <Check size={14} className="shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProjectControls({
  searchQuery = '',
  setSearchQuery,
  onSearchChange,
  selectedBatch = 'All Batches',
  setSelectedBatch,
  onBatchChange,
  selectedType = 'All Project Types',
  setSelectedType,
  onTypeChange,
  onReset,
  onResetFilters,
  totalCount = 0,
  filteredCount = 0,
  isFiltered = false,
}) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleSearchChange = (val) => {
    if (setSearchQuery) setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleBatchChange = (val) => {
    if (setSelectedBatch) setSelectedBatch(val);
    if (onBatchChange) onBatchChange(val);
  };

  const handleTypeChange = (val) => {
    if (setSelectedType) setSelectedType(val);
    if (onTypeChange) onTypeChange(val);
  };

  const handleReset = () => {
    if (onReset) onReset();
    if (onResetFilters) onResetFilters();
  };

  return (
    <div className="w-full space-y-3 relative z-40">
      {/* Search & Filter Toolbar Container */}
      <div className="relative z-40 flex flex-col md:flex-row items-center justify-between gap-3 bg-white/90 border border-neutral-200/90 p-3 sm:p-4 rounded-2xl backdrop-blur-md shadow-md">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-3.5 text-neutral-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search projects by title, tech stack, guide, or student name..."
              className="w-full bg-neutral-100 border border-neutral-300 focus:border-red-600 focus:bg-white text-neutral-900 placeholder-neutral-500 font-sans text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                aria-label="Clear search query"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filter Dropdowns */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <CustomDropdown
            options={BATCH_OPTIONS}
            value={selectedBatch}
            onChange={handleBatchChange}
            label="Batch"
          />

          <CustomDropdown
            options={TYPE_OPTIONS}
            value={selectedType}
            onChange={handleTypeChange}
            label="Project Type"
          />

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-100 border border-red-300 text-red-700 hover:bg-red-600 hover:text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Reset search and filters"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex md:hidden items-center justify-between w-full pt-1">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-800 font-mono text-xs font-bold hover:border-red-600 transition-all cursor-pointer shadow-sm"
          >
            <Filter size={14} className="text-red-600" aria-hidden="true" />
            <span>Filters</span>
            {(selectedBatch !== 'All Batches' || selectedType !== 'All Project Types') && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            )}
            <ChevronDown size={14} className={`transition-transform duration-200 ${mobileFilterOpen ? 'rotate-180 text-red-600' : ''}`} />
          </button>

          {totalCount > 0 && (
            <div className="text-[11px] font-mono font-bold text-neutral-600">
              <span className="text-neutral-950 font-extrabold">{filteredCount}</span> / {totalCount} Projects
            </div>
          )}
        </div>
      </div>

      {/* Mobile Expandable Panel */}
      {mobileFilterOpen && (
        <div className="relative z-[45] flex flex-col md:hidden gap-3.5 bg-white border border-neutral-200 p-4 rounded-2xl shadow-xl animate-fadeIn">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">
              Batch Year
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {BATCH_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleBatchChange(opt)}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold text-center transition-all ${
                    selectedBatch === opt
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">
              Project Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleTypeChange(opt)}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold text-center transition-all ${
                    selectedType === opt
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 font-mono text-xs font-bold uppercase transition-all cursor-pointer mt-1"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
