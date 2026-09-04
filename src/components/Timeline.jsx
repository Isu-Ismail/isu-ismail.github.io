import React, { useState, useEffect } from 'react';
import { Calendar, X, Award, ExternalLink } from 'lucide-react';
import { resolveAssetPath } from '../utils';

export const Timeline = ({ title, subtitle, items }) => {
  const [activeCert, setActiveCert] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    if (!activeCert) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCert]);

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
        <h2 className="text-4xl font-extrabold text-text-primary">{title}</h2>
        {subtitle && <p className="text-text-muted text-base">{subtitle}</p>}
      </div>

      <div className="relative max-w-2xl mx-auto pl-8 border-l border-border-color space-y-12 text-left">
        {items.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-10 top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-bg-primary shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.15)] transition-all duration-300 group-hover:scale-125 group-hover:bg-primary-hover" />
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-text-muted bg-bg-tertiary px-2.5 py-0.5 rounded border border-border-color mb-3 font-semibold">
              <Calendar size={12} />
              {item.period}
            </div>
            <h3 className="text-xl font-extrabold text-text-primary mb-1">{item.degree || item.role}</h3>
            <h4 className="text-sm font-semibold text-text-secondary mb-3">{item.institution || item.company}</h4>
            {item.description && <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>}
            {item.certificateLink && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveCert({
                      title: item.company ? `${item.role} - ${item.company}` : (item.role || item.degree),
                      subtitle: item.period,
                      image: resolveAssetPath(item.certificateLink),
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors"
                >
                  <Award size={14} />
                  View Certificate →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Certificate Modal Popup */}
      {activeCert && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in"
          onClick={() => setActiveCert(null)}
        >
          <div 
            className="relative bg-bg-secondary border border-border-color rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-bg-tertiary">
              <div>
                <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Award size={16} className="text-primary" />
                  {activeCert.title}
                </h4>
                {activeCert.subtitle && (
                  <span className="text-xs text-text-muted font-mono">{activeCert.subtitle}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activeCert.image}
                  target="_blank"
                  rel="noreferrer"
                  title="Open in new tab"
                  className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-bg-secondary"
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  title="Close (Esc)"
                  className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-bg-secondary cursor-pointer border-none bg-transparent"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body with Certificate Image */}
            <div className="p-4 sm:p-6 flex items-center justify-center overflow-auto bg-black/20">
              <img 
                src={activeCert.image} 
                alt={activeCert.title} 
                className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
