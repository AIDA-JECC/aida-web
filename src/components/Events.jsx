import React, { useState } from 'react';
import { eventsData } from '../data/siteData';
import EventModal from './EventModal';
import { Calendar, Search, Tag, ArrowRight, Sparkles, Filter } from 'lucide-react';

export default function Events() {
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const years = ['All', '2025', '2024', '2023'];

  const filteredEvents = eventsData.filter((evt) => {
    const matchesYear = selectedYear === 'All' || evt.year.toString() === selectedYear;
    const matchesSearch =
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  return (
    <section id="events" className="section-padding events-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-badge">
            <Sparkles size={14} className="text-indigo" />
            <span>AIDA EVENTS & HACKATHONS</span>
          </div>
          <h2 className="section-title">
            Our Flagship <span className="text-gradient">Innovations</span> & Workshops
          </h2>
          <p className="section-subtitle">
            Explore national hackathons, technical symposiums, hands-on data analytics bootcamps, and project expos hosted by AIDA.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="events-controls-row">
          <div className="year-tabs-group">
            <span className="filter-label"><Filter size={14} /> Year:</span>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`year-tab-btn ${selectedYear === year ? 'active' : ''}`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search hackathons, workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Events Cards Grid */}
        {filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="event-card glass-card"
              >
                <div className="event-img-wrap">
                  <img src={evt.img} alt={evt.name} className="event-card-img" />
                  <div className="event-badge-overlay">
                    <span className="badge-category">{evt.category}</span>
                    <span className={`badge-status ${evt.status ? evt.status.toLowerCase() : 'completed'}`}>
                      {evt.status || 'Completed'}
                    </span>
                  </div>
                </div>

                <div className="event-card-body">
                  <div className="event-year-row">
                    <Calendar size={14} className="text-cyan" />
                    <span>Year {evt.year}</span>
                  </div>

                  <h3 className="event-card-title">{evt.name}</h3>
                  <p className="event-card-snippet">{evt.detail}</p>

                  {evt.tags && (
                    <div className="event-card-tags">
                      {evt.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="mini-tag">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="event-card-footer">
                    <span className="view-details-text">
                      <span>View Details</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results-box">
            <p>No events found matching your search query.</p>
            <button onClick={() => { setSelectedYear('All'); setSearchQuery(''); }} className="btn-secondary-glass mt-4">
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Modal Popup */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
