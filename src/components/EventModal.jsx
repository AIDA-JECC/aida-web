import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Tag, ExternalLink } from 'lucide-react';
import EventArtwork from './EventArtwork';

export default function EventModal({ event, onClose }) {
  useEffect(() => {
    if (event) {
      document.body.classList.add('scroll-locked');
      document.body.classList.add('modal-open');
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('scroll-locked');
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-neutral-950 border border-red-900/60 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/75 border border-neutral-800 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer"
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Modal Image */}
          <EventArtwork event={event} className="min-h-[360px] md:min-h-[620px]">
            <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full font-mono text-xs font-bold uppercase bg-red-600 text-white shadow-lg">
              {event.status || 'Completed'}
            </span>
          </EventArtwork>

          {/* Modal Content Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="border border-neutral-800 px-3 py-1 rounded-full font-mono text-xs text-neutral-400">
                  {event.category}
                </span>
                <span className="border border-neutral-800 px-3 py-1 rounded-full font-mono text-xs text-neutral-400">
                  {event.dateLabel}
                </span>
              </div>

              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                {event.name}
              </h2>

              <div className="space-y-2 text-xs sm:text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-red-500" />
                  <span>{event.dateLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" />
                  <span>Venue: {event.location || 'Jyothi Engineering College'}</span>
                </div>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {event.detail}
              </p>

              {event.tags && (
                <div>
                  <h4 className="font-mono text-xs text-neutral-500 uppercase mb-2">Key Focus Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md text-xs text-neutral-300">
                        <Tag size={12} className="text-red-500" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {event.registrationUrl && (
              <div className="pt-4 border-t border-neutral-900">
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  <span>Register for Event</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
