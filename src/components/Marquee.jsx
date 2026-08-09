import React from 'react';
import { marqueeDomains } from '../data/siteData';
import { Sparkles } from 'lucide-react';

export default function Marquee() {
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {marqueeDomains.concat(marqueeDomains).map((domain, index) => (
          <div key={index} className="marquee-item">
            <Sparkles size={12} className="marquee-sparkle" />
            <span>{domain}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
