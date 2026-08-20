import React, { useState } from 'react';

// Extract initials from title/alt/name string
function getInitials(name) {
  if (!name) return 'AI';
  const clean = name.replace(/^(Dr|Prof|Mr|Mrs|Ms|Er)\.?\s+/i, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AI';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function SafeImage({
  src,
  srcSet,
  sizes,
  alt,
  title,
  category = 'FACULTY',
  initials,
  className,
  fallbackClassName,
  loading = 'lazy',
  draggable = 'false',
  onClick,
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  const displayInitials = initials || getInitials(title || alt);
  const displayCategory = category !== undefined ? category : 'FACULTY';

  // Render universal fallback card matching user specifications when image is missing or fails to load
  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full min-h-[120px] bg-[#121212] border border-red-900/40 rounded-xl relative overflow-hidden flex flex-col items-center justify-center select-none p-3 ${fallbackClassName || ''}`}
      >
        {/* Top-Left Pill Badge (only if category provided) */}
        {displayCategory ? (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-neutral-950/90 border border-red-900/40 text-neutral-400 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span>{displayCategory}</span>
          </div>
        ) : null}

        {/* Center Large Red Initials */}
        <div className="flex flex-col items-center justify-center text-center gap-1 my-auto z-10">
          <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wider text-red-500 uppercase">
            {displayInitials}
          </span>
          {displayCategory ? (
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mt-1">
              {displayCategory}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt || title || 'AIDA Asset'}
      loading={loading}
      draggable={draggable}
      onError={() => setHasError(true)}
      className={className}
      onClick={onClick}
      {...props}
    />
  );
}
