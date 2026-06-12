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
      setView({ type: 'home', projectId: null });
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 4.5rem;
          display: flex;
          align-items: center;
          transition: background-color var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
          border-bottom: 1px solid transparent;
        }
        .navbar-scrolled {
          background-color: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-bottom-color: var(--border-color);
          box-shadow: var(--shadow-sm);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
        }
        .logo-dot {
          color: var(--color-primary);
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        @media (max-width: 992px) {
          .nav-links-desktop {
            display: none;
          }
        }
        .nav-item-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .nav-item-link:hover {
          color: var(--color-primary);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .action-icon-btn {
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          width: 38px;
          height: 38px;
        }
        .action-icon-btn:hover {
          background-color: var(--bg-tertiary);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
        .mobile-toggle-btn {
          display: none;
        }
        @media (max-width: 992px) {
          .mobile-toggle-btn {
            display: flex;
          }
        }
        
        /* Mobile Drawer */
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 280px;
          z-index: 110;
          background-color: var(--bg-secondary);
          box-shadow: var(--shadow-xl);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transform: translateX(100%);
          transition: transform var(--transition-normal);
        }
        .mobile-drawer-open {
          transform: translateX(0);
        }
        .mobile-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 109;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(2px);
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-normal);
        }
        .mobile-drawer-overlay-active {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer-close {
          align-self: flex-end;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 1rem;
        }
        .mobile-nav-link {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .drawer-divider {
          height: 1px;
          background-color: var(--border-color);
          width: 100%;
        }
      `}</style>

      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="logo" onClick={(e) => handleNavClick(e, 'hero')}>
            Ismail<span className="logo-dot">.</span>
          </a>

          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="nav-item-link"
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <a href={resumeUrl} download className="btn btn-outline resume-btn-desktop" style={{ display: 'inline-flex', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              Resume
            </a>

            <button onClick={toggleTerminal} className="action-icon-btn" title="Open Terminal">
              <Terminal size={18} />
            </button>

            <button onClick={toggleTheme} className="action-icon-btn" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={() => setMobileMenuOpen(true)} className="action-icon-btn mobile-toggle-btn">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div 
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'mobile-drawer-overlay-active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'mobile-drawer-open' : ''}`}>
        <button className="drawer-close" onClick={() => setMobileMenuOpen(false)}>
          <X size={24} />
        </button>

        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="mobile-nav-link"
              onClick={(e) => handleNavClick(e, link.id)}
            >
              {link.label}
            </a>
          ))}
          <a href={resumeUrl} download className="mobile-nav-link" style={{ color: 'var(--color-primary)' }}>
            Download Resume
          </a>
        </div>

        <div className="drawer-divider" />

        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="action-icon-btn">
              <GithubIcon size={18} />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="action-icon-btn">
              <LinkedinIcon size={18} />
            </a>
          )}
        </div>
      </div>
    </>
  );
};
