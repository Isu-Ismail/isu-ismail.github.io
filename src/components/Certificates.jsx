import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';

export const Certificates = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setActiveIndex((prevIndex) =>
          prevIndex === certificates.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [activeIndex, certificates.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <style>{`
        .certs-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .certs-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .carousel-outer {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          box-shadow: var(--shadow-lg);
        }
        .carousel-track {
          display: flex;
          transition: transform var(--transition-slow);
          height: 420px;
        }
        @media (max-width: 768px) {
          .carousel-track {
            height: auto;
            min-height: 480px;
          }
        }
        .carousel-slide-item {
          min-width: 100%;
          display: flex;
          flex-direction: row;
        }
        @media (max-width: 768px) {
          .carousel-slide-item {
            flex-direction: column;
          }
        }
        .cert-img-container {
          flex: 1.1;
          height: 100%;
          position: relative;
          background-color: #0b0f19;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .cert-img-container {
            height: 250px;
            width: 100%;
          }
        }
        .cert-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .carousel-slide-item:hover .cert-img {
          transform: scale(1.05);
        }
        .cert-info-container {
          flex: 0.9;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: var(--bg-secondary);
        }
        @media (max-width: 768px) {
          .cert-info-container {
            padding: 1.5rem;
          }
        }
        .cert-badge-award {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-primary);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .cert-title-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .cert-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: var(--glass-bg);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all var(--transition-fast);
          backdrop-filter: blur(4px);
        }
        .carousel-btn:hover {
          background-color: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }
        .carousel-btn-prev {
          left: 1rem;
        }
        .carousel-btn-next {
          right: 1rem;
        }
        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }
        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--border-color);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .indicator-dot-active {
          background-color: var(--color-primary);
          width: 24px;
          border-radius: 4px;
        }
      `}</style>

      <div className="certs-header">
        <h2 className="certs-title">Certifications</h2>
        <p style={{ color: 'var(--text-muted)' }}>Verified credentials and professional achievements.</p>
      </div>

      <div className="carousel-outer">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {certificates.map((cert, idx) => (
            <div key={idx} className="carousel-slide-item">
              <div className="cert-img-container">
                <img src={cert.image} alt={cert.title} className="cert-img" />
              </div>
              <div className="cert-info-container">
                <span className="cert-badge-award">
                  <Award size={14} /> Verified Credential
                </span>
                <h3 className="cert-title-text">{cert.title}</h3>
                <p className="cert-desc">{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-btn carousel-btn-prev" onClick={handlePrev}>
          <ChevronLeft size={20} />
        </button>
        <button className="carousel-btn carousel-btn-next" onClick={handleNext}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="carousel-indicators">
        {certificates.map((_, idx) => (
          <div
            key={idx}
            className={`indicator-dot ${activeIndex === idx ? 'indicator-dot-active' : ''}`}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>
    </>
  );
};
