import { useState, useEffect } from 'react';
import { Award, X, ZoomIn } from 'lucide-react';

export const Certificates = ({ certificates }) => {
  // Hooks must run unconditionally on every render (Rules of Hooks) — the
  // empty-list guard lives below, after all hooks.
  const [lightbox, setLightbox] = useState(null); // holds the cert object when open

  // Close lightbox on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Without this, the page behind the fixed/backdrop-blur-sm lightbox stays
  // scrollable — scrolling a full-screen blur filter on every frame is the
  // same class of jank already fixed elsewhere (Navbar, carousel backdrop).
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  if (!certificates || certificates.length === 0) return null;

  return (
    <>
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-4xl font-extrabold text-text-primary">Certifications</h2>
        <p className="text-text-muted text-base">Verified credentials and professional achievements.</p>
      </div>

      {/* Static card grid — no carousel/auto-advance/transform-sliding
          track. That mechanism was the confirmed, isolated cause of the
          reported scroll flicker (A/B tested: removing the section
          entirely from the page made scrolling smooth everywhere; this
          replaces it rather than trying to patch the carousel further).
          flex-wrap + justify-center (not CSS grid) so an incomplete last
          row — e.g. 2 certs on a 3-column layout — centers instead of
          left-aligning with empty space on the right; each card gets an
          explicit width matching what a 3-col grid would give it. */}
      <div className="flex flex-wrap justify-center gap-8">
        {certificates.map((cert, idx) => (
          <div
            key={idx}
            className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] bg-bg-secondary border border-border-color rounded-2xl overflow-hidden flex flex-col text-left transition-all duration-300 hover:border-primary/60 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="p-7 flex flex-col flex-1">
              <span className="inline-flex items-center gap-1.5 text-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-4">
                <Award size={14} /> Verified Credential
              </span>
              <h3 className="text-lg font-bold text-text-primary leading-tight mb-2">{cert.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">{cert.desc}</p>
              <button
                type="button"
                onClick={() => setLightbox(cert)}
                className="inline-flex items-center justify-center gap-2 mt-5 px-4 py-2.5 rounded-full font-semibold text-xs cursor-pointer transition-all border-none outline-none bg-primary text-bg-secondary hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
              >
                <ZoomIn size={14} /> View Certificate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-lg w-full bg-bg-secondary rounded-2xl border border-border-color shadow-2xl overflow-hidden"
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
              className="w-full h-auto max-h-[50vh] object-contain bg-slate-950"
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
