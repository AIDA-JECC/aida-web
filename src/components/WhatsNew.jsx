import React, { useState } from 'react';
import { announcementsData } from '../data/siteData';
import { BellRing, Calendar, ArrowRight, Tag, Sparkles } from 'lucide-react';

export default function WhatsNew({ onExploreEventsClick }) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Hackathon', 'Workshop', 'Masterclass'];

  const filteredAnnouncements = selectedFilter === 'All'
    ? announcementsData
    : announcementsData.filter(a => a.category === selectedFilter);

  return (
    <section id="announcements" className="section-padding whatsnew-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="whatsnew-header-row">
          <div>
            <div className="section-badge">
              <BellRing size={14} className="text-cyan" />
              <span>WHAT'S NEW AT AIDA</span>
            </div>
            <h2 className="section-title text-left">
              Live <span className="text-gradient">Announcements</span> & Updates
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="filter-pill-group">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`filter-btn ${selectedFilter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Announcement Cards Grid */}
        <div className="announcements-grid">
          {filteredAnnouncements.map((item) => (
            <div key={item.id} className="announcement-card">
              <div className="card-top-bar">
                <span className="ann-category-tag">
                  <Tag size={12} />
                  <span>{item.category}</span>
                </span>
                <span className="ann-badge">
                  <Sparkles size={12} className="text-cyan" />
                  <span>{item.badge}</span>
                </span>
              </div>

              <h3 className="ann-title">{item.title}</h3>
              <p className="ann-desc">{item.description}</p>

              <div className="ann-footer">
                <div className="ann-date">
                  <Calendar size={14} className="text-muted" />
                  <span>{item.date}</span>
                </div>
                <button onClick={onExploreEventsClick} className="ann-link-btn">
                  <span>Details</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
