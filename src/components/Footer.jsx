import React from 'react';
import { siteConfig } from '../data/siteData';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import HeroDotField from './HeroDotField';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative -mt-[2vh] z-10 bg-[#040404] text-white border-t border-red-900/50 rounded-t-[2.5rem] sm:rounded-t-[4rem] pt-14 sm:pt-20 pb-10 sm:pb-12 overflow-hidden shadow-[0_-24px_80px_rgba(229,9,20,0.15)]">
      {/* Interactive white dot field animation */}
      <HeroDotField color="light" className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />

      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big Footer Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 sm:mb-16 gap-6 sm:gap-8">
          <div>
            <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-2 block">
              • AIDA JECC OFFICIAL FOOTER
            </span>
            <h2 className="font-serif text-3xl sm:text-6xl md:text-7xl leading-tight font-light text-white">
              Get ready to<br />
              <span className="text-red-600 italic font-serif">innovate.</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => scrollTo('events')}
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-red-600 hover:bg-white hover:text-neutral-950 text-white font-extrabold text-xs sm:text-sm tracking-wider rounded-full shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>EXPLORE EVENTS</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Balanced Grid Layout: 2-Columns on Mobile, 3-Columns on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-neutral-900">
          {/* Column 1: Social Connect & Overview */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-mono text-xs font-bold tracking-widest uppercase mb-4 text-red-500">• SOCIAL CONNECT</h4>
              <ul className="flex sm:flex-col gap-4 sm:gap-2.5 font-mono text-xs mb-6">
                <li>
                  <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5 group">
                    <span className="group-hover:text-red-500 transition-colors">INSTAGRAM</span>
                    <ArrowUpRight size={13} className="opacity-60 group-hover:opacity-100 group-hover:text-red-500 transition-all" />
                  </a>
                </li>
                <li>
                  <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5 group">
                    <span className="group-hover:text-red-500 transition-colors">LINKEDIN</span>
                    <ArrowUpRight size={13} className="opacity-60 group-hover:opacity-100 group-hover:text-red-500 transition-all" />
                  </a>
                </li>
              </ul>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm hidden sm:block">
              Pioneering ethical intelligence and transforming data into destiny at Jyothi Engineering College.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase mb-4 text-red-500">• QUICK NAVIGATION</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
              <li><button type="button" onClick={() => scrollTo('home')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">HOME</button></li>
              <li><button type="button" onClick={() => scrollTo('about')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">ABOUT AIDA</button></li>
              <li><button type="button" onClick={() => scrollTo('events')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">EVENTS</button></li>
              <li><button type="button" onClick={() => scrollTo('achievements')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">ACHIEVEMENTS</button></li>
              <li><button type="button" onClick={() => scrollTo('projects')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">PROJECTS</button></li>
              <li><button type="button" onClick={() => scrollTo('placements')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">PLACEMENTS &amp; INTERNSHIPS</button></li>
              <li><button type="button" onClick={() => scrollTo('team')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">FACULTY</button></li>
              <li><button type="button" onClick={() => scrollTo('core-team')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">CORE TEAM</button></li>
              <li><button type="button" onClick={() => scrollTo('verify')} className="text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-left">VERIFICATION</button></li>
            </ul>
          </div>

          {/* Column 3: Department Contact */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase mb-4 text-red-500">• DEPARTMENT CONTACT</h4>
            <div className="text-xs text-neutral-400 leading-relaxed space-y-2 font-normal">
              <p className="font-semibold text-white">Dept. of Artificial Intelligence &amp; Data Science</p>
              <p>Jyothi Engineering College, Cheruthuruthy, Thrissur, Kerala 679531</p>
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-red-500 hover:text-white font-mono font-semibold underline block transition-colors pt-1">
                {siteConfig.contactEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 sm:pt-8 text-xs font-mono text-neutral-500 gap-3 text-center sm:text-left">
          <span>© {new Date().getFullYear()} AIDA JECC. All rights reserved.</span>
          <div className="flex gap-4 sm:gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">TERMS &amp; PERMISSIONS</span>
            <span className="hover:text-white transition-colors cursor-pointer">PRIVACY POLICY</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
