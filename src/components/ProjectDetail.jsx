import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ExternalLink, Calendar, GitBranch, Layers, Award,
  ChevronLeft, ChevronRight, X, Terminal, MessageSquare, Cpu, Shuffle, 
  Globe, ShieldCheck, Smartphone, Server, Database, HardDrive, BarChart2,
  UploadCloud, Download, CalendarCheck, Monitor, Shield, Grid, Settings
} from 'lucide-react';

// Map icon names from data to actual Lucide React components
const IconMapper = ({ name, size = 18 }) => {
  const icons = {
    "terminal": <Terminal size={size} />,
    "message-square": <MessageSquare size={size} />,
    "cpu": <Cpu size={size} />,
    "shuffle": <Shuffle size={size} />,
    "globe": <Globe size={size} />,
    "shield-check": <ShieldCheck size={size} />,
    "smartphone": <Smartphone size={size} />,
    "server": <Server size={size} />,
    "database": <Database size={size} />,
    "hard-drive": <HardDrive size={size} />,
    "bar-chart-2": <BarChart2 size={size} />,
    "upload-cloud": <UploadCloud size={size} />,
    "download": <Download size={size} />,
    "calendar-check": <CalendarCheck size={size} />,
    "monitor": <Monitor size={size} />,
    "shield": <Shield size={size} />,
    "grid": <Grid size={size} />
  };
  return icons[name] || <Settings size={size} />;
};

export const ProjectDetail = ({ project, details, onBack }) => {
  if (!project || !details) return null;

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Combine project images and certificate into a single list for lightbox navigation
  const allMedia = [...(details.images || [])];
  if (details.certificate) {
    allMedia.push(details.certificate);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.title]);

  // Handle lightbox keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);

  const handleCarouselNext = () => {
    setCarouselIndex((prev) => (prev === details.images.length - 1 ? 0 : prev + 1));
  };

  const handleCarouselPrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? details.images.length - 1 : prev - 1));
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 py-24 text-left w-full">
      <div className="flex justify-between items-center mb-12 pb-4 border-b border-border-color">
        <div className="inline-flex items-center gap-2 font-semibold text-text-primary hover:text-primary transition-all hover:-translate-x-1 cursor-pointer" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Projects
        </div>

        <div className="flex gap-3">
          {project.link && project.link !== '#' && (
            <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs cursor-pointer transition-all border-none outline-none bg-primary text-bg-secondary hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
              View Live <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Hero header */}
      <header className="mb-12 space-y-4 animate-fade-in">
        <div className="flex justify-between items-start flex-wrap gap-6">
          <div>
            <div className="inline-flex gap-2 mb-3 items-center">
              {project.status && (
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  project.status.toLowerCase() === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {project.status}
                </span>
              )}
              {project.duration && (
                <span className="inline-flex items-center gap-1 text-[10px] text-text-muted bg-bg-tertiary px-2 py-0.5 rounded border border-border-color">
                  <Calendar size={12} /> {project.duration}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-extrabold text-text-primary">{project.title}</h1>
          </div>

          {/* Top Verified badge if certificate exists */}
          {details.certificate && (
            <div 
              className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-primary group text-left"
              onClick={() => openLightbox(allMedia.length - 1)}
            >
              <Award size={18} className="text-primary group-hover:text-bg-secondary" />
              <div>
                <span className="text-xs font-bold block text-text-primary group-hover:text-bg-secondary">Verified Credential</span>
                <span className="text-[10px] text-primary block group-hover:text-bg-secondary/80 font-medium">View Certificate</span>
              </div>
            </div>
          )}
        </div>
        <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">{details.subtitle}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, idx) => (
            <span key={idx} className="font-mono text-xs bg-bg-secondary border border-border-color text-text-secondary px-3.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </header>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in [animation-delay:0.1s]">
        {details.metrics.map((m, idx) => (
          <div key={idx} className="bg-bg-secondary border border-border-color p-6 rounded-2xl text-center transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-lg">
            <span className="text-3xl font-extrabold text-primary font-heading block mb-1">{m.value}</span>
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider">{m.label}</span>
          </div>
        ))}
      </section>

      {/* Image Carousel */}
      {details.images && details.images.length > 0 && (
        <section className="relative rounded-3xl border border-border-color overflow-hidden bg-slate-950 mb-16 shadow-lg animate-fade-in [animation-delay:0.15s]">
          <div className="absolute top-4 right-4 bg-black/70 text-white font-mono text-xs px-2.5 py-1 rounded border border-white/10 z-10">
            {carouselIndex + 1} / {details.images.length}
          </div>

          <div 
            className="flex h-[300px] md:h-[480px] transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {details.images.map((imgUrl, idx) => (
              <div key={idx} className="min-w-full h-full relative cursor-pointer overflow-hidden flex items-center justify-center" onClick={() => openLightbox(idx)}>
                <img src={imgUrl} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-45 scale-11" alt="" />
                <img src={imgUrl} className="relative max-h-full max-w-full object-contain z-10 transition-transform duration-500 hover:scale-[1.01]" alt={`Slide ${idx + 1}`} />
              </div>
            ))}
          </div>

          {details.images.length > 1 && (
            <>
              <button className="absolute top-1/2 -translate-y-1/2 left-4 bg-black/60 border border-white/15 text-white w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-200 backdrop-blur-xs hover:bg-primary hover:border-primary" onClick={handleCarouselPrev}>
                <ChevronLeft size={20} />
              </button>
              <button className="absolute top-1/2 -translate-y-1/2 right-4 bg-black/60 border border-white/15 text-white w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-200 backdrop-blur-xs hover:bg-primary hover:border-primary" onClick={handleCarouselNext}>
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </section>
      )}

      {/* Split Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
        {/* Narratives Column */}
        <div className="space-y-12">
          {details.narratives.map((n, idx) => (
            <div key={idx} className="space-y-4 text-left">
              <h3 className="text-2xl font-bold text-text-primary mb-4 border-l-4 border-primary pl-3">{n.heading}</h3>
              {n.paragraphs && n.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-text-secondary text-base leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              {n.bullets && (
                <ul className="list-none ml-2 space-y-2.5 pb-2">
                  {n.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="relative pl-6 text-text-secondary text-sm leading-relaxed before:content-['→'] before:absolute before:left-0 before:text-primary before:font-bold" dangerouslySetInnerHTML={{ __html: b }} />
                  ))}
                </ul>
              )}
              {n.paragraphsAfter && n.paragraphsAfter.map((p, paIdx) => (
                <p key={paIdx} className="text-text-secondary text-base leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-24 space-y-8 w-full">
          {/* Deployment Architecture visual card */}
          {details.architectureNodes && (
            <div className="bg-bg-secondary border border-border-color rounded-2xl p-8 shadow-md text-left">
              <h3 className="text-lg font-bold text-text-primary mb-6 text-center border-b border-dashed border-border-color pb-3 flex items-center justify-center gap-2">
                <GitBranch size={16} className="text-primary" />
                {details.architectureTitle || 'Deployment Architecture'}
              </h3>

              <div className="flex flex-col gap-4">
                {details.architectureNodes.map((node, idx) => (
                  <React.Fragment key={idx}>
                    <div className="bg-bg-tertiary border border-border-color rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:scale-[1.02]">
                      <span className="bg-bg-secondary border border-border-color w-10 h-10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                        <IconMapper name={node.icon} />
                      </span>
                      <div className="flex-grow">
                        <div className="text-sm font-bold text-text-primary mb-0.5">{node.title}</div>
                        <div className="text-xs text-text-muted font-mono">{node.desc}</div>
                      </div>
                    </div>
                    {idx < details.architectureNodes.length - 1 && (
                      <div className="flex justify-center text-primary opacity-60 -my-1">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          {details.techSpecs && (
            <div className="bg-bg-secondary border border-border-color rounded-2xl p-8 text-left">
              <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                Technical Specifications
              </h3>
              <div className="divide-y divide-border-color">
                {details.techSpecs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm py-3 last:pb-0">
                    <span className="text-text-muted font-medium">{spec.label}</span>
                    <span className="font-mono font-semibold text-text-primary text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[300] flex items-center justify-center p-8" onClick={(e) => e.target.classList.contains('fixed') && setLightboxOpen(false)}>
          <button className="absolute top-6 right-6 bg-white/8 border-none text-white w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-red-500" onClick={() => setLightboxOpen(false)}>
            <X size={24} />
          </button>

          {allMedia.length > 1 && (
            <>
              <button className="absolute top-1/2 -translate-y-1/2 left-8 bg-white/8 border-none text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-primary" onClick={handleLightboxPrev}>
                <ChevronLeft size={24} />
              </button>
              <button className="absolute top-1/2 -translate-y-1/2 right-8 bg-white/8 border-none text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-primary" onClick={handleLightboxNext}>
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="max-w-[90%] max-h-[85%] flex items-center justify-center">
            <img 
              src={allMedia[lightboxIndex]} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              alt="Enlarged Project Media" 
            />
          </div>
        </div>
      )}
    </div>
  );
};
