import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Award, X, ZoomIn } from 'lucide-react';

export const Certificates = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null); // holds the cert object when open
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (lightbox) return; // pause auto-play when lightbox is open
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setActiveIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1)),
      5000
    );
    return () => resetTimeout();
  }, [activeIndex, certificates.length, lightbox]);

  // Close lightbox on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  const handleNext = () => setActiveIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));

  return (
    <>
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-4xl font-extrabold text-text-primary">Certifications</h2>
        <p className="text-text-muted text-base">Verified credentials and professional achievements.</p>
      </div>

      <div className="relative max-w-3xl mx-auto overflow-hidden rounded-2xl border border-border-color bg-bg-secondary shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-out h-[460px] md:h-[360px]"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {certificates.map((cert, idx) => (
            <div key={idx} className="min-w-full flex flex-col md:flex-row">
              {/* Image panel — object-contain so landscape certs show fully */}
              <div
                className="flex-[1.1] h-[220px] md:h-full bg-slate-950 overflow-hidden relative group cursor-zoom-in"
                onClick={() => setLightbox(cert)}
                title="Click to enlarge"
              >
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                {/* Zoom hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
                  <div className="flex items-center gap-2 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <ZoomIn size={14} /> Enlarge
                  </div>
                </div>
              </div>

              {/* Text panel */}
              <div className="flex-[0.9] p-8 md:p-10 flex flex-col justify-center bg-bg-secondary text-left">
                <span className="inline-flex items-center gap-1.5 text-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-4">
                  <Award size={14} /> Verified Credential
                </span>
                <h3 className="text-xl font-extrabold text-text-primary leading-tight mb-3">{cert.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="absolute top-1/2 -translate-y-1/2 left-4 bg-bg-secondary/70 border border-border-color text-text-primary w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-200 backdrop-blur-md hover:bg-primary hover:text-bg-secondary hover:border-primary" onClick={handlePrev}>
          <ChevronLeft size={20} />
        </button>
        <button className="absolute top-1/2 -translate-y-1/2 right-4 bg-bg-secondary/70 border border-border-color text-text-primary w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-200 backdrop-blur-md hover:bg-primary hover:text-bg-secondary hover:border-primary" onClick={handleNext}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {certificates.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === idx ? 'bg-primary w-6' : 'bg-border-color w-2'}`}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>

      {/* Lightbox modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-bg-secondary rounded-2xl border border-border-color shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-bg-tertiary border border-border-color flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-200"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>

            {/* Full certificate image */}
            <img
              src={lightbox.image}
              alt={lightbox.title}
              className="w-full h-auto max-h-[80vh] object-contain bg-slate-950"
            />

            {/* Caption */}
            <div className="px-6 py-4 flex items-center gap-2">
              <Award size={14} className="text-primary shrink-0" />
              <span className="text-text-secondary text-sm font-semibold">{lightbox.title}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
