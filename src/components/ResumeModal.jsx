import { useEffect, useState } from 'react';
import { X, Download, FileText, Loader } from 'lucide-react';

const CACHE_KEY = 'resume_image_b64';

/**
 * Fetches the image once, stores it as a base64 data URL in localStorage.
 * Every subsequent open reads directly from localStorage — zero network request.
 */
function useLocalStorageImage(url) {
  const [src, setSrc] = useState(() => {
    try { return localStorage.getItem(CACHE_KEY) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(!src);

  useEffect(() => {
    if (!url || src) return; // already cached — skip fetch entirely

    // `loading` already starts true whenever `src` is falsy (the only time
    // this effect body runs past the guard above), so no setState needed here.
    let cancelled = false;

    fetch(url)
      .then((res) => res.blob())
      .then((blob) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }))
      .then((dataUrl) => {
        if (cancelled) return;
        try { localStorage.setItem(CACHE_KEY, dataUrl); } catch { /* storage full */ }
        setSrc(dataUrl);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [url, src]);

  return { src, loading };
}

export const ResumeModal = ({ isOpen, onClose, resumeUrl, resumeImage }) => {
  const { src, loading } = useLocalStorageImage(resumeImage);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Programmatic download — no page navigation, no color-invert flash
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = resumeUrl;
    a.download = 'resume_ismail.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Resume Preview"
    >
      {/* Backdrop — static, no animation to avoid Chrome's backdrop-blur black-frame flash */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-border-color bg-bg-secondary shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-bg-tertiary flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/15 text-primary">
              <FileText size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-text-primary leading-none">Resume</p>
              <p className="text-xs text-text-muted mt-0.5">
                {loading ? 'Loading preview…' : 'A.M. Ismail'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-bg-secondary text-sm font-semibold hover:bg-primary-hover transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 cursor-pointer border-none outline-none"
            >
              <Download size={14} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border-color bg-bg-secondary text-text-primary hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
              aria-label="Close resume preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview body */}
        <div className="flex-1 overflow-auto bg-bg-primary/60 p-4 sm:p-6 flex items-start justify-center min-h-0">
          <div className="w-full rounded-xl overflow-hidden border border-border-color shadow-xl">
            {loading ? (
              /* First-visit skeleton loader while fetching */
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-text-muted bg-bg-secondary">
                <Loader size={32} className="animate-spin opacity-40" />
                <p className="text-sm">Loading resume preview…</p>
              </div>
            ) : src ? (
              /* Cached base64 — instant on every visit after the first */
              <img
                src={src}
                alt="Resume preview"
                className="w-full h-auto object-contain block"
                draggable={false}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-text-muted gap-4">
                <FileText size={48} className="opacity-30" />
                <p className="text-sm">No preview available — click Download PDF above.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
