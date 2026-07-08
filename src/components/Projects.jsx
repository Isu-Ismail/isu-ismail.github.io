import React from 'react';
import { ArrowUpRight, Calendar, Star } from 'lucide-react';

export const Projects = ({ projects, onSelectProject }) => {
  const sortedProjects = [...projects].sort((a, b) => (b.stars || 0) - (a.stars || 0));

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
      <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
        <h2 className="text-4xl font-extrabold text-text-primary">Featured Projects</h2>
        <p className="text-text-muted text-base">Architecture. Development. Industrial Automation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedProjects.map((project, idx) => {
          const alias = getProjectAlias(project.detailsLink);
          
          const handleCardClick = () => {
            if (alias) {
              onSelectProject(alias);
            } else if (project.link && project.link !== '#') {
              window.open(project.link, '_blank', 'noopener,noreferrer');
            }
          };

          return (
            <div key={idx} className="bg-bg-secondary border border-border-color rounded-2xl p-8 flex flex-col justify-between h-full cursor-pointer transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl" onClick={handleCardClick}>
              <div className="mb-4">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-lg font-bold text-text-primary">{project.title}</h3>
                  <span className="text-text-muted hover:text-primary transition-colors">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3 items-center">
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
                      <Calendar size={10} />
                      {project.duration}
                    </span>
                  )}
                </div>

                {renderStars(project.stars)}

                <p className="text-text-secondary text-sm leading-relaxed mt-2">{project.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="font-mono text-[10px] text-text-muted bg-bg-tertiary px-2 py-0.5 rounded">
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
