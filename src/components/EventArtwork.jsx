import React from 'react';

/**
 * Shows the complete event artwork without cropping it.
 *
 * Posters and event photographs arrive in many aspect ratios. A contained image
 * preserves every word and face; a blurred, enlarged copy of the same image
 * fills the unused space behind it so portrait artwork still feels intentional
 * in landscape cards and modals.
 */
export default function EventArtwork({
  event,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  children,
}) {
  return (
    <div className={`relative overflow-hidden isolate bg-neutral-950 ${className}`}>
      <img
        src={event.img}
        alt=""
        aria-hidden="true"
        loading={loading}
        decoding="async"
        className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] object-cover scale-110 blur-2xl opacity-45 saturate-125"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
      <img
        src={event.img}
        alt={`${event.name} event artwork`}
        loading={loading}
        decoding="async"
        className={`relative z-10 w-full h-full object-contain ${imageClassName}`}
      />
      {children && <div className="absolute inset-0 z-20 pointer-events-none">{children}</div>}
    </div>
  );
}
