import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Tag, ExternalLink, ChevronLeft, ChevronRight, Camera, Phone, Trophy, Sparkles } from 'lucide-react';
import SafeImage from './ui/SafeImage';
import EventCountdownTimer from './ui/EventCountdownTimer';

export default function EventModal({ event, onClose }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

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

  const isUpcoming = event.status === 'Upcoming' || event.isUpcoming;

  // Determine gallery images from eventImages (eventImage folder) or fallback to coverPage / img
  const galleryImages =
    event.eventImages && event.eventImages.length > 0
      ? event.eventImages
      : event.gallery && event.gallery.length > 0
      ? event.gallery
      : [event.coverPage || event.img];

  const currentImage = galleryImages[activeImgIndex] || event.coverPage || event.img;
  const hasMultipleImages = galleryImages.length > 1;

  const nextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[10000] flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-neutral-950 border border-red-900/60 rounded-3xl shadow-2xl overflow-hidden custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/80 border border-neutral-800 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-lg"
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Modal Image Container */}
          <div className="relative min-h-[320px] sm:min-h-[420px] md:min-h-[580px] bg-neutral-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden border-b md:border-b-0 md:border-r border-neutral-850">
            <SafeImage
              src={currentImage}
              alt={`${event.name} photo`}
              title={event.name}
              category={event.category || 'EVENT'}
              className="w-full h-full max-h-[550px] object-contain rounded-2xl"
            />

            {/* Live Countdown Timer Badge for Upcoming Events */}
            {isUpcoming && (
              <div className="absolute top-4 left-4 z-30">
                <EventCountdownTimer targetDate={event.targetDate || '2026-10-01T09:00:00+05:30'} />
              </div>
            )}

            {/* Gallery Navigation Controls if multiple images exist */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 border border-neutral-800 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-lg"
                  aria-label="Previous event photo"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 border border-neutral-800 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shadow-lg"
                  aria-label="Next event photo"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Thumbnail dots / counter indicator */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800 text-xs font-mono font-bold text-white shadow-lg">
                  <Camera size={13} className="text-red-500" />
                  <span>
                    Photo {activeImgIndex + 1} of {galleryImages.length}
                  </span>
                </div>
              </>
            )}

            {!hasMultipleImages && (
              <span className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-full font-mono text-xs font-bold uppercase shadow-lg ${
                isUpcoming ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'
              }`}>
                {event.status || 'Completed'}
              </span>
            )}
          </div>

          {/* Modal Content Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="border border-neutral-800 px-3 py-1 rounded-full font-mono text-xs text-neutral-400">
                  {event.category}
                </span>
                <span className="border border-neutral-800 px-3 py-1 rounded-full font-mono text-xs text-amber-400 font-bold">
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

              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                {event.fullBrief || event.detail}
              </p>

              {/* Prize Pool Info */}
              {event.prizes && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <Trophy size={15} />
                    <span>PRIZE POOL</span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-white font-semibold">
                    {event.prizes}
                  </p>
                </div>
              )}

              {/* Event Contact Personnel */}
              {event.contacts && (
                <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-red-500 font-mono text-xs font-bold uppercase">
                    <Phone size={14} />
                    <span>CONTACT COORDINATORS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-300">
                    {event.contacts.map((contact, cIdx) => (
                      <a
                        key={cIdx}
                        href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                        className="flex items-center justify-between p-2 rounded-xl bg-neutral-950 hover:bg-red-950/40 border border-neutral-800 hover:border-red-600/60 transition-all text-neutral-200 hover:text-white"
                      >
                        <span className="font-bold">{contact.name}</span>
                        <span className="text-red-400 font-semibold">{contact.phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

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

            {(event.registrationUrl || event.registrationLink) && (
              <div className="pt-4 border-t border-neutral-900">
                <a
                  href={event.registrationUrl || event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-sm rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  <span>Register at yodha.aidajecc.in</span>
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
