import React from 'react';
import { Calendar } from 'lucide-react';

export const Timeline = ({ title, subtitle, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <>
      <style>{`
        .timeline-section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 4rem auto;
        }
        .timeline-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .timeline-subtitle {
          color: var(--text-muted);
          font-size: 1.05rem;
        }
        .timeline-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          padding-left: 2rem;
        }
        .timeline-container::before {
          content: '';
          position: absolute;
          left: 0.25rem;
          top: 0.5rem;
          bottom: 0.5rem;
          width: 2px;
          background-color: var(--border-color);
        }
        .timeline-item {
          position: relative;
          margin-bottom: 3rem;
        }
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -2.15rem;
          top: 0.35rem;
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          background-color: var(--color-primary);
          border: 3px solid var(--bg-primary);
          box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
          transition: background-color var(--transition-fast);
        }
        .timeline-item:hover .timeline-dot {
          background-color: var(--color-primary-hover);
          transform: scale(1.2);
        }
        .timeline-date {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }
        .timeline-heading {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        .timeline-subheading {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .timeline-desc {
          color: var(--text-muted);
          font-size: 0.925rem;
          line-height: 1.6;
        }
      `}</style>

      <div className="timeline-section-header">
        <h2 className="timeline-title">{title}</h2>
        {subtitle && <p className="timeline-subtitle">{subtitle}</p>}
      </div>

      <div className="timeline-container">
        {items.map((item, idx) => (
          <div key={idx} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-date">
              <Calendar size={12} />
              {item.period}
            </div>
            <h3 className="timeline-heading">{item.degree || item.role}</h3>
            <h4 className="timeline-subheading">{item.institution || item.company}</h4>
            {item.description && <p className="timeline-desc">{item.description}</p>}
          </div>
        ))}
      </div>
    </>
  );
};
