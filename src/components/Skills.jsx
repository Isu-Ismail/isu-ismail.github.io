import { Cpu, Server, Layers, Settings, Database, Terminal, Shield } from 'lucide-react';
import { slugifyTitle } from '../utils';

const getCategoryIcon = (title = '') => {
  const lower = title.toLowerCase();
  if (lower.includes('devops') || lower.includes('server') || lower.includes('cloud') || lower.includes('system') || lower.includes('infra')) {
    return <Server size={20} />;
  }
  if (lower.includes('software') || lower.includes('protocol') || lower.includes('code') || lower.includes('program') || lower.includes('app')) {
    return <Cpu size={20} />;
  }
  if (lower.includes('cad') || lower.includes('cae') || lower.includes('design') || lower.includes('mechanical') || lower.includes('layer') || lower.includes('model')) {
    return <Layers size={20} />;
  }
  if (lower.includes('data') || lower.includes('database') || lower.includes('sql') || lower.includes('storage')) {
    return <Database size={20} />;
  }
  if (lower.includes('terminal') || lower.includes('cli') || lower.includes('shell')) {
    return <Terminal size={20} />;
  }
  if (lower.includes('security') || lower.includes('auth')) {
    return <Shield size={20} />;
  }
  return <Settings size={20} />;
};

export const Skills = ({ skills = [], skillCards = [] }) => {
  // Dynamically resolve categories from Firebase skillCards
  let categories = [];

  if (Array.isArray(skillCards) && skillCards.length > 0) {
    categories = skillCards.map((card) => ({
      title: card.title || 'Technical Skills',
      icon: getCategoryIcon(card.title),
      items: Array.isArray(card.items) ? card.items : []
    }));
  } else if (Array.isArray(skills) && skills.length > 0) {
    // Fallback if only a flat array of skills exists
    categories = [
      {
        title: "Technical Skills",
        icon: <Cpu size={20} />,
        items: skills
      }
    ];
  }

  return (
    <>
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-4xl font-extrabold text-text-primary">Technical Arsenal</h2>
        <p className="text-text-muted text-base font-mono">$ ls -la ~/arsenal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="relative bg-bg-secondary border border-border-color rounded-lg overflow-hidden transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl corner-brackets">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border-color bg-bg-tertiary/60">
              <div className="window-dots">
                <span /><span /><span />
              </div>
              <span className="font-mono text-[10px] text-text-muted truncate">arsenal/{slugifyTitle(cat.title)}</span>
            </div>

            <div className="p-7">
              <div className="flex items-center gap-3.5 mb-6 text-text-primary text-left">
                <span className="text-primary flex items-center justify-center bg-primary/10 p-2.5 rounded-lg">{cat.icon}</span>
                <h3 className="text-lg font-bold font-heading">{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2.5 text-left">
                {cat.items.map((skill, sIdx) => (
                  <span key={sIdx} className="font-mono text-xs font-medium bg-bg-tertiary text-text-secondary px-3.5 py-1.5 rounded-md border border-border-color transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:text-primary hover:scale-105 cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
