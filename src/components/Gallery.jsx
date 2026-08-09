import React, { useState } from 'react';
import { galleryImages } from '../data/siteData';
import { Camera, Maximize2, X, Sparkles } from 'lucide-react';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const categories = ['All', 'Hackathons', 'Workshops', 'Expos', 'Celebrations'];

  const filteredGallery = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(g => g.category === activeCategory);

  return (
    <section id="gallery" className="section-padding gallery-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-badge">
            <Camera size={14} className="text-cyan" />
            <span>CAMPUS MEMORIES</span>
          </div>
          <h2 className="section-title">
            Life at <span className="text-gradient">AIDA JECC</span>
          </h2>
          <p className="section-subtitle">
            Snapshots of our hackathons, coding marathons, lab workshops, and technical expos.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="gallery-tabs-row mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`gallery-tab-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Masonry / Grid */}
        <div className="gallery-grid">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="gallery-item-card glass-card"
            >
              <img src={item.img} alt={item.title} className="gallery-img" />
              <div className="gallery-hover-overlay">
                <Maximize2 size={24} className="gallery-zoom-icon" />
                <h4 className="gallery-item-title">{item.title}</h4>
                <span className="gallery-item-cat">{item.category}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="modal-backdrop" onClick={() => setActiveImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveImage(null)} className="modal-close-btn" aria-label="Close Gallery View">
              <X size={24} />
            </button>
            <img src={activeImage.img} alt={activeImage.title} className="lightbox-img" />
            <div className="lightbox-caption">
              <h3>{activeImage.title}</h3>
              <span>Category: {activeImage.category}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
