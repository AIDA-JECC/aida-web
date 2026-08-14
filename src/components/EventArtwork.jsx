import React from 'react';
import SafeImage from './ui/SafeImage';

export default function EventArtwork({
  event,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  children,
}) {
  return (
    <div className={`relative overflow-hidden isolate bg-neutral-950 ${className}`}>
      <SafeImage
        src={event.img}
        alt={`${event.name} event artwork`}
        title={event.name}
        category={event.category || 'EVENT'}
        loading={loading}
        className={`relative z-10 w-full h-full object-contain ${imageClassName}`}
      />
      {children && <div className="absolute inset-0 z-20 pointer-events-none">{children}</div>}
    </div>
  );
}

