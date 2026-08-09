import React, { useState } from 'react';
import { visionMissionData, faqsData, siteConfig } from '../data/siteData';
import { Target, Compass, Cpu, Trophy, Sparkles, ShieldCheck, ChevronDown, ChevronUp, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState('vision');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <section id="about" className="section-padding about-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-badge">
            <Compass size={14} className="text-cyan" />
            <span>DISCOVER AIDA</span>
          </div>
          <h2 className="section-title">
            Engineered for <span className="text-gradient">Excellence</span>.<br />
            Driven by <span className="text-white">Ethics & Data</span>.
          </h2>
          <p className="section-subtitle">
            The Artificial Intelligence & Data Science Association (AIDA) is the official student-led body of the Department of AI & DS at Jyothi Engineering College, Thrissur.
          </p>
        </div>

        {/* Vision & Mission Interactive Showcase Grid */}
        <div className="about-hero-grid">
          
          {/* Left Column: Vision Statement Glass Card */}
          <div className="about-vision-card">
            <div className="vision-header">
              <div className="icon-box-indigo">
                <Target size={22} />
              </div>
              <div>
                <span className="card-tag">OFFICIAL DEPARTMENT VISION</span>
                <h3 className="vision-card-title">Our Guiding Vision</h3>
              </div>
            </div>
            <blockquote className="vision-quote">
              "{visionMissionData.vision}"
            </blockquote>
            <div className="vision-footer">
              <span className="vision-sig-badge">
                <ShieldCheck size={14} className="text-cyan" />
                <span>Department of AI & DS • JEC</span>
              </span>
            </div>
          </div>

          {/* Right Column: Mission Points Box */}
          <div className="about-mission-card">
            <div className="mission-header">
              <div className="icon-box-cyan">
                <BookOpen size={22} />
              </div>
              <div>
                <span className="card-tag">STRATEGIC GOALS</span>
                <h3 className="mission-card-title">Department Mission</h3>
              </div>
            </div>

            <div className="mission-list">
              {visionMissionData.mission.map((item, idx) => (
                <div key={idx} className="mission-item">
                  <div className="mission-num">0{idx + 1}</div>
                  <p className="mission-text">{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4 Core Pillars Grid */}
        <div className="pillars-section-wrap">
          <h3 className="pillars-main-title">
            The Four Pillars of <span className="text-gradient">AIDA</span>
          </h3>

          <div className="pillars-grid">
            {visionMissionData.pillars.map((pillar, idx) => (
              <div key={idx} className="pillar-card">
                <div className="pillar-card-inner">
                  <div className="pillar-icon-row">
                    {idx === 0 && <Cpu size={24} className="pillar-icon" />}
                    {idx === 1 && <Trophy size={24} className="pillar-icon" />}
                    {idx === 2 && <Sparkles size={24} className="pillar-icon" />}
                    {idx === 3 && <ShieldCheck size={24} className="pillar-icon" />}
                    <span className="pillar-num">Pillar 0{idx + 1}</span>
                  </div>
                  <h4 className="pillar-title">{pillar.title}</h4>
                  <p className="pillar-desc">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Overview Banner */}
        <div className="dept-overview-box">
          <div className="dept-overview-content">
            <span className="dept-pill">APJ Abdul Kalam Technological University (KTU) Affiliated</span>
            <h3 className="dept-overview-title">World-Class Data Science Infrastructure</h3>
            <p className="dept-overview-desc">
              Situated in Cheruthuruthy, Thrissur, our department integrates computer science fundamentals with advanced machine learning algorithms, deep neural network training labs, and big data visualization tools. Students participate in peer research, open-source AI projects, and national hackathons.
            </p>
            <div className="dept-highlights-row">
              <div className="dept-highlight-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Dedicated GPU Data Science Lab</span>
              </div>
              <div className="dept-highlight-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>AICTE Approved 4-Year B.Tech Program</span>
              </div>
              <div className="dept-highlight-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Incubation & Research Project Support</span>
              </div>
            </div>
          </div>
          <div className="dept-overview-media">
            <img src={siteConfig.introImg} alt="AIDA Department Intro" className="dept-media-img" />
          </div>
        </div>

        {/* FAQ & Q&A Accordion Section */}
        <div className="faq-section-wrap">
          <div className="text-center mb-12">
            <span className="section-badge">
              <Layers size={14} className="text-indigo" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </span>
            <h3 className="faq-title">Everything You Need to Know</h3>
          </div>

          <div className="faq-accordion">
            {faqsData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className={`faq-card ${isOpen ? 'open' : ''}`}>
                  <button onClick={() => toggleFaq(idx)} className="faq-question-btn">
                    <span className="faq-question-text">{faq.question}</span>
                    <div className="faq-toggle-icon">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p className="faq-answer-text">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
