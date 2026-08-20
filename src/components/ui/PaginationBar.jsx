import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationBar({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2.5 py-10 select-none">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="px-5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-200 font-mono text-xs font-semibold shadow-md">
        Page {currentPage} of {totalPages}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
