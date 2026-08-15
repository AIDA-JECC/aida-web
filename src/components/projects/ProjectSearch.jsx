import React from 'react';
import { Search, X } from 'lucide-react';

export default function ProjectSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-4 text-neutral-400 pointer-events-none transition-colors group-focus-within:text-red-500"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects, students, technologies, guides..."
          className="w-full h-12 pl-11 pr-10 bg-neutral-900/90 border border-neutral-800 focus:border-red-600/70 rounded-2xl text-white text-sm placeholder-neutral-500 backdrop-blur-md outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(229,9,20,0.2)]"
          aria-label="Search academic projects"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
            aria-label="Clear search query"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
