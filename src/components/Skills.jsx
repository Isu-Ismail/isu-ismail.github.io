import React from 'react';
import { Cpu, Server, Layers, Settings } from 'lucide-react';

export const Skills = ({ skills }) => {
  // Categorize skills based on names
  const categories = [
    {
      title: "Systems & DevOps",
      icon: <Server size={20} />,
      items: ["Docker", "Docker Swarm", "NGINX", "Pocketbase", "Prometheus", "Grafana", "JupyterHub", "GlusterFS", "Git", "XAMPP", "FireBase"]
    },
    {
      title: "Software & Protocols",
      icon: <Cpu size={20} />,
      items: ["Python", "FastAPI", "React", "Flutter", "Arduino", "MQTT"]
    },
    {
      title: "CAD/CAE Engineering",
      icon: <Layers size={20} />,
      items: ["SolidWorks", "Creo", "NX CAD", "CATIA", "Abaqus CAE"]
    }
  ];

  // Map any remaining skills that don't fit
  const categorizedSkillNames = new Set(categories.flatMap(c => c.items));
  const otherSkills = skills.filter(s => !categorizedSkillNames.has(s));

  if (otherSkills.length > 0) {
    categories.push({
      title: "Specialized Know-how",
      icon: <Settings size={20} />,
      items: otherSkills
    });
  }

  return (
    <>
      <style>{`
        .skills-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .skills-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .skill-category-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
          transition: all var(--transition-normal);
        }
        .skill-category-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .category-title-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        .category-icon {
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(var(--color-primary-rgb), 0.08);
          padding: 0.5rem;
          border-radius: 8px;
        }
        .category-name {
          font-size: 1.25rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }
        .skills-pill-box {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .skill-pill {
          font-family: var(--font-mono);
          font-size: 0.825rem;
          font-weight: 500;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          transition: all var(--transition-fast);
        }
        .skill-pill:hover {
          background-color: rgba(var(--color-primary-rgb), 0.08);
          border-color: var(--color-primary);
          color: var(--color-primary);
          transform: scale(1.05);
        }
      `}</style>

      <div className="skills-header">
        <h2 className="skills-title">Technical Arsenal</h2>
        <p style={{ color: 'var(--text-muted)' }}>Tools and frameworks I leverage to design automation and system architectures.</p>
      </div>

      <div className="skills-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="skill-category-card">
            <div className="category-title-area">
              <span className="category-icon">{cat.icon}</span>
              <h3 className="category-name">{cat.title}</h3>
            </div>
            <div className="skills-pill-box">
              {cat.items.map((skill, sIdx) => (
                <span key={sIdx} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
