import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "../../data/siteData";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  try {
    gsap.registerPlugin(CustomEase);
  } catch (e) {
    console.warn("CustomEase failed to load, falling back to default.", e);
  }
}

const navItemsData = [
  { heading: 'Home', href: '#home', id: 'home', shape: '1' },
  { heading: 'About AIDA', href: '#about', id: 'about', shape: '2' },
  { heading: 'Events & Workshops', href: '#events', id: 'events', shape: '3' },
  { heading: 'Achievements', href: '#achievements', id: 'achievements', shape: '4' },
  { heading: 'Academic Projects', href: '#projects', id: 'projects', shape: '5' },
  { heading: 'Meet Our Faculty', href: '#team', id: 'team', shape: '6' },
  { heading: 'Meet Core Team', href: '#core-team', id: 'core-team', shape: '7' },
  { heading: 'Verify Certificate', href: '#verify', id: 'verify', shape: '8' },
  { heading: 'Contact Us', href: '#contact', id: 'contact', shape: '9' },
];

const SECTION_NAMES = {
  home: 'HOME',
  about: 'ABOUT',
  events: 'EVENTS',
  achievements: 'ACHIEVEMENTS',
  projects: 'PROJECTS',
  team: 'FACULTY',
  'core-team': 'CORE TEAM',
  verify: 'VERIFY',
  contact: 'CONTACT',
};

export function SterlingGateKineticNavigation({
  activeSection = 'home',
  onSelect,
  isMenuOpen: externalIsMenuOpen,
  setIsMenuOpen: externalSetIsMenuOpen,
}) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);
  const [internalIsActive, setInternalIsActive] = useState(false);

  const isActive = externalIsMenuOpen !== undefined ? externalIsMenuOpen : internalIsActive;
  const setIsActive = externalSetIsMenuOpen !== undefined ? externalSetIsMenuOpen : setInternalIsActive;

  // Track scroll direction for vertical reel transition (1 = down, -1 = up)
  const [scrollDirection, setScrollDirection] = useState(1);
  const prevScrollY = useRef(0);

  // Active hover shape for PC view
  const [hoveredShape, setHoveredShape] = useState(null);

  // 1. Scroll direction tracker
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY.current + 4) {
        setScrollDirection(1); // Downward scroll
      } else if (currentScrollY < prevScrollY.current - 4) {
        setScrollDirection(-1); // Upward scroll
      }
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Initialize GSAP Master Timeline ONCE on mount
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch (e) {
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current.querySelector(".nav-overlay-wrapper");
      const overlay = containerRef.current.querySelector(".overlay");
      const bgPanels = containerRef.current.querySelectorAll(".backdrop-layer");
      const menuLinkTexts = containerRef.current.querySelectorAll(".nav-link-text");
      const menuLinkNums = containerRef.current.querySelectorAll(".nav-link-num");

      // Master Timeline for opening entrance animation
      const masterTl = gsap.timeline({ paused: true });

      masterTl
        .set(navWrap, { display: "block", opacity: 1 })
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0)
        .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.08, duration: 0.5, ease: "main" }, 0)
        .fromTo(
          menuLinkTexts,
          { yPercent: 140, rotate: 6, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: "power3.out" },
          0.15
        )
        .fromTo(
          menuLinkNums,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, stagger: 0.03, duration: 0.3, ease: "power2.out" },
          0.38
        );

      tlRef.current = masterTl;
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // 3. Handle Opening and Fast 0.5s Fade-Out Closing
  useEffect(() => {
    if (!containerRef.current) return;
    const navWrap = containerRef.current.querySelector(".nav-overlay-wrapper");
    const menuButtonIcon = containerRef.current.querySelector(".menu-button-icon");

    if (isActive) {
      // Lock page scroll on mobile and desktop
      document.body.style.overflow = "hidden";
      if (navWrap) {
        navWrap.setAttribute("data-nav", "open");
        gsap.killTweensOf(navWrap);
        gsap.set(navWrap, { opacity: 1, display: "block" });
      }
      if (menuButtonIcon) {
        gsap.to(menuButtonIcon, { rotate: 315, duration: 0.4, ease: "power2.out" });
      }
      if (tlRef.current) {
        tlRef.current.restart();
      }
    } else {
      // Restore page scroll
      document.body.style.overflow = "auto";

      if (navWrap && navWrap.getAttribute("data-nav") === "open") {
        if (menuButtonIcon) {
          gsap.to(menuButtonIcon, { rotate: 0, duration: 0.4, ease: "power2.out" });
        }
        gsap.killTweensOf(navWrap);
        gsap.to(navWrap, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            navWrap.setAttribute("data-nav", "closed");
            gsap.set(navWrap, { display: "none", opacity: 1 });
            if (tlRef.current) {
              tlRef.current.pause(0);
            }
          },
        });
      }
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isActive]);

  // 4. Update Active Shape display (Hover PC or Active Mobile/Default)
  useEffect(() => {
    if (!containerRef.current) return;
    const shapesContainer = containerRef.current.querySelector(".ambient-background-shapes");
    if (!shapesContainer) return;

    const currentItem = navItemsData.find((item) => item.id === activeSection) || navItemsData[0];
    const targetShapeIndex = (window.innerWidth >= 768 && hoveredShape) ? hoveredShape : currentItem.shape;

    shapesContainer.querySelectorAll(".bg-shape").forEach((s) => {
      if (s.classList.contains(`bg-shape-${targetShapeIndex}`)) {
        s.classList.add("active");
        const shapeEls = s.querySelectorAll(".shape-element");
        gsap.fromTo(
          shapeEls,
          { scale: 0.6, opacity: 0, rotation: -20 },
          { scale: 1, opacity: 1, rotation: -12, duration: 0.5, ease: "back.out(1.5)", overwrite: "auto" }
        );
      } else {
        s.classList.remove("active");
      }
    });
  }, [activeSection, hoveredShape, isActive]);

  // Continuous scroll-based interactive rotation for the plus icon (Clockwise down, Anti-clockwise up)
  useEffect(() => {
    const handleScroll = () => {
      if (isActive) return;
      const currentScrollY = window.scrollY;
      const menuButtonIcon = containerRef.current?.querySelector(".menu-button-icon");
      if (menuButtonIcon) {
        const rotationAngle = currentScrollY * 0.45;
        gsap.set(menuButtonIcon, { rotate: rotationAngle, transformOrigin: "center center" });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isActive]);

  // 5. Keyboard Escape key handling
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isActive) {
        setIsActive(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isActive, setIsActive]);

  const toggleMenu = () => setIsActive((prev) => !prev);
  const closeMenu = () => setIsActive(false);

  const currentSectionLabel = SECTION_NAMES[activeSection] || 'HOME';

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    closeMenu();
    if (onSelect) onSelect(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className="block">
      {/* Fixed Header Bar with Floating Trigger Button */}
      <div className="fixed right-4 sm:right-8 top-5 z-[9999] pointer-events-auto">
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
          className="nav-close-btn flex items-center bg-neutral-900/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-neutral-700/50 hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer active:scale-95"
        >
          {/* Directional Vertical Reel Transition for Section Name */}
          {!isActive && (
            <div className="relative overflow-hidden h-4 flex items-center justify-end min-w-[4.5rem] mr-1.5 select-none pointer-events-none">
              <AnimatePresence mode="popLayout" custom={scrollDirection}>
                <motion.span
                  key={activeSection}
                  custom={scrollDirection}
                  variants={{
                    initial: (dir) => ({
                      y: dir > 0 ? '100%' : '-100%',
                      opacity: 0,
                    }),
                    animate: {
                      y: '0%',
                      opacity: 1,
                      transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
                    },
                    exit: (dir) => ({
                      y: dir > 0 ? '-100%' : '100%',
                      opacity: 0,
                      transition: { duration: 0.25, ease: [0.5, 0, 0.75, 0] },
                    }),
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="font-mono text-xs font-bold tracking-widest uppercase text-neutral-200 block whitespace-nowrap"
                >
                  {currentSectionLabel}
                </motion.span>
              </AnimatePresence>
            </div>
          )}

          <div className="icon-wrap flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="menu-button-icon text-white"
            >
              <path
                d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                fill="currentColor"
              ></path>
              <path
                d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </button>
      </div>

      {/* Fullscreen Sterling Gate Kinetic Overlay & Menu */}
      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper hidden">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              {/* Ambient Background System: Simple & Effective Ambient Glow + Editorial Watermark */}
              <div className="ambient-background-shapes">
                {/* Shape 1: Home */}
                <div className="bg-shape bg-shape-1 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
                  <span className="shape-element absolute font-serif italic text-9xl text-neutral-900/10 select-none tracking-tighter -rotate-12 transform">
                    AIDA
                  </span>
                </div>

                {/* Shape 2: About AIDA */}
                <div className="bg-shape bg-shape-2 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
                  <span className="shape-element absolute font-sans font-black text-8xl text-neutral-900/10 select-none tracking-widest uppercase -rotate-12 transform">
                    ABOUT
                  </span>
                </div>

                {/* Shape 3: Events & Workshops */}
                <div className="bg-shape bg-shape-3 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/12 blur-3xl" />
                  <span className="shape-element absolute font-mono font-bold text-8xl text-neutral-900/10 select-none tracking-widest uppercase -rotate-12 transform">
                    EVENTS
                  </span>
                </div>

                {/* Shape 4: Achievements */}
                <div className="bg-shape bg-shape-4 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/12 blur-3xl" />
                  <span className="shape-element absolute font-serif text-8xl text-neutral-900/10 select-none tracking-widest uppercase -rotate-12 transform">
                    HONORS
                  </span>
                </div>

                {/* Shape 5: Academic Projects */}
                <div className="bg-shape bg-shape-5 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/12 blur-3xl" />
                  <span className="shape-element absolute font-mono font-bold text-8xl text-neutral-900/10 select-none tracking-widest uppercase -rotate-12 transform">
                    PROJECTS
                  </span>
                </div>

                {/* Shape 6: Meet Our Faculty */}
                <div className="bg-shape bg-shape-6 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
                  <span className="shape-element absolute font-sans font-bold text-8xl text-neutral-900/10 select-none tracking-widest uppercase -rotate-12 transform">
                    FACULTY
                  </span>
                </div>

                {/* Shape 7: Meet Core Team */}
                <div className="bg-shape bg-shape-7 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
                  <span className="shape-element absolute font-mono font-bold text-8xl text-neutral-900/10 select-none tracking-widest uppercase -rotate-12 transform">
                    LEADERS
                  </span>
                </div>

                {/* Shape 8: Verify Certificate */}
                <div className="bg-shape bg-shape-8 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
                  <span className="shape-element absolute font-mono font-bold text-8xl text-neutral-900/10 select-none tracking-widest uppercase -rotate-12 transform">
                    VERIFY
                  </span>
                </div>

                {/* Shape 9: Contact Us */}
                <div className="bg-shape bg-shape-9 flex items-center justify-center pointer-events-none">
                  <div className="shape-element w-80 h-80 rounded-full bg-red-600/12 blur-3xl" />
                  <span className="shape-element absolute font-sans font-extrabold text-8xl text-neutral-900/10 select-none tracking-widest uppercase -rotate-12 transform">
                    CONNECT
                  </span>
                </div>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <div>
                {/* Header Brand Logo Pill inside Drawer */}
                <div className="flex items-center justify-center pb-4 border-b border-neutral-300/60 mb-4">
                  <div className="flex items-center gap-2.5 bg-neutral-950 border border-red-900/40 px-4 py-2 rounded-full backdrop-blur-xl text-white shadow-xl">
                    <img
                      src={siteConfig.logo}
                      alt="AIDA Logo"
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                    />
                    <span className="font-sans font-black text-sm sm:text-base tracking-tight uppercase">
                      AIDA <span className="font-serif italic text-red-500 font-normal lowercase text-base sm:text-lg">jecc</span>
                    </span>
                  </div>
                </div>

                <ul className="menu-list">
                  {navItemsData.map((item, index) => {
                    const formattedIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;
                    const isActiveSection = activeSection === item.id;

                    return (
                      <li
                        key={item.id}
                        className="menu-list-item"
                        data-shape={item.shape}
                        onMouseEnter={() => setHoveredShape(item.shape)}
                        onMouseLeave={() => setHoveredShape(null)}
                      >
                        <a
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item.id)}
                          className="nav-link group overflow-hidden py-3 border-b border-neutral-300/60"
                        >
                          <div className="flex items-center gap-3.5 overflow-hidden">
                            <span className="nav-link-num text-red-600 font-mono text-sm font-bold shrink-0 w-7">
                              {formattedIndex}.
                            </span>

                            {/* Masked Overflow Container for Text Reveal */}
                            <div className="overflow-hidden py-0.5">
                              <span className={`nav-link-text inline-block uppercase transition-transform duration-200 group-hover:translate-x-1.5 ${isActiveSection ? 'text-red-600 font-extrabold' : ''}`}>
                                {item.heading}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isActiveSection && (
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                            <ArrowUpRight size={18} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Custom Drawer Footer */}
              <div className="flex w-full text-xs font-mono justify-between text-neutral-800 pt-5 border-t border-neutral-300/80 items-center shrink-0">
                <div className="flex gap-4 items-center">
                  <a
                    href={siteConfig.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-600 transition-colors flex items-center gap-1 group font-semibold"
                  >
                    <span>INSTAGRAM</span>
                    <ArrowUpRight size={13} className="group-hover:text-red-600 transition-transform" />
                  </a>
                  <a
                    href={siteConfig.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-600 transition-colors flex items-center gap-1 group font-semibold"
                  >
                    <span>LINKEDIN</span>
                    <ArrowUpRight size={13} className="group-hover:text-red-600 transition-transform" />
                  </a>
                </div>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-red-600 font-bold hover:underline transition-all"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default SterlingGateKineticNavigation;
