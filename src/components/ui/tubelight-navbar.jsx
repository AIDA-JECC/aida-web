import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function NavBar({ items, activeSection, onSelect, className }) {
  const [activeTab, setActiveTab] = useState(items[0].name);

  useEffect(() => {
    if (activeSection) {
      const match = items.find(
        (i) =>
          i.id === activeSection ||
          i.name.toLowerCase() === activeSection.toLowerCase()
      );
      if (match) setActiveTab(match.name);
    }
  }, [activeSection, items]);

  return (
    <div
      className={cn(
        'fixed top-5 right-6 z-50 pointer-events-auto hidden md:block',
        className
      )}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 bg-neutral-950/90 border border-neutral-800/90 backdrop-blur-xl p-1.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] border-red-900/30 hover:border-red-600/40 transition-colors duration-300">
        {items.map((item) => {
          const isActive = activeTab === item.name;

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.name);
                if (onSelect) onSelect(item.id || item.name);
              }}
              className={cn(
                'relative cursor-pointer text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-full transition-colors duration-300 flex items-center justify-center select-none whitespace-nowrap shrink-0',
                'text-neutral-400 hover:text-white',
                isActive && 'text-white font-bold bg-neutral-900/80'
              )}
            >
              <span className="font-mono tracking-wider text-[11px] uppercase whitespace-nowrap">
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-red-600/15 rounded-full -z-10 border border-red-600/50"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Tubelight top lamp bar & ambient red glow */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-red-600 rounded-t-full shadow-[0_0_12px_#e50914]">
                    <div className="absolute w-12 h-6 bg-red-600/30 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-red-600/30 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-red-500/30 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
