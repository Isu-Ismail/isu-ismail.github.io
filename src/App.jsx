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
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync state view with History API pathname routing
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const match = path.match(/(?:^\/|.*\/)(projects|project)\/([^\/]+)/);
      if (match) {
        const projectId = match[2];
        if (projectId && projectDetailsData[projectId]) {
          setView({ type: 'detail', projectId });
          return;
        }
      }
      setView({ type: 'home', projectId: null });
    };

    // Run once on load
    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectProject = (projectId) => {
    const base = window.location.pathname.replace(/\/(projects|project)\/[^\/]+$/, '');
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const newPath = `${cleanBase}/projects/${projectId}`;
    window.history.pushState(null, '', newPath);
    setView({ type: 'detail', projectId });
  };

  const handleBackToHome = () => {
    const base = window.location.pathname.replace(/\/(projects|project)\/[^\/]+$/, '');
    const newPath = base === '' ? '/' : base;
    window.history.pushState(null, '', newPath);
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

      <main className="min-h-[calc(100vh-4.5rem-12rem)]">
        {view.type === 'home' ? (
          <>
            <section id="hero" className="bg-bg-primary">
              <Hero
                role={data.role}
                name={data.name}
                about={data.about}
                resumeUrl={data.resume}
                githubUrl={data.contact.github}
                linkedinUrl={data.contact.linkedin}
                data={data}
              />
            </section>

            <section id="about" className="py-24 border-t border-border-color bg-bg-secondary">
              <About
                aboutText={data.about}
                profileImg={data.images.profile}
                projectsCount={data.projects.length}
              />
            </section>

            <section id="projects" className="py-24 border-t border-border-color bg-bg-tertiary">
              <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                <Projects
                  projects={data.projects}
                  onSelectProject={handleSelectProject}
                />
              </div>
            </section>

            <section id="education" className="py-24 border-t border-border-color bg-bg-secondary">
              <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                <Timeline
                  title="Education"
                  subtitle="My academic history and parameters."
                  items={data.education}
                />
              </div>
            </section>

            <section id="experience" className="py-24 border-t border-border-color bg-bg-tertiary">
              <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                <Timeline
                  title="Experience"
                  subtitle="My extracurricular design and hardware simulation tasks."
                  items={data.experience}
                />
              </div>
            </section>

            {data.certificates && data.certificates.length > 0 && (
              <section id="certificates" className="py-24 border-t border-border-color bg-bg-secondary">
                <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                  <Certificates certificates={data.certificates} />
                </div>
              </section>
            )}

            <section id="skills" className="py-24 border-t border-border-color bg-bg-tertiary">
              <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                <Skills skills={data.skills} />
              </div>
            </section>

            <section id="contact" className="py-24 border-t border-border-color bg-bg-secondary">
              <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                  <div className="space-y-6 text-left">
                    <h2 className="text-5xl font-extrabold tracking-tight leading-none text-text-primary">Let's work together.</h2>
                    <p className="text-lg text-text-secondary">
                      I'm always open to discussing new projects, automation designs, database engineering pipelines, or smart server configurations.
                    </p>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-5">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0"><Mail size={18} /></span>
                        <span className="text-lg font-medium text-text-primary">{data.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0"><Phone size={18} /></span>
                        <span className="text-lg font-medium text-text-primary">{data.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0"><MapPin size={18} /></span>
                        <span className="text-lg font-medium text-text-primary">{data.contact.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg-secondary border border-border-color p-10 rounded-3xl shadow-xl">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-5 text-left">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-semibold text-text-secondary">Name</label>
                        <input type="text" id="name" className="w-full p-3 rounded-lg border border-border-color bg-bg-secondary text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" placeholder="Your Name" required />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-text-secondary">Email</label>
                        <input type="email" id="email" className="w-full p-3 rounded-lg border border-border-color bg-bg-secondary text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" placeholder="you@example.com" required />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="text-sm font-semibold text-text-secondary">Message</label>
                        <textarea id="message" className="w-full p-3 rounded-lg border border-border-color bg-bg-secondary text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" rows="4" placeholder="Tell me about your project or opportunity..." required></textarea>
                      </div>
                      <button type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2 p-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all border-none outline-none bg-primary text-bg-secondary hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
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

      <footer className="border-t border-border-color py-12 bg-bg-secondary text-text-muted">
        <div className="max-w-6xl mx-auto px-6 md:px-16 w-full flex flex-col items-center gap-4 text-center">
          <div className="flex gap-4">
            {data.contact.github && (
              <a href={data.contact.github} target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors">
                <GithubIcon size={20} />
              </a>
            )}
            {data.contact.linkedin && (
              <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors">
                <LinkedinIcon size={20} />
              </a>
            )}
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} {data.name}. All rights reserved.</p>
          <p className="text-xs opacity-70">Designed with React, Vite, TailwindCSS v4 & pnpm.</p>
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
