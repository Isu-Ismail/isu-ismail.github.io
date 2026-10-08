import { resolveAssetPath } from '../utils';

export const About = ({ aboutText, profileImg, projectsCount, stats }) => {
  const cards = stats && stats.length > 0 ? stats : [
    { value: 'Entry', label: 'Talent Ready' },
    { value: `${projectsCount}+`, label: 'Projects Completed' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center w-full">
      <div>
        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-border-color relative group">
          <img src={resolveAssetPath(profileImg)} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" loading="lazy" />
        </div>
      </div>

      <div className="text-left space-y-6">
        <div>
          <h2 className="text-4xl font-extrabold text-text-primary relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-1 after:bg-primary after:rounded-full">
            About Me
          </h2>
        </div>
        <p className="text-text-secondary text-base leading-relaxed text-justify">{aboutText}</p>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-bg-secondary border border-border-color rounded-2xl p-6 text-center transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-lg">
              <span className="text-3xl font-extrabold text-primary font-heading block mb-1">{card.value}</span>
              <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider">{card.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
