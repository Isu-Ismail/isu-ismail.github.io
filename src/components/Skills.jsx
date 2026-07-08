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
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-4xl font-extrabold text-text-primary">Technical Arsenal</h2>
        <p className="text-text-muted text-base">Tools and frameworks I leverage to design automation and system architectures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-bg-secondary border border-border-color rounded-2xl p-8 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-3.5 mb-6 text-text-primary text-left">
              <span className="text-primary flex items-center justify-center bg-primary/10 p-2.5 rounded-lg">{cat.icon}</span>
              <h3 className="text-lg font-bold font-heading">{cat.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2.5 text-left">
              {cat.items.map((skill, sIdx) => (
                <span key={sIdx} className="font-mono text-xs font-medium bg-bg-tertiary text-text-secondary px-3.5 py-1.5 rounded-lg border border-border-color transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:text-primary hover:scale-105 cursor-default">
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
