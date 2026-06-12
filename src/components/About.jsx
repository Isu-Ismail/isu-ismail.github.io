import React from 'react';

export const About = ({ aboutText, profileImg, projectsCount }) => {
  return (
    <>
      <style>{`
        .about-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 5rem;
          align-items: center;
        }
        @media (max-width: 992px) {
          .about-layout {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
        .about-img-frame {
          aspect-ratio: 4/5;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
          position: relative;
        }
        .about-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .about-img-frame:hover .about-img {
          transform: scale(1.03);
        }
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .about-section-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          position: relative;
        }
        .about-section-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -0.5rem;
          width: 50px;
          height: 4px;
          background-color: var(--color-primary);
          border-radius: 2px;
        }
        .about-bio-text {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          text-align: justify;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .stat-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: border-color var(--transition-fast);
        }
        .stat-card:hover {
          border-color: var(--color-primary);
        }
        .stat-val {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--color-primary);
          font-family: var(--font-heading);
          display: block;
          margin-bottom: 0.25rem;
        }
        .stat-lbl {
          font-size: 0.825rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="container about-layout">
        <div className="about-left">
          <div className="about-img-frame">
            <img src={profileImg} alt="Profile" className="about-img" />
          </div>
        </div>

        <div className="about-right">
          <div className="about-content">
            <h2 className="about-section-title">About Me</h2>
            <p className="about-bio-text">{aboutText}</p>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-val">Entry</span>
                <span className="stat-lbl">Talent Ready</span>
              </div>
              <div className="stat-card">
                <span className="stat-val">{projectsCount}+</span>
                <span className="stat-lbl">Projects Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
