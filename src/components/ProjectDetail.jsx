import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ExternalLink, Calendar, GitBranch, Layers, Award, Maximize2, 
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
    <>
      <style>{`
        .detail-page-wrapper {
          padding-top: 6rem;
          padding-bottom: 6rem;
        }
        .detail-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        .back-btn-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
        }
        .back-btn-link:hover {
          color: var(--color-primary);
          transform: translateX(-4px);
        }
        
        /* Hero Section */
        .det-hero-header {
          margin-bottom: 3rem;
        }
        .det-hero-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }
        .det-title {
          font-size: 2.75rem;
          font-weight: 800;
        }
        .det-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          max-width: 850px;
        }
        .det-tags-box {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .det-tag {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.3rem 0.8rem;
          border-radius: 9999px;
        }

        /* Metrics Grid */
        .det-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }
        .det-metric-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          transition: all var(--transition-fast);
        }
        .det-metric-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-3px);
        }
        .det-metric-val {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-primary);
          font-family: var(--font-heading);
          display: block;
          margin-bottom: 0.25rem;
        }
        .det-metric-lbl {
          font-size: 0.825rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Gallery Section */
        .det-gallery-section {
          position: relative;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          background-color: #0b0f19;
          margin-bottom: 4rem;
          box-shadow: var(--shadow-lg);
        }
        .det-gallery-track {
          display: flex;
          height: 480px;
          transition: transform var(--transition-slow);
        }
        @media (max-width: 768px) {
          .det-gallery-track {
            height: 300px;
          }
        }
        .det-gallery-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .det-slide-blur {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(15px);
          opacity: 0.45;
          transform: scale(1.1);
        }
        .det-slide-img {
          position: relative;
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          z-index: 2;
          transition: transform var(--transition-slow);
        }
        .det-gallery-slide:hover .det-slide-img {
          transform: scale(1.02);
        }
        .det-gallery-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          transition: all var(--transition-fast);
          backdrop-filter: blur(4px);
        }
        .det-gallery-btn:hover {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
        }
        .det-gallery-btn-prev { left: 1rem; }
        .det-gallery-btn-next { right: 1rem; }

        .det-gallery-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(15, 23, 42, 0.7);
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 5;
        }

        /* Layout Grid details */
        .det-layout-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: start;
        }
        @media (max-width: 992px) {
          .det-layout-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        /* Narratives Column */
        .narrative-item {
          margin-bottom: 3rem;
        }
        .narrative-item h3 {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: var(--text-primary);
          border-left: 4px solid var(--color-primary);
          padding-left: 0.75rem;
        }
        .narrative-item p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin-bottom: 1.25rem;
          line-height: 1.7;
          text-align: justify;
        }
        .narrative-item ul {
          list-style-type: none;
          margin-left: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .narrative-item li {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 0.85rem;
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
        }
        .narrative-item li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: bold;
        }

        /* Visual Sidebar */
        .sidebar-sticky {
          position: sticky;
          top: 6.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        /* Architecture Visualizer styling */
        .visual-arch-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
        }
        .visual-arch-title {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-align: center;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .visual-arch-flow {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .visual-arch-node {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.9rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all var(--transition-fast);
        }
        .visual-arch-node:hover {
          border-color: var(--color-primary);
          background-color: rgba(var(--color-primary-rgb), 0.04);
          transform: scale(1.02);
        }
        .visual-arch-icon {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          flex-shrink: 0;
        }
        .visual-arch-details {
          flex-grow: 1;
        }
        .visual-arch-node-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.15rem;
        }
        .visual-arch-node-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .visual-arch-arrow {
          display: flex;
          justify-content: center;
          color: var(--color-primary);
          opacity: 0.6;
          margin: -0.25rem 0;
        }

        /* Tech Specs Box */
        .specs-sidebar-box {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2rem;
        }
        .specs-sidebar-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .spec-sidebar-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid var(--border-color);
        }
        .spec-sidebar-item:last-child {
          border-bottom: none;
        }
        .spec-sidebar-name {
          color: var(--text-muted);
          font-weight: 500;
        }
        .spec-sidebar-val {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--text-primary);
          text-align: right;
        }

        /* Verified Badge Button */
        .badge-verified-btn {
          background-color: rgba(var(--color-primary-rgb), 0.08);
          border: 1px solid rgba(var(--color-primary-rgb), 0.2);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .badge-verified-btn:hover {
          background-color: var(--color-primary);
          color: #ffffff;
        }
        .badge-verified-btn:hover .badge-verified-lbl {
          color: #ffffff;
        }
        .badge-verified-title {
          font-size: 0.85rem;
          font-weight: 700;
          display: block;
        }
        .badge-verified-lbl {
          font-size: 0.75rem;
          color: var(--color-primary);
          display: block;
        }

        /* Lightbox Overlay */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(7, 10, 19, 0.95);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .lightbox-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        .lightbox-close-btn:hover {
          background-color: #f85149;
        }
        .lightbox-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #ffffff;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        .lightbox-nav-btn:hover {
          background-color: var(--color-primary);
        }
        .lightbox-btn-prev-pos { left: 2rem; }
        .lightbox-btn-next-pos { right: 2rem; }
        
        .lightbox-img-box {
          max-width: 90%;
          max-height: 85%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-img-element {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
      `}</style>

      <div className="container detail-page-wrapper">
        <div className="detail-nav">
          <div className="back-btn-link" onClick={onBack}>
            <ArrowLeft size={18} /> Back to Projects
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {project.link && project.link !== '#' && (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                View Live <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Hero header */}
        <header className="det-hero-header animate-fade-in">
          <div className="det-hero-title-row">
            <div>
              <div style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {project.status && (
                  <span className={`badge badge-${project.status.toLowerCase() === 'completed' ? 'completed' : 'in-progress'}`}>
                    {project.status}
                  </span>
                )}
                {project.duration && (
                  <span className="det-tag" style={{ border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                    <Calendar size={12} /> {project.duration}
                  </span>
                )}
              </div>
              <h1 className="det-title">{project.title}</h1>
            </div>

            {/* Top Verified badge if certificate exists */}
            {details.certificate && (
              <div 
                className="badge-verified-btn"
                onClick={() => openLightbox(allMedia.length - 1)}
              >
                <Award size={18} />
                <div>
                  <span className="badge-verified-title">Verified Credential</span>
                  <span className="badge-verified-lbl">View Certificate</span>
                </div>
              </div>
            )}
          </div>
          <p className="det-subtitle">{details.subtitle}</p>
          <div className="det-tags-box">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="det-tag">{tag}</span>
            ))}
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="det-metrics-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {details.metrics.map((m, idx) => (
            <div key={idx} className="det-metric-card">
              <span className="det-metric-val">{m.value}</span>
              <span className="det-metric-lbl">{m.label}</span>
            </div>
          ))}
        </section>

        {/* Image Carousel */}
        {details.images && details.images.length > 0 && (
          <section className="det-gallery-section animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="det-gallery-badge">
              {carouselIndex + 1} / {details.images.length}
            </div>

            <div 
              className="det-gallery-track"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {details.images.map((imgUrl, idx) => (
                <div key={idx} className="det-gallery-slide" onClick={() => openLightbox(idx)}>
                  <img src={imgUrl} className="det-slide-blur" alt="" />
                  <img src={imgUrl} className="det-slide-img" alt={`Slide ${idx + 1}`} />
                </div>
              ))}
            </div>

            {details.images.length > 1 && (
              <>
                <button className="det-gallery-btn det-gallery-btn-prev" onClick={handleCarouselPrev}>
                  <ChevronLeft size={20} />
                </button>
                <button className="det-gallery-btn det-gallery-btn-next" onClick={handleCarouselNext}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </section>
        )}

        {/* Split Content Grid */}
        <div className="det-layout-grid">
          {/* Narratives Column */}
          <div className="det-narratives-col">
            {details.narratives.map((n, idx) => (
              <div key={idx} className="narrative-item">
                <h3>{n.heading}</h3>
                {n.paragraphs && n.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
                {n.bullets && (
                  <ul>
                    {n.bullets.map((b, bIdx) => (
                      <li key={bIdx} dangerouslySetInnerHTML={{ __html: b }} />
                    ))}
                  </ul>
                )}
                {n.paragraphsAfter && n.paragraphsAfter.map((p, paIdx) => (
                  <p key={paIdx} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="det-sidebar-col">
            <div className="sidebar-sticky">
              {/* Deployment Architecture visual card */}
              {details.architectureNodes && (
                <div className="visual-arch-card">
                  <h3 className="visual-arch-title">
                    <GitBranch size={16} style={{ color: 'var(--color-primary)' }} />
                    {details.architectureTitle || 'Deployment Architecture'}
                  </h3>

                  <div className="visual-arch-flow">
                    {details.architectureNodes.map((node, idx) => (
                      <React.Fragment key={idx}>
                        <div className="visual-arch-node">
                          <span className="visual-arch-icon">
                            <IconMapper name={node.icon} />
                          </span>
                          <div className="visual-arch-details">
                            <div className="visual-arch-node-title">{node.title}</div>
                            <div className="visual-arch-node-desc">{node.desc}</div>
                          </div>
                        </div>
                        {idx < details.architectureNodes.length - 1 && (
                          <div className="visual-arch-arrow">
                            <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {details.techSpecs && (
                <div className="specs-sidebar-box">
                  <h3 className="specs-sidebar-title">
                    <Layers size={16} style={{ color: 'var(--color-primary)' }} />
                    Technical Specifications
                  </h3>
                  {details.techSpecs.map((spec, idx) => (
                    <div key={idx} className="spec-sidebar-item">
                      <span className="spec-sidebar-name">{spec.label}</span>
                      <span className="spec-sidebar-val">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal overlay */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={(e) => e.target.classList.contains('lightbox-overlay') && setLightboxOpen(false)}>
          <button className="lightbox-close-btn" onClick={() => setLightboxOpen(false)}>
            <X size={24} />
          </button>

          {allMedia.length > 1 && (
            <>
              <button className="lightbox-nav-btn lightbox-btn-prev-pos" onClick={handleLightboxPrev}>
                <ChevronLeft size={24} />
              </button>
              <button className="lightbox-nav-btn lightbox-btn-next-pos" onClick={handleLightboxNext}>
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="lightbox-img-box">
            <img 
              src={allMedia[lightboxIndex]} 
              className="lightbox-img-element" 
              alt="Enlarged Project Media" 
            />
          </div>
        </div>
      )}
    </>
  );
};
