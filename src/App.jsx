import React, { useState, useEffect } from 'react';
import { data } from '../data.js';
import { projectDetailsData } from './projectDetailsData.js';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { ProjectDetail } from './components/ProjectDetail';
import { Timeline } from './components/Timeline';
import { Skills } from './components/Skills';
import { Certificates } from './components/Certificates';
import { Terminal } from './components/Terminal';
import { Mail, MapPin, Phone } from 'lucide-react';

const GithubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [view, setView] = useState({ type: 'home', projectId: null });
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Sync theme to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectProject = (projectId) => {
    setView({ type: 'detail', projectId });
  };

  const handleBackToHome = () => {
    setView({ type: 'home', projectId: null });
  };

  // Build current project for details view
  const currentProject = view.type === 'detail' 
    ? data.projects.find(p => p.detailsLink && p.detailsLink.includes(view.projectId))
    : null;

  const currentProjectDetails = view.type === 'detail' ? projectDetailsData[view.projectId] : null;

  return (
    <>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        toggleTerminal={() => setTerminalOpen(!terminalOpen)}
        currentView={view.type}
        setView={setView}
        resumeUrl={data.resume}
        githubUrl={data.contact.github}
        linkedinUrl={data.contact.linkedin}
      />

      <main style={{ minHeight: 'calc(100vh - 4.5rem - 12rem)' }}>
        {view.type === 'home' ? (
          <>
            <section id="hero">
              <Hero
                role={data.role}
                name={data.name}
                about={data.about}
                resumeUrl={data.resume}
                githubUrl={data.contact.github}
                linkedinUrl={data.contact.linkedin}
              />
            </section>

            <section id="about" className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
              <About
                aboutText={data.about}
                profileImg={data.images.profile}
                projectsCount={data.projects.length}
              />
            </section>

            <section id="projects" className="section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="container">
                <Projects
                  projects={data.projects}
                  onSelectProject={handleSelectProject}
                />
              </div>
            </section>

            <section id="education" className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="container">
                <Timeline
                  title="Education"
                  subtitle="My academic history and parameters."
                  items={data.education}
                />
              </div>
            </section>

            <section id="experience" className="section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="container">
                <Timeline
                  title="Experience"
                  subtitle="My extracurricular design and hardware simulation tasks."
                  items={data.experience}
                />
              </div>
            </section>

            {data.certificates && data.certificates.length > 0 && (
              <section id="certificates" className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="container">
                  <Certificates certificates={data.certificates} />
                </div>
              </section>
            )}

            <section id="skills" className="section" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="container">
                <Skills skills={data.skills} />
              </div>
            </section>

            <section id="contact" className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="container">
                <style>{`
                  .contact-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: 5rem;
                    align-items: start;
                  }
                  @media (max-width: 992px) {
                    .contact-grid {
                      grid-template-columns: 1fr;
                      gap: 3.5rem;
                    }
                  }
                  .contact-title-col h2 {
                    font-size: 3rem;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.02em;
                  }
                  .contact-intro-text {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    margin-bottom: 3rem;
                  }
                  .contact-info-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                  }
                  .contact-item-box {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                  }
                  .contact-icon-wrapper {
                    background-color: rgba(var(--color-primary-rgb), 0.08);
                    color: var(--color-primary);
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                  }
                  .contact-val-text {
                    font-size: 1.05rem;
                    font-weight: 500;
                    color: var(--text-primary);
                  }
                  .contact-card-box {
                    background-color: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    padding: 2.5rem;
                    border-radius: 20px;
                    box-shadow: var(--shadow-xl);
                  }
                `}</style>
                <div className="contact-grid">
                  <div className="contact-title-col">
                    <h2>Let's work together.</h2>
                    <p className="contact-intro-text">
                      I'm always open to discussing new projects, automation designs, database engineering pipelines, or smart server configurations.
                    </p>
                    <div className="contact-info-list">
                      <div className="contact-item-box">
                        <span className="contact-icon-wrapper"><Mail size={18} /></span>
                        <span className="contact-val-text">{data.contact.email}</span>
                      </div>
                      <div className="contact-item-box">
                        <span className="contact-icon-wrapper"><Phone size={18} /></span>
                        <span className="contact-val-text">{data.contact.phone}</span>
                      </div>
                      <div className="contact-item-box">
                        <span className="contact-icon-wrapper"><MapPin size={18} /></span>
                        <span className="contact-val-text">{data.contact.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="contact-card-box">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" className="form-input" placeholder="Your Name" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" className="form-input" placeholder="you@example.com" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" className="form-input" rows="4" placeholder="Tell me about your project or opportunity..." required></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <ProjectDetail
            project={currentProject}
            details={currentProjectDetails}
            onBack={handleBackToHome}
          />
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {data.contact.github && (
              <a href={data.contact.github} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                <GithubIcon size={20} />
              </a>
            )}
            {data.contact.linkedin && (
              <a href={data.contact.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                <LinkedinIcon size={20} />
              </a>
            )}
          </div>
          <p>&copy; {new Date().getFullYear()} {data.name}. All rights reserved.</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Designed with React, Vite & pnpm.</p>
        </div>
      </footer>

      <Terminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        data={data}
      />
    </>
  );
}
