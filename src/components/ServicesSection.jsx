import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles, ArrowRight, ExternalLink, CheckCircle2, X, ShieldCheck, Layers, Terminal } from 'lucide-react';
import { servicesData } from '../data/servicesData';

export default function ServicesSection({ onNavigate, showAll = false }) {
  const [selectedService, setSelectedService] = useState(null);

  const displayedServices = showAll ? servicesData : servicesData.slice(0, 2);

  const openModal = (service) => {
    setSelectedService(service);
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    setSelectedService(null);
    document.body.classList.remove('modal-open');
  };

  return (
    <section
      id="services"
      className="relative bg-neutral-950 py-16 sm:py-24 overflow-hidden select-none border-t border-neutral-900/80"
    >
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section (Image 2 Design: Clean red dot + red mono uppercase text) */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="font-mono text-xs sm:text-sm font-bold tracking-widest text-red-500 uppercase flex items-center justify-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-red-600 inline-block" />
            <span>SERVICES WE PROVIDE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-center text-white tracking-tight leading-tight">
            Digital Platforms &amp; <span className="text-red-600 italic">Smart Solutions</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm md:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Practical digital platforms, automated tools, academic digitizers, and sustainability initiatives created to solve real-world challenges.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {displayedServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => openModal(service)}
              className="service-card group relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#161619] via-[#111113] to-[#0a0a0c] border border-neutral-800/90 hover:border-red-600/60 shadow-xl hover:shadow-[0_0_35px_rgba(220,38,38,0.2)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Image Preview Container */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-900">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/30 to-transparent" />
                
                {/* Top Floating Category Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase border backdrop-blur-md ${service.badgeBg}`}>
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans text-xl sm:text-2xl font-extrabold text-white group-hover:text-red-500 transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  {/* "What it does" Highlight Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-300 font-mono text-xs font-medium">
                    <Terminal size={13} className="text-red-500 shrink-0" />
                    <span>{service.whatItDoes}</span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Tags & Action Buttons (No Hashtags) */}
                <div className="pt-4 border-t border-neutral-800/80 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold border border-red-500/80 transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95 group/btn"
                    >
                      <span>Visit</span>
                      <ExternalLink size={13} className="group-hover/btn:rotate-12 transition-transform" />
                    </a>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(service);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-mono text-xs border border-neutral-700/60 transition-all cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Bottom SVG Pattern */}
              <svg className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-15 z-0" viewBox="0 0 100 100" fill="none">
                <pattern id={`dots-service-${service.id}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="3.5" cy="3.5" r="1.6" fill="#ef4444" />
                </pattern>
                <rect width="100" height="100" fill={`url(#dots-service-${service.id})`} />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* VIEW ALL SERVICES Button (Homepage Only) */}
        {!showAll && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('services');
                else window.location.hash = '#/services';
              }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] cursor-pointer active:scale-95"
            >
              <span>VIEW ALL SERVICES</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Expanded Detail Modal Dialog */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-neutral-950/85 backdrop-blur-xl"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="service-modal relative w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 rounded-[2rem] shadow-2xl overflow-hidden z-10 my-auto"
            >
              {/* Modal Header Bar */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-950">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-950/80 text-neutral-300 hover:text-white hover:bg-red-600 border border-neutral-700/70 transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-md"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>

                {/* Header Title inside banner */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase border backdrop-blur-md ${selectedService.badgeBg}`}>
                      {selectedService.category}
                    </span>
                  </div>
                  <h3 className="font-sans text-2xl sm:text-4xl font-black text-white">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* What it does callout */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="font-mono text-[11px] font-bold text-red-500 tracking-wider uppercase">
                    • CORE PURPOSE &amp; FUNCTIONALITY
                  </span>
                  <p className="font-sans font-semibold text-base text-neutral-100">
                    {selectedService.whatItDoes}
                  </p>
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Description
                  </h4>
                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                    {selectedService.shortDescription}
                  </p>
                </div>

                {/* Highlights */}
                {selectedService.highlights && (
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider">
                      Department Impact &amp; Context
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                      {selectedService.highlights}
                    </p>
                  </div>
                )}

                {/* Key Features Checklist */}
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Key Features &amp; Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-950/70 border border-neutral-800 text-xs sm:text-sm text-neutral-200"
                      >
                        <CheckCircle2 size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags (No Hashtags) */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedService.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer (Visit button only, no Close View button) */}
              <div className="p-4 sm:p-6 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4">
                <a
                  href={selectedService.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] active:scale-95"
                >
                  <span>Visit</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
