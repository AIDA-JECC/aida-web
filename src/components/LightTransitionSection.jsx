import React, { useState, useEffect } from 'react';
import { sampleCertificates, siteConfig } from '../data/siteData';
import confetti from 'canvas-confetti';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

const FULL_PLACEHOLDER = "Enter Certificate ID...";

// Smooth, fast typing animation subcomponent
const FastTypingText = ({ text, delay = 0, speed = 12, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (!text) return undefined;

    let timeoutId;
    let intervalId;

    timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i += 1;
        setDisplayedText(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, delay, speed]);

  return <span className={className}>{displayedText}</span>;
};

export default function LightTransitionSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');

  const handleExpand = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    });
  };

  useEffect(() => {
    const handleOpenEvent = () => {
      if (!isExpanded) {
        handleExpand();
      }
    };
    window.addEventListener('open-verify-section', handleOpenEvent);
    return () => window.removeEventListener('open-verify-section', handleOpenEvent);
  }, [isExpanded]);

const PLACEHOLDERS = [
  "Enter Certificate ID...",
  "e.g. AIDA-2026",
];

// Continuous typing and backspacing animation loop for input placeholder
  useEffect(() => {
    if (!isExpanded) {
      setPlaceholderText('');
      return undefined;
    }

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timerId;

    const tick = () => {
      const currentText = PLACEHOLDERS[textIndex];

      if (isDeleting) {
        charIndex--;
        setPlaceholderText(currentText.slice(0, charIndex));
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % PLACEHOLDERS.length;
          timerId = setTimeout(tick, 350);
          return;
        }
        timerId = setTimeout(tick, 30);
      } else {
        charIndex++;
        setPlaceholderText(currentText.slice(0, charIndex));
        if (charIndex === currentText.length) {
          isDeleting = true;
          timerId = setTimeout(tick, 1800);
          return;
        }
        timerId = setTimeout(tick, 55);
      }
    };

    timerId = setTimeout(tick, 300);

    return () => clearTimeout(timerId);
  }, [isExpanded]);

  const handleVerify = (idToUse) => {
    const q = (idToUse || certId).trim().toUpperCase();
    if (!q) {
      setErrorMsg('Please enter a valid Certificate ID');
      setResult(null);
      return;
    }

    const found = sampleCertificates[q];
    if (found) {
      setResult(found);
      setErrorMsg('');
      const themeColors = ['#e50914', '#000000', '#ffffff', '#ff1e27', '#111111', '#00f2fe', '#8b0000'];
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.7 },
        colors: themeColors
      });
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.7 },
          colors: themeColors
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.7 },
          colors: themeColors
        });
      }, 150);
    } else {
      setErrorMsg(`No certificate record found for ID "${q}".`);
      setResult(null);
    }
  };

  return (
    <section
      id="verify"
      className={`relative z-10 bg-[#f5f5f0] text-neutral-950 overflow-hidden flex flex-col justify-center transition-all duration-[2200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        !isExpanded
          ? 'py-20 sm:py-28 min-h-[38vh]'
          : 'py-24 sm:py-32'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {!isExpanded ? (
          /* Minimal initial button state */
          <div className="flex flex-col items-center justify-center text-center px-2 w-full my-auto transition-opacity duration-300 py-4">
            <span className="font-mono text-xs sm:text-sm tracking-widest text-red-600 uppercase mb-4 block font-semibold">
              • OFFICIAL CERTIFICATE VERIFICATION PORTAL
            </span>
            <button
              type="button"
              onClick={handleExpand}
              className="group inline-flex items-center justify-between gap-4 sm:gap-8 px-6 sm:px-10 py-4 sm:py-5 rounded-full bg-white hover:bg-neutral-950 border border-neutral-300 hover:border-red-600 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 max-w-2xl w-full"
            >
              <span className="font-serif text-xl sm:text-3xl md:text-4xl text-neutral-950 group-hover:text-white font-normal transition-colors text-left truncate">
                So, ready to <span className="italic text-red-600 group-hover:text-red-500 font-serif">verify authenticity?</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600 group-hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-full shrink-0 shadow-sm">
                <span className="hidden sm:inline">UNLOCK PORTAL</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>
        ) : (
          /* Smooth live expanding content */
          <div
            className={`transition-all duration-[2200ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-top ${
              isOpen
                ? 'opacity-100 translate-y-0 max-h-[1800px]'
                : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
            }`}
          >
            <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase mb-3 block">
              • OFFICIAL CERTIFICATE VERIFICATION PORTAL
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl leading-tight mb-4">
              So, ready to<br />
              <span className="text-red-600 italic font-serif">verify authenticity?</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mb-10">
              Instantly validate certificates issued by AIDA &amp; Department of AI &amp; Data Science, Jyothi Engineering College.
            </p>

            {/* Certificate Verifier Card inside Light Section */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl">
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder={placeholderText}
                  className="flex-1 px-5 py-3 rounded-full border border-neutral-300 font-mono text-base sm:text-lg bg-neutral-50 focus:outline-none focus:border-red-600 font-semibold tracking-tight text-neutral-950 placeholder:font-mono placeholder:text-neutral-400 placeholder:font-normal"
                />
                <button
                  type="button"
                  onClick={() => handleVerify()}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm tracking-wider rounded-full shadow-md transition-all cursor-pointer min-h-[44px]"
                >
                  <span>VERIFY NOW</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>

              {errorMsg && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {result && (
                <div key={result.id} className="mt-7 bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-neutral-200">
                    <div className="flex items-center gap-3">
                      <img src={siteConfig.logo} alt="Logo" className="w-9 h-9 object-contain" />
                      <div>
                        <h4 className="font-sans font-extrabold text-base text-neutral-950 min-h-[1.5em]">
                          <FastTypingText text={result.eventName} delay={0} speed={12} />
                        </h4>
                        <span className="text-xs text-neutral-500 block min-h-[1.4em]">
                          <FastTypingText text={result.institution} delay={150} speed={10} />
                        </span>
                      </div>
                    </div>

                    <span className="inline-block bg-green-500 text-neutral-950 px-3 py-1 rounded-full font-mono text-xs font-bold self-start sm:self-auto">
                      AUTHENTIC
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-neutral-500 block mb-1">AWARDED TO</span>
                      <p className="font-bold text-neutral-900 min-h-[1.5em]">
                        <FastTypingText text={result.name} delay={250} speed={12} />
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block mb-1">TRACK</span>
                      <p className="font-bold text-neutral-900 min-h-[1.5em]">
                        <FastTypingText text={result.track} delay={350} speed={12} />
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block mb-1">DATE</span>
                      <p className="font-bold text-neutral-900 min-h-[1.5em]">
                        <FastTypingText text={result.date} delay={450} speed={12} />
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
