import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

export default function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  showAll = false,
  onToggleShowAll,
  totalItems,
}) {
  if (totalPages <= 1 && !showAll) return null;

  return (
    <div className="flex items-center justify-center gap-2.5 py-10 select-none">
      <button
        type="button"
        onClick={() => onPageChange && onPageChange(Math.max(currentPage - 1, 1))}
        disabled={showAll || currentPage === 1}
        className="w-10 h-10 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={() => onToggleShowAll && onToggleShowAll(!showAll)}
        className={`px-5 py-2.5 rounded-xl border font-mono text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95 ${
          showAll
            ? 'bg-red-600/90 border-red-500 text-white hover:bg-red-600 shadow-red-950/50'
            : 'bg-neutral-900/90 border-neutral-800 text-neutral-200 hover:text-white hover:border-red-600/60'
        }`}
        title={showAll ? 'Click to switch back to paginated pages' : 'Click to show all items on one page'}
      >
        {showAll ? (
          <>
            <Minimize2 size={14} className="text-white shrink-0" />
            <span>Showing All {totalItems ? `(${totalItems})` : ''}</span>
          </>
        ) : (
          <>
            <span>Page {currentPage} of {totalPages}</span>
            {onToggleShowAll && (
              <span className="text-red-400 hover:text-red-300 ml-1 transition-colors flex items-center" title="Show All">
                <Maximize2 size={13} className="shrink-0" />
              </span>
            )}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => onPageChange && onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={showAll || currentPage === totalPages}
        className="w-10 h-10 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

