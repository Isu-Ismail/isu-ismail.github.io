import React from 'react';
import { Calendar } from 'lucide-react';

export const Timeline = ({ title, subtitle, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <>
      <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
        <h2 className="text-4xl font-extrabold text-text-primary">{title}</h2>
        {subtitle && <p className="text-text-muted text-base">{subtitle}</p>}
      </div>

      <div className="relative max-w-2xl mx-auto pl-8 border-l border-border-color space-y-12 text-left">
        {items.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-[40px] top-1 w-[15px] h-[15px] rounded-full bg-primary border-4 border-bg-primary shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.15)] transition-all duration-300 group-hover:scale-125 group-hover:bg-primary-hover" />
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-text-muted bg-bg-tertiary px-2.5 py-0.5 rounded border border-border-color mb-3 font-semibold">
              <Calendar size={12} />
              {item.period}
            </div>
            <h3 className="text-xl font-extrabold text-text-primary mb-1">{item.degree || item.role}</h3>
            <h4 className="text-sm font-semibold text-text-secondary mb-3">{item.institution || item.company}</h4>
            {item.description && <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>}
          </div>
        ))}
      </div>
    </>
  );
};
