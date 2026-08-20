import React, { useState, useEffect } from 'react';
import { faqsData } from '../data/siteData';
import { Plus, Minus } from 'lucide-react';

const TypewriterAnswer = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="inline-block relative">
      {displayedText}
      <span className="inline-block w-1 h-3.5 ml-1 bg-red-500 animate-pulse align-middle" />
    </p>
  );
};

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState(null); // Default: No questions selected!

  return (
    <section id="faq" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-3 block">
        • FREQUENTLY ASKED QUESTIONS
      </span>
      <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white mb-10">
        Everything you need to know about <span className="text-red-600 italic">AIDA</span>
      </h2>

      <div className="space-y-4">
        {faqsData.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'border-red-600/80 bg-white/8 backdrop-blur-md ring-1 ring-inset ring-red-500/10'
                  : 'border-white/10 bg-white/5 backdrop-blur-md hover:border-red-900/60 ring-1 ring-inset ring-white/5'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className={`w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-base sm:text-lg transition-all duration-300 cursor-pointer touch-manipulation group active:bg-red-950/40 active:scale-[0.99] ${
                  isOpen
                    ? 'text-red-600 font-extrabold'
                    : 'text-white hover:text-red-600'
                }`}
              >
                <span className="pr-4 transition-colors duration-300">{faq.question}</span>
                {isOpen ? (
                  <Minus size={20} className="text-red-600 shrink-0 transform rotate-180 transition-transform duration-300" />
                ) : (
                  <Plus size={20} className="text-neutral-400 group-hover:text-red-600 shrink-0 transition-colors duration-300" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-neutral-300 text-sm sm:text-base leading-relaxed border-t border-neutral-800/80 pt-4 animate-fade-in">
                  <TypewriterAnswer text={faq.answer} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
