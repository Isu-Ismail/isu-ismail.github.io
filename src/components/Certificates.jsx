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
              <div className="flex-[1.1] h-[220px] md:h-full bg-slate-950 overflow-hidden relative group">
                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
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

      <div className="flex justify-center gap-2 mt-6">
        {certificates.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ${activeIndex === idx ? 'bg-primary w-6 rounded-md' : 'bg-border-color'}`}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>
    </>
  );
};
