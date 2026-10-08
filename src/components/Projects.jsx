import { ArrowUpRight, Calendar, Star } from 'lucide-react';

const SKELETON_COUNT = 6;

const ProjectCardSkeleton = () => (
  <div className="bg-bg-secondary border border-border-color rounded-2xl p-7 h-full animate-pulse">
    <div className="h-5 w-2/3 bg-bg-tertiary rounded mb-3" />
    <div className="flex gap-2 mb-4">
      <div className="h-4 w-16 bg-bg-tertiary rounded" />
      <div className="h-4 w-24 bg-bg-tertiary rounded" />
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-3 w-full bg-bg-tertiary rounded" />
      <div className="h-3 w-5/6 bg-bg-tertiary rounded" />
      <div className="h-3 w-3/4 bg-bg-tertiary rounded" />
    </div>
    <div className="flex gap-1.5">
      <div className="h-4 w-14 bg-bg-tertiary rounded-full" />
      <div className="h-4 w-14 bg-bg-tertiary rounded-full" />
      <div className="h-4 w-14 bg-bg-tertiary rounded-full" />
    </div>
  </div>
);

export const Projects = ({ projects, loading, onSelectProject }) => {
  const sortedProjects = [...projects].sort((a, b) => (b.stars || 0) - (a.stars || 0));

  const getProjectAlias = (project) => {
    if (!project.detailsLink) return null;
    return project.id || project.detailsLink.split('/').pop().replace('.html', '');
  };

  const renderStars = (stars) => {
    if (!stars) return null;
    return (
      <div className="flex gap-0.5 my-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            size={13}
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
        {loading && Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
          <ProjectCardSkeleton key={`skeleton-${idx}`} />
        ))}

        {!loading && sortedProjects.map((project, idx) => {
          const alias = getProjectAlias(project);

          const handleCardClick = () => {
            if (alias) {
              onSelectProject(alias);
            } else if (project.link && project.link !== '#') {
              window.open(project.link, '_blank', 'noopener,noreferrer');
            }
          };

          return (
            <div
              key={idx}
              className="group bg-bg-secondary border border-border-color rounded-2xl p-7 flex flex-col justify-between h-full cursor-pointer transition-all duration-300 hover:border-primary/60 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10"
              onClick={handleCardClick}
            >
              <div className="mb-4">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-lg font-bold text-text-primary">{project.title}</h3>
                  <span className="w-8 h-8 flex-shrink-0 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-bg-secondary group-hover:rotate-45 transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3 items-center">
                  {project.status && (
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      project.status.toLowerCase() === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-sky-500/10 text-sky-500'
                    }`}>
                      {project.status}
                    </span>
                  )}
                  {project.duration && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-text-muted bg-bg-tertiary px-2.5 py-1 rounded-full">
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
                  <span key={tIdx} className="text-[10px] font-medium text-text-muted bg-bg-tertiary px-2.5 py-1 rounded-full transition-colors group-hover:text-primary group-hover:bg-primary/10">
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
