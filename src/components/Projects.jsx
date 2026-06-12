import React from 'react';
import { ArrowUpRight, Calendar, Star } from 'lucide-react';

export const Projects = ({ projects, onSelectProject }) => {
  const getProjectAlias = (detailsLink) => {
    if (!detailsLink) return null;
    return detailsLink.split('/').pop().replace('.html', '');
  };

  const renderStars = (stars) => {
    if (!stars) return null;
    return (
      <div style={{ display: 'flex', gap: '0.15rem', margin: '0.5rem 0' }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            size={14}
            fill={idx < stars ? 'var(--color-primary)' : 'none'}
            color={idx < stars ? 'var(--color-primary)' : 'var(--border-color)'}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .projects-header-block {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 4rem auto;
        }
        .projects-sec-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .projects-sec-subtitle {
          color: var(--text-muted);
          font-size: 1.05rem;
        }
        .projects-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2rem;
        }
        @media (max-width: 576px) {
          .projects-grid-container {
            grid-template-columns: 1fr;
          }
        }
        .project-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          cursor: pointer;
          transition: all var(--transition-normal);
        }
        .project-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .proj-card-top {
          margin-bottom: 1.5rem;
        }
        .proj-title-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        .proj-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .proj-meta-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
          align-items: center;
        }
        .proj-duration-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }
        .proj-desc {
          color: var(--text-secondary);
          font-size: 0.925rem;
          line-height: 1.6;
          margin-top: 0.5rem;
        }
        .proj-tags-box {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: auto;
        }
        .proj-tag-pill {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
      `}</style>

      <div className="projects-header-block">
        <h2 className="projects-sec-title">Featured Projects</h2>
        <p className="projects-sec-subtitle">Architecture. Development. Industrial Automation.</p>
      </div>

      <div className="projects-grid-container">
        {projects.map((project, idx) => {
          const alias = getProjectAlias(project.detailsLink);
          
          const handleCardClick = () => {
            if (alias) {
              onSelectProject(alias);
            } else if (project.link && project.link !== '#') {
              window.open(project.link, '_blank', 'noopener,noreferrer');
            }
          };

          return (
            <div key={idx} className="project-card" onClick={handleCardClick}>
              <div className="proj-card-top">
                <div className="proj-title-bar">
                  <h3 className="proj-title">{project.title}</h3>
                  <span style={{ color: 'var(--text-muted)' }}>
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <div className="proj-meta-badges">
                  {project.status && (
                    <span className={`badge badge-${project.status.toLowerCase() === 'completed' ? 'completed' : 'in-progress'}`}>
                      {project.status}
                    </span>
                  )}
                  {project.duration && (
                    <span className="proj-duration-badge">
                      <Calendar size={10} />
                      {project.duration}
                    </span>
                  )}
                </div>

                {renderStars(project.stars)}

                <p className="proj-desc">{project.description}</p>
              </div>

              <div className="proj-tags-box">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="proj-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
