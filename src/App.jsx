import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { data as staticData } from '../data.js';
import { useProjects } from './hooks/useProjects';
import { useAboutMe } from './hooks/useAboutMe';
import { useImagePreload } from './hooks/useImagePreload';
import { useProjectDetails } from './hooks/useProjectDetails';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { AboutSkeleton } from './components/AboutSkeleton';
import { Projects } from './components/Projects';
import { ProjectDetailSkeleton } from './components/ProjectDetailSkeleton';
import { TimelineSkeleton } from './components/TimelineSkeleton';
import { CertificatesSkeleton, SkillsSkeleton, ContactSkeleton } from './components/SectionSkeletons';

// Code-split: ProjectDetail pulls in DOMPurify + a large icon set only ever
// needed on a project's own page — keeping it out of the home-page bundle
// visitors get on first load.
const ProjectDetail = lazy(() => import('./components/ProjectDetail').then((m) => ({ default: m.ProjectDetail })));
import { Timeline } from './components/Timeline';
import { Skills } from './components/Skills';
import { Certificates } from './components/Certificates';
import { Terminal } from './components/Terminal';
import { UnifiedBackground } from './components/UnifiedBackground';
import { Reveal } from './components/Reveal';
import { ResumeModal } from './components/ResumeModal';
import { Mail, MapPin, Phone } from 'lucide-react';

const GithubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const InstagramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

// In-memory only (NOT sessionStorage) — deliberately resets to these
// defaults on every real page load/refresh, since that's exactly the
// "always land on top" behavior wanted. Survives pure client-side SPA
// navigation (same loaded JS module) so "Back to Projects" can still
// restore where you were. goToProject() saves the scroll position and
// clears the restore flag; goBack() (in ProjectDetailLoader below, same
// module) sets the flag right before navigating back; the home-route
// effect only ever READS the flag, never resets it — resetting it inside
// the effect would be undone by React 18 StrictMode's dev-only
// double-invoke-on-mount, which runs the effect twice in the same tick.
let savedHomeScrollY = 0;
let restoreHomeScrollOnMount = false;

export default function App() {
  // Bio/contact/education/skills/resume/stats all come from one Firestore
  // doc (about/main) via useAboutMe — instant on every render (served from
  // a 5-min sessionStorage cache, or data.js, never a loading flag), with a
  // background fetch silently swapping in fresher data when the cache is
  // cold. Project cards + case-study content are a separate Firestore
  // collection (see useProjects/useProjectDetails); projects falls back to
  // data.js/projectDetailsData.js too if Firestore is disabled/unreachable.
  // The Projects section shows its own skeleton while in flight instead of
  // silently substituting the static list, so it's visibly fetching.
  const { projects, loading: projectsLoading } = useProjects();
  const { data: aboutData } = useAboutMe();
  const data = { ...aboutData, projects };

  // Staged reveal: Hero is always instant (no skeleton — see Hero's own
  // render below), About/Education/Experience/Certificates/Skills/Contact
  // all gate on one `aboutReady` flag (About's profile image finishing
  // download — the real bottleneck, since the text data is already
  // present). Projects stays independently gated (its own fetch+skeleton,
  // unchanged) since it's a genuinely separate, slower network call.
  //
  // These used to be staged further apart (Education, then Certificates+
  // Skills+Contact once Education was ready) — measured via CDP scroll
  // profiling that this caused real flicker: those extra gates meant
  // Experience/Certificates/Skills (the sections furthest down the page)
  // were the ones most likely to still be mid-skeleton-swap exactly when a
  // normal scroll first reached them, and a skeleton→content swap whose
  // height doesn't exactly match the real content shoves everything below
  // it — a one-time layout-shift cost, confirmed by profiling (dropped
  // frames only ever on a section's FIRST reveal, never on a revisit).
  // Collapsing to one gate means this swap almost always finishes within
  // ~1-2s of page load — well before a real scroll reaches that far — so
  // nothing is still swapping by the time the user gets there.
  //
  // Once ready, stays ready — a one-way latch. Without this, the
  // background cache-refresh swapping in a new (Firestore) image URL after
  // the static one already preloaded would re-trigger useImagePreload's
  // src-changed reset and flip `aboutReady` back to false, reverting every
  // section back to a skeleton — exactly the "visual reload" this staging
  // is meant to avoid.
  const aboutImageReady = useImagePreload(data.images?.profile);
  const [aboutReady, setAboutReady] = useState(false);
  // React's documented "adjust state during render" pattern (not an effect,
  // not a ref read) — a one-way latch: once true, stays true for the rest
  // of this component's lifetime.
  if (aboutImageReady && !aboutReady) {
    setAboutReady(true);
  }
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentView = location.pathname.startsWith('/projects/') ? 'detail' : 'home';

  // Explicit scroll handling, now that native scroll restoration is off
  // (see main.jsx): landing on '/' always starts at the top (Hero) UNLESS
  // `restoreHomeScrollOnMount` says this is a genuine "Back to Projects"
  // return (see the module-level comment above for why sessionStorage
  // wouldn't work here — it can't distinguish that from a plain refresh).
  useEffect(() => {
    if (location.pathname !== '/') return;
    window.scrollTo(0, restoreHomeScrollOnMount ? savedHomeScrollY : 0);
  }, [location.pathname]);

  const goToProject = (projectId) => {
    savedHomeScrollY = window.scrollY;
    restoreHomeScrollOnMount = false; // clear any stale pending-restore from a previous visit
    navigate(`/projects/${projectId}`);
  };

  // Contact form state and Formspree submission
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sendState, setSendState] = useState('idle'); // idle | sending | sent | error

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendState('sending');

    try {
      const res = await fetch('https://formspree.io/f/mkjndljz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name.trim(),
          email: contactForm.email.trim(),
          message: contactForm.message.trim(),
        }),
      });

      if (res.ok) {
        setSendState('sent');
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setSendState('idle'), 4000);
      } else {
        setSendState('error');
        setTimeout(() => setSendState('idle'), 4000);
      }
    } catch {
      setSendState('error');
      setTimeout(() => setSendState('idle'), 4000);
    }
  };

  return (
    <>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        toggleTerminal={() => setTerminalOpen(!terminalOpen)}
        currentView={currentView}
        githubUrl={data.contact.github}
        linkedinUrl={data.contact.linkedin}
        instagramUrl={data.contact.instagram}
        onViewResume={() => setResumeModalOpen(true)}
      />

      <main className="min-h-[calc(100vh-4.5rem-12rem)] relative">
        <UnifiedBackground />
        <Routes>
          <Route path="/" element={
            <div className="relative z-10">
              <section id="hero">
                <Hero
                  role={data.role}
                  name={data.name}
                  githubUrl={data.contact.github}
                  linkedinUrl={data.contact.linkedin}
                  instagramUrl={data.contact.instagram}
                  data={data}
                  onViewResume={() => setResumeModalOpen(true)}
                />
              </section>

              <Reveal as="section" id="about" className="py-24 border-t border-border-color/50 bg-bg-secondary/40">
                {aboutReady ? (
                  <About
                    aboutText={data.about}
                    profileImg={data.images.profile}
                    projectsCount={projectsLoading ? staticData.projects.length : data.projects.length}
                    stats={data.stats}
                  />
                ) : (
                  <AboutSkeleton />
                )}
              </Reveal>

              <Reveal as="section" id="projects" className="py-24 border-t border-border-color/50 bg-bg-tertiary/40">
                <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                  <Projects
                    projects={data.projects}
                    loading={projectsLoading}
                    onSelectProject={goToProject}
                  />
                </div>
              </Reveal>

              <Reveal as="section" id="education" className="py-24 border-t border-border-color/50 bg-bg-secondary/40">
                <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                  {aboutReady ? (
                    <Timeline
                      title="Education"
                      subtitle="My academic history and parameters."
                      items={data.education}
                    />
                  ) : (
                    <TimelineSkeleton rows={2} />
                  )}
                </div>
              </Reveal>

              <Reveal as="section" id="experience" className="py-24 border-t border-border-color/50 bg-bg-tertiary/40">
                <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                  {aboutReady ? (
                    <Timeline
                      title="Experience"
                      subtitle="My extracurricular design and hardware simulation tasks."
                      items={data.experience}
                    />
                  ) : (
                    <TimelineSkeleton rows={2} />
                  )}
                </div>
              </Reveal>

              {(!aboutReady || (data.certificates && data.certificates.length > 0)) && (
                <Reveal as="section" id="certificates" className="py-24 border-t border-border-color/50 bg-bg-secondary/40">
                  <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                    {aboutReady ? <Certificates certificates={data.certificates} /> : <CertificatesSkeleton />}
                  </div>
                </Reveal>
              )}

              <Reveal as="section" id="skills" className="py-24 border-t border-border-color/50 bg-bg-tertiary/40">
                <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                  {aboutReady ? <Skills skills={data.skills} /> : <SkillsSkeleton />}
                </div>
              </Reveal>

              <Reveal as="section" id="contact" className="py-24 border-t border-border-color/50 bg-bg-secondary/40">
                <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
                  {!aboutReady ? <ContactSkeleton /> : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div className="space-y-6 text-left">
                      <h2 className="text-5xl font-extrabold tracking-tight leading-none text-text-primary">Let's work together.</h2>
                      <p className="text-lg text-text-secondary">
                        I'm always open to discussing new projects, automation designs, database engineering pipelines, or smart server configurations.
                      </p>
                      <div className="flex flex-col gap-6">
                        <a href={`mailto:${data.contact.email}`} className="flex items-center gap-5 group text-inherit hover:text-primary transition-colors">
                          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0 group-hover:scale-110 transition-transform"><Mail size={18} /></span>
                          <span className="text-lg font-medium text-text-primary group-hover:text-primary transition-colors">{data.contact.email}</span>
                        </a>
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

                    <div className="bg-bg-secondary/90 border border-border-color p-10 rounded-3xl shadow-xl">
                      <form onSubmit={handleContactSubmit} className="space-y-5 text-left">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="name" className="text-sm font-semibold text-text-secondary">Name</label>
                          <input 
                            type="text" 
                            id="name" 
                            name="name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full p-3 rounded-lg border border-border-color bg-bg-secondary text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" 
                            placeholder="Your Name" 
                            required 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="email" className="text-sm font-semibold text-text-secondary">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full p-3 rounded-lg border border-border-color bg-bg-secondary text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" 
                            placeholder="you@example.com" 
                            required 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="message" className="text-sm font-semibold text-text-secondary">Message</label>
                          <textarea 
                            id="message" 
                            name="message"
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            className="w-full p-3 rounded-lg border border-border-color bg-bg-secondary text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" 
                            rows="4" 
                            placeholder="Tell me about your project or opportunity..." 
                            required
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          disabled={sendState !== 'idle'}
                          className={`w-full mt-2 inline-flex items-center justify-center gap-2 p-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all border-none outline-none
                            ${sendState === 'sent'
                              ? 'bg-emerald-500 text-white scale-95'
                              : sendState === 'error'
                              ? 'bg-red-500 text-white scale-95'
                              : sendState === 'sending'
                              ? 'bg-primary/70 text-bg-secondary cursor-not-allowed'
                              : 'bg-primary text-bg-secondary hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30'
                            }`}
                        >
                          {sendState === 'sending' && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                          )}
                          {sendState === 'sent' && <span>✓</span>}
                          {sendState === 'error' && <span>✕</span>}
                          {sendState === 'sending' ? 'Sending…' : sendState === 'sent' ? 'Message Sent!' : sendState === 'error' ? 'Failed — Try Again' : 'Send Message'}
                        </button>
                      </form>
                    </div>
                  </div>
                  )}
                </div>
              </Reveal>
            </div>
          } />
          <Route path="/projects/:projectId" element={<ProjectDetailWrapper />} />
        </Routes>
      </main>

      <footer className="border-t border-border-color py-12 bg-bg-secondary text-text-muted">
        <div className="max-w-6xl mx-auto px-6 md:px-16 w-full flex flex-col items-center gap-4 text-center">
          <div className="flex gap-4">
            {data.contact.github && (
              <a href={data.contact.github} target="_blank" rel="noreferrer" title="GitHub" className="text-text-muted hover:text-primary transition-colors">
                <GithubIcon size={20} />
              </a>
            )}
            {data.contact.linkedin && (
              <a href={data.contact.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="text-text-muted hover:text-primary transition-colors">
                <LinkedinIcon size={20} />
              </a>
            )}
            {data.contact.instagram && (
              <a href={data.contact.instagram.startsWith('http') ? data.contact.instagram : `https://instagram.com/${data.contact.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" title="Instagram" className="text-text-muted hover:text-primary transition-colors">
                <InstagramIcon size={20} />
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

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        resumeUrl={data.resume}
        resumeImage={data.images.resume_image}
      />
    </>
  );
}

// Wrapper component to feed URL parameters into the ProjectDetail component.
// Keying the inner component by projectId forces a remount (not just a
// re-render) when navigating directly between two project pages, so
// useProjectDetails' loading state resets and the skeleton shows again
// instead of the previous project's content lingering.
function ProjectDetailWrapper() {
  const { projectId } = useParams();
  return <ProjectDetailLoader key={projectId} projectId={projectId} />;
}

function ProjectDetailLoader({ projectId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { project, details, loading, source } = useProjectDetails(projectId);

  // Reset scroll immediately on navigating to a (new) project page — this
  // component remounts per projectId (keyed above), so this fires right
  // away for the skeleton too, instead of waiting for real content to mount.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Go back with real browser history (not a fresh push) whenever this entry
  // was reached via in-app navigation (location.key is 'default' only for a
  // direct/deep link with no prior SPA history). Native scroll restoration
  // is disabled globally (see main.jsx), so explicitly flag that the home
  // route's effect should restore its saved scroll position instead of
  // going to top — see the module-level comment near the top of this file.
  const goBack = () => {
    restoreHomeScrollOnMount = true;
    if (location.key !== 'default') navigate(-1);
    else navigate('/');
  };

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (!project || !details) {
    return (
      <div className="py-32 text-center text-text-primary text-xl relative z-10">
        <p className="mb-4">Project not found.</p>
        <button onClick={goBack} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all border-none bg-primary text-bg-secondary hover:bg-primary-hover">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetail
        project={project}
        details={details}
        onBack={goBack}
        animate={source !== 'cache'}
      />
    </Suspense>
  );
}
