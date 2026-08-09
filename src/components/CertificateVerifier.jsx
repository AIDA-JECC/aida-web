import React, { useEffect, useState } from 'react';
import { sampleCertificates, siteConfig } from '../data/siteData';
import confetti from 'canvas-confetti';
import { ShieldCheck, Search, Award, CheckCircle2, AlertCircle, Calendar, User, Building, MapPin, Download, Sparkles } from 'lucide-react';

const CertTypingText = ({ text, delay = 0, speed = 12, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (!text) return undefined;

    let timeoutId;
    let intervalId;

    timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i++;
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

const PLACEHOLDERS = [
  "Enter Certificate ID...",
  "e.g. AIDA-2026",
];

export default function CertificateVerifier() {
  const [certId, setCertId] = useState('');
  const [searchedResult, setSearchedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');

  // Continuous typing and backspacing animation loop for input placeholder
  useEffect(() => {
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
  }, []);

  const handleVerify = (idToSearch) => {
    const query = idToSearch || certId;
    if (!query.trim()) {
      setErrorMsg('Please enter a valid Certificate ID');
      setSearchedResult(null);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSearchedResult(null);

    setTimeout(() => {
      setLoading(false);
      const cleanId = query.trim().toUpperCase();
      const found = sampleCertificates[cleanId];

      if (found) {
        setSearchedResult(found);
        setErrorMsg('');
        // Trigger celebratory confetti with theme colors (red, black, white, and theme accents)
        const themeColors = ['#e50914', '#000000', '#ffffff', '#ff1e27', '#111111', '#00f2fe', '#8b0000'];
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
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
        setErrorMsg(`No certificate found for ID "${cleanId}". Please check the ID or contact support.`);
        setSearchedResult(null);
      }
    }, 400);
  };

  const fillSampleId = (sampleId) => {
    setCertId(sampleId);
    handleVerify(sampleId);
  };

  return (
    <section id="verify" className="section-padding verify-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-badge">
            <ShieldCheck size={14} className="text-cyan" />
            <span>OFFICIAL VERIFICATION PORTAL</span>
          </div>
          <h2 className="section-title">
            Verify <span className="text-gradient">Certificate</span> Authenticity
          </h2>
          <p className="section-subtitle">
            Instantly validate certificates issued by AIDA & Department of AI & DS, Jyothi Engineering College.
          </p>
        </div>

        {/* Verifier Card Form */}
        <div className="verify-card-box glass-card">
          <div className="verify-input-row">
            <div className="verify-field">
              <Search size={18} className="verify-search-icon" />
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder={placeholderText}
                className="verify-input"
              />
            </div>
            <button
              onClick={() => handleVerify()}
              disabled={loading}
              className="btn-primary-glow"
            >
              {loading ? 'Verifying...' : 'Verify Now'}
            </button>
          </div>



          {/* Error Alert */}
          {errorMsg && (
            <div className="verify-error-box mt-6">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Verified Certificate Display Card */}
          {searchedResult && (
            <div className="verified-certificate-display mt-8">
              <div className="cert-card-header">
                <div className="cert-brand">
                  <img src={siteConfig.logo} alt="AIDA Logo" className="cert-logo-img" />
                  <div>
                    <h4 className="cert-org-name">{siteConfig.fullName}</h4>
                    <span className="cert-inst">{siteConfig.institution}</span>
                  </div>
                </div>
                <div className="cert-status-badge">
                  <CheckCircle2 size={16} className="text-cyan" />
                  <span>AUTHENTIC &amp; VERIFIED</span>
                </div>
              </div>

              <div className="cert-divider" />

              <div className="cert-card-body">
                <div className="cert-recipient-block">
                  <span className="cert-label">This Certificate is Proudly Awarded to</span>
                  <h3 className="cert-recipient-name">
                    <CertTypingText text={searchedResult.name} delay={0} speed={25} />
                  </h3>
                  <span className="cert-institution-tag">
                    <Building size={14} /> <CertTypingText text={searchedResult.institution} delay={250} speed={18} />
                  </span>
                </div>

                <div className="cert-meta-grid">
                  <div className="cert-meta-item">
                    <span className="meta-label">Event Name</span>
                    <span className="meta-val text-cyan">
                      <CertTypingText text={searchedResult.eventName} delay={450} speed={18} />
                    </span>
                  </div>

                  <div className="cert-meta-item">
                    <span className="meta-label">Track / Domain</span>
                    <span className="meta-val">
                      <CertTypingText text={searchedResult.track} delay={650} speed={18} />
                    </span>
                  </div>

                  <div className="cert-meta-item">
                    <span className="meta-label">Certificate Type</span>
                    <span className="meta-val">
                      <CertTypingText text={searchedResult.certificateType} delay={850} speed={18} />
                    </span>
                  </div>

                  <div className="cert-meta-item">
                    <span className="meta-label">Organized By</span>
                    <span className="meta-val">
                      <CertTypingText text={searchedResult.organizedBy} delay={1050} speed={18} />
                    </span>
                  </div>

                  <div className="cert-meta-item">
                    <span className="meta-label">Event Mode</span>
                    <span className="meta-val">
                      <CertTypingText text={searchedResult.eventMode} delay={1250} speed={18} />
                    </span>
                  </div>

                  <div className="cert-meta-item">
                    <span className="meta-label">Issued Date</span>
                    <span className="meta-val">
                      <CertTypingText text={searchedResult.date} delay={1400} speed={18} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="cert-card-footer">
                <span className="cert-id-tag">
                  Official Verification ID: <strong><CertTypingText text={searchedResult.id} delay={1550} speed={25} /></strong>
                </span>

                <button
                  onClick={() => alert(`Certificate ${searchedResult.id} record verified. PDF export ready.`)}
                  className="btn-secondary-glass btn-sm"
                >
                  <Download size={14} />
                  <span>Download Verified Copy</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
