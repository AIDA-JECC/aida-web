import React, { useState } from 'react';
import { siteConfig } from '../data/siteData';
import { Mail, MapPin, Send, CheckCircle, ExternalLink, MessageSquare, Phone } from 'lucide-react';

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <section id="contact" className="section-padding contact-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-badge">
            <MessageSquare size={14} className="text-cyan" />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="section-title">
            Connect with <span className="text-gradient">AIDA JECC</span>
          </h2>
          <p className="section-subtitle">
            Have questions about upcoming hackathons, department events, or collaboration opportunities? Send us a message!
          </p>
        </div>

        <div className="contact-grid">
          
          {/* Left Column: Contact Form */}
          <div className="contact-form-card glass-card">
            <h3 className="form-title">Send a Message</h3>
            
            {submitted ? (
              <div className="contact-success-box text-center">
                <CheckCircle size={40} className="text-cyan mb-3" />
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for reaching out to AIDA. Our team will get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary-glass mt-4">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Adithyan V."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. adithyan@jecc.ac.in"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Event sponsorship or general enquiry"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your query or collaboration proposal here..."
                    className="form-textarea"
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary-glow full-w justify-center">
                  <Send size={16} />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Campus Address & Info */}
          <div className="contact-info-column">
            
            {/* Campus Address Card */}
            <div className="info-card glass-card">
              <div className="info-card-icon">
                <MapPin size={22} className="text-cyan" />
              </div>
              <div className="info-card-content">
                <h4 className="info-card-title">Campus Location</h4>
                <p className="info-card-text">
                  Department of Artificial Intelligence & Data Science<br />
                  Jyothi Engineering College, Jyothi Hills,<br />
                  Panjal Road, Cheruthuruthy, Thrissur, Kerala - 679531
                </p>
                <a
                  href="https://maps.google.com/?q=Jyothi+Engineering+College+Cheruthuruthy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-card-link text-cyan"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="info-card glass-card">
              <div className="info-card-icon">
                <Mail size={22} className="text-indigo" />
              </div>
              <div className="info-card-content">
                <h4 className="info-card-title">Direct Email</h4>
                <a href={`mailto:${siteConfig.contactEmail}`} className="info-card-text font-mono text-cyan">
                  {siteConfig.contactEmail}
                </a>
                <p className="info-sub-text">We reply within 24 business hours.</p>
              </div>
            </div>

            {/* Social Connect Card */}
            <div className="info-card glass-card">
              <h4 className="info-card-title mb-4">Official Channels</h4>
              <div className="contact-social-grid">
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-channel-btn"
                >
                  <LinkedinIcon size={18} />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-channel-btn"
                >
                  <InstagramIcon size={18} />
                  <span>Instagram</span>
                </a>

                <a
                  href={siteConfig.socials.collegeWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-channel-btn"
                >
                  <ExternalLink size={18} />
                  <span>JEC Website</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
