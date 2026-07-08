import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Terminal } from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export const Navbar = ({ theme, toggleTheme, toggleTerminal, currentView, setView, resumeUrl, githubUrl, linkedinUrl }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      const base = window.location.pathname.replace(/\/(projects|project)\/[^\/]+$/, '');
      const newPath = base === '' ? '/' : base;
      window.history.pushState(null, '', newPath);
      window.dispatchEvent(new Event('popstate'));
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Education', id: 'education' },
    { label: 'Experience', id: 'experience' },
    { label: 'Certificates', id: 'certificates' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 border-b border-transparent ${scrolled ? 'bg-bg-secondary/70 backdrop-blur-md border-border-color shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <a href="#" className="font-heading text-2xl font-extrabold tracking-tight flex items-center text-text-primary" onClick={(e) => handleNavClick(e, 'hero')}>
            Ismail<span className="text-primary">.</span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200"
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href={resumeUrl} download className="hidden sm:inline-flex items-center justify-center px-5 py-2 border border-border-color bg-bg-secondary text-text-primary hover:text-primary hover:border-primary rounded-full text-sm font-semibold transition-all duration-200 shadow-sm">
              Resume
            </a>

            <button onClick={toggleTerminal} className="flex items-center justify-center w-10 h-10 rounded-full border border-border-color bg-bg-secondary text-text-primary hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer shadow-sm" title="Open Terminal">
              <Terminal size={18} />
            </button>

            <button onClick={toggleTheme} className="flex items-center justify-center w-10 h-10 rounded-full border border-border-color bg-bg-secondary text-text-primary hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer shadow-sm" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={() => setMobileMenuOpen(true)} className="flex lg:hidden items-center justify-center w-10 h-10 rounded-full border border-border-color bg-bg-secondary text-text-primary hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer shadow-sm">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-[109] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-[280px] z-[110] bg-bg-secondary shadow-2xl p-8 flex flex-col gap-6 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button className="self-end text-text-primary hover:text-primary transition-colors cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
          <X size={24} />
        </button>

        <div className="flex flex-col gap-5 mt-4 text-left">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-lg font-bold text-text-primary hover:text-primary transition-colors"
              onClick={(e) => handleNavClick(e, link.id)}
            >
              {link.label}
            </a>
          ))}
          <a href={resumeUrl} download className="text-lg font-bold text-primary hover:underline">
            Download Resume
          </a>
        </div>

        <div className="h-[1px] bg-border-color w-full" />

        <div className="flex gap-4 justify-center">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full border border-border-color bg-bg-secondary text-text-primary hover:text-primary hover:border-primary transition-all duration-200">
              <GithubIcon size={18} />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full border border-border-color bg-bg-secondary text-text-primary hover:text-primary hover:border-primary transition-all duration-200">
              <LinkedinIcon size={18} />
            </a>
          )}
        </div>
      </div>
    </>
  );
};
