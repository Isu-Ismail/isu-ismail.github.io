import { useEffect, useState } from 'react';
import { X, Download, FileText, Loader } from 'lucide-react';

// Plain <img src> — no fetch()-and-cache-as-base64. That approach broke once
// resumeImage became a Firebase Storage URL: fetch() needs CORS headers on
// the response to be readable cross-origin, and Storage's default config
// doesn't send them (the image still LOADS fine via <img>, which never
// needs CORS — only reading the bytes via fetch/XHR does). The browser's own
// HTTP cache already makes repeat opens fast without any of that.
function useImageLoadState(url) {
  const [prevUrl, setPrevUrl] = useState(url);
  const [status, setStatus] = useState(url ? 'loading' : 'empty'); // 'loading' | 'loaded' | 'error' | 'empty'

  // Reset synchronously during render when the url changes (React's
  // documented pattern), not via setState inside an effect.
  if (url !== prevUrl) {
    setPrevUrl(url);
    setStatus(url ? 'loading' : 'empty');
  }

  return { status, onLoad: () => setStatus('loaded'), onError: () => setStatus('error') };
}

export const ResumeModal = ({ isOpen, onClose, resumeUrl, resumeImage }) => {
  const { status, onLoad, onError } = useImageLoadState(resumeImage);
  const loading = status === 'loading';

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
            {status === 'empty' || status === 'error' ? (
              <div className="flex flex-col items-center justify-center py-24 text-text-muted gap-4">
                <FileText size={48} className="opacity-30" />
                <p className="text-sm">No preview available — click Download PDF above.</p>
              </div>
            ) : (
              <>
                {loading && (
                  <div className="flex flex-col items-center justify-center py-32 gap-4 text-text-muted bg-bg-secondary">
                    <Loader size={32} className="animate-spin opacity-40" />
                    <p className="text-sm">Loading resume preview…</p>
                  </div>
                )}
                <img
                  src={resumeImage}
                  alt="Resume preview"
                  className="w-full h-auto object-contain block"
                  style={{ display: loading ? 'none' : 'block' }}
                  draggable={false}
                  onLoad={onLoad}
                  onError={onError}
                />
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
