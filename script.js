import { data } from './data.js';

// Initialize Lucide Icons
const initIcons = () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
};

// --- NEW FUNCTION: Update Resume Links in Nav ---
const updateResumeLinks = () => {
    const resumeLinks = document.querySelectorAll('.resume-link');
    resumeLinks.forEach(link => {
        link.href = data.resume;
        link.setAttribute('download', ''); // Force download
    });
};

const renderHero = () => {
    const hero = document.getElementById('hero');
    
    // 1. Get the Default Game
    let defaultGameName = "";
    let defaultGameUrl = "";
    
    if (Array.isArray(data.gamePath) && data.gamePath.length > 0) {
        const firstGame = data.gamePath[0];
        defaultGameName = Object.keys(firstGame)[0];
        defaultGameUrl = Object.values(firstGame)[0];
    }

    // 2. Build the Dropdown Options
    let optionsHTML = "";
    if (Array.isArray(data.gamePath)) {
        data.gamePath.forEach((gameObj, index) => {
            const name = Object.keys(gameObj)[0];
            const url = Object.values(gameObj)[0];
            optionsHTML += `<option value="${url}">${name}</option>`;
        });
    }

    // 3. Render
    hero.innerHTML = `
        <style>
            .hero-split-layout {
                display: grid;
                /* CHANGED: 1fr for text, 0.85fr for game (makes game narrower) */
                grid-template-columns: 1fr 0.85fr; 
                gap: 4rem; /* Increased gap to separate them nicely */
                align-items: center;
                padding: 2rem 0;
            }

            @media (max-width: 900px) {
                .hero-split-layout {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }
            }

            .hero-game-card {
                background: #0f0f0f;
                border: 1px solid #333;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                
                /* CHANGED: Increased height from 480px to 600px */
                min-height: 550px; 
                height: 100%;
                position: relative;
            }

            .game-card-header {
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-bottom: 1px solid #333;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .game-frame {
                width: 100%;
                flex-grow: 1;
                border: none;
            }
        </style>

        <div class="container hero-split-layout">
            
            <div class="hero-text fade-in-up">
                <span style="color: var(--primary); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.875rem; display:block; margin-bottom: 1rem;">
                    ${data.role}
                </span>
                <h1 style="font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem;">
                    Hello, I'm <br />
                    <span style="color: var(--primary)">${data.name.split(" ")[1]}</span>.
                </h1>
                <p style="font-size: 1.125rem; margin-bottom: 2rem; opacity: 0.8; max-width: 500px;">
                    ${data.about.substring(0, 100)}...
                </p>
                
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem;">
                    <a href="#projects" class="btn btn-primary">
                        View Projects <i data-lucide="arrow-right"></i>
                    </a>
                    <a href="${data.resume}" download class="btn btn-outline">
                        Resume <i data-lucide="download"></i>
                    </a>
                </div>

                <div style="display: flex; gap: 1.5rem;">
                    ${data.contact.github ? `<a href="${data.contact.github}" target="_blank"><i data-lucide="github"></i></a>` : ''}
                    ${data.contact.linkedin ? `<a href="${data.contact.linkedin}" target="_blank"><i data-lucide="linkedin"></i></a>` : ''}
                    <a href="mailto:${data.contact.email}"><i data-lucide="mail"></i></a>
                </div>
            </div>
            
            <div class="hero-game-card fade-in">
                <div class="game-card-header">
                    <i data-lucide="gamepad-2" style="width:16px; color: var(--primary);"></i>
                    <select id="gameDropdown" style="background: transparent; color: white; border: none; outline: none; cursor: pointer; font-family: var(--font-mono); width: 100%; font-size: 0.9rem;">
                        ${optionsHTML}
                    </select>
                    <i data-lucide="chevron-down" style="width:14px; color: #666;"></i>
                </div>

                <iframe src="${defaultGameUrl}" id="gameFrame" class="game-frame" title="Interactive Game Module"></iframe>
            </div>
        </div>
    `;

    // 4. Listeners
    setTimeout(() => {
        const dropdown = document.getElementById('gameDropdown');
        const iframe = document.getElementById('gameFrame');
        if(dropdown && iframe) {
            dropdown.addEventListener('change', (e) => {
                iframe.src = e.target.value;
                iframe.focus();
            });
        }
        if(window.lucide) window.lucide.createIcons();
    }, 0);
};



const renderAbout = () => {
    const about = document.getElementById('about');
    about.innerHTML = `
        <div class="container about-grid">
            <div class="about-image fade-in-left">
                 <div style="aspect-ratio: 4/5; border-radius: 1rem; overflow: hidden; transform: rotate(-3deg); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                    <img src="${data.images.profile}" alt="Ismail" style="width: 100%; height: 100%; object-fit: cover;">
                 </div>
            </div>
            <div class="about-text fade-in-right">
                <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">About Me</h2>
                <p style="color: var(--muted); font-size: 1.1rem; margin-bottom: 1rem;">
                    ${data.about}
                </p>
                
                <div class="stats">
                    <div class="stat-card">
                        <span class="stat-number">Waiting to gain some + </span>
                        <span class="stat-label">Years Experience</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${data.projects.length}+</span>
                        <span class="stat-label">Projects Completed</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderExperience = () => {
    const experience = document.getElementById('experience');
    if (!experience || !data.experience || data.experience.length === 0) return;

    const items = data.experience.map(exp => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-date">
                <i data-lucide="calendar" width="14"></i> ${exp.period}
            </div>
            <h3>${exp.role}</h3>
            <h4 style="color: var(--muted); margin-bottom: 0.5rem;">${exp.company}</h4>
            <p style="color: var(--muted); font-size: 0.9rem;">${exp.description || ''}</p>
        </div>
    `).join('');

    experience.innerHTML = `
        <div class="container">
             <div style="text-center; max-width: 600px; margin: 0 auto 3rem auto; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Experience</h2>
                <p style="color: var(--muted);">My professional and extracurricular journey.</p>
            </div>
            <div class="timeline" style="max-width: 800px; margin: 0 auto;">
                ${items}
            </div>
        </div>
    `;
};

const renderEducation = () => {
    const education = document.getElementById('education');
    const items = data.education.map(edu => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-date">
                <i data-lucide="calendar" width="14"></i> ${edu.period}
            </div>
            <h3>${edu.degree}</h3>
            <h4 style="color: var(--muted); margin-bottom: 0.5rem;">${edu.institution}</h4>
            <p style="color: var(--muted); font-size: 0.9rem;">${edu.description || ''}</p>
        </div>
    `).join('');

    education.innerHTML = `
        <div class="container">
             <div style="text-center; max-width: 600px; margin: 0 auto 3rem auto; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Education</h2>
                <p style="color: var(--muted);">My academic journey.</p>
            </div>
            <div class="timeline" style="max-width: 800px; margin: 0 auto;">
                ${items}
            </div>
        </div>
    `;
};

const renderProjects = () => {
    const projects = document.getElementById('projects');
    const items = data.projects.map(project => `
        <div class="project-card">
            <div>
                <div class="project-header">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <h3 style="font-size: 1.25rem; margin: 0;">${project.title}</h3>
                        ${project.status ? `<span class="status-badge status-${project.status.toLowerCase()}">${project.status}</span>` : ''}
                    </div>
                    ${project.link !== '#' ? `<a href="${project.link}" target="_blank" style="color: var(--muted);"><i data-lucide="arrow-up-right"></i></a>` : ''}
                </div>
                <p style="color: var(--muted); font-size: 0.9rem;">${project.description}</p>
            </div>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');

    projects.innerHTML = `
        <div class="container">
            <div style="text-center; max-width: 600px; margin: 0 auto 3rem auto; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Featured Projects</h2>
                <p style="color: var(--muted);">Architecture. Development. Innovation.</p>
            </div>
            <div class="projects-grid">
                ${items}
            </div>
        </div>
    `;
};

const renderCertificates = () => {
    const certSection = document.getElementById('certificates');
    
    // Check if certificates exist
    if (!data.certificates || data.certificates.length === 0) return;

    // Generate Slides HTML
    const slidesHTML = data.certificates.map((cert, index) => `
        <div class="carousel-slide">
            <img src="${cert.image}" alt="${cert.title}">
            <div class="carousel-caption">
                <h3>${cert.title}</h3>
                <p>${cert.desc}</p>
            </div>
        </div>
    `).join('');

    // Generate Dots HTML
    const dotsHTML = data.certificates.map((_, index) => `
        <span class="dot" data-index="${index}"></span>
    `).join('');

    // Inject Structure
    certSection.innerHTML = `
        <div class="container">
            <div style="text-align: center; max-width: 600px; margin: 0 auto 3rem auto;">
                <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Certifications</h2>
                <p style="color: var(--muted);">My credentials and achievements.</p>
            </div>
            
            <div class="carousel-container">
                <div class="carousel-track" id="track">
                    ${slidesHTML}
                </div>
            </div>
            
            <div class="carousel-dots" id="dots-container">
                ${dotsHTML}
            </div>
        </div>
    `;

    // Start the Carousel Logic
    initCarousel();
};

// === CAROUSEL LOGIC ===
const initCarousel = () => {
    const track = document.getElementById('track');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');
    
    if(!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Function to update slide
    const updateSlide = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');
        
        currentIndex = index;
    };

    // Auto Slide Loop
    const startAutoSlide = () => {
        return setInterval(() => {
            let nextIndex = (currentIndex + 1) % totalSlides;
            updateSlide(nextIndex);
        }, 4000); // Change image every 4 seconds
    };

    // Initialize first state
    updateSlide(0);
    let slideInterval = startAutoSlide();

    // Add Click Listeners to Dots (Manual Navigation)
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            clearInterval(slideInterval); // Stop auto slide on interaction
            updateSlide(index);
            slideInterval = startAutoSlide(); // Restart auto slide
        });
    });
};

// ... (Keep the main event listener at the bottom) ...


const renderSkills = () => {
    const skills = document.getElementById('skills');
    const items = data.skills.map(skill => `
        <span class="skill-pill">${skill}</span>
    `).join('');

    skills.innerHTML = `
        <div class="container section">
            <div style="text-align: center; margin-bottom: 3rem;">
                <h2 style="font-size: 2.5rem;">Technical Arsenal</h2>
            </div>
            <div class="skills-container">
                ${items}
            </div>
        </div>
    `;
};

const renderContact = () => {
    const contact = document.getElementById('contact');
    contact.innerHTML = `
        <div class="container contact-grid">
            <div>
                <h2 style="font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.1;">Let's work together.</h2>
                <p style="font-size: 1.1rem; color: var(--muted); margin-bottom: 3rem;">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                </p>
                
                <div class="contact-info">
                    <div class="contact-info-item">
                        <div class="icon-box"><i data-lucide="mail"></i></div>
                        <span>${data.contact.email}</span>
                    </div>
                    <div class="contact-info-item">
                        <div class="icon-box"><i data-lucide="phone"></i></div>
                        <span>${data.contact.phone}</span>
                    </div>
                    <div class="contact-info-item">
                        <div class="icon-box"><i data-lucide="map-pin"></i></div>
                        <span>${data.contact.location}</span>
                    </div>
                </div>
            </div>
            
            <div style="background: var(--card-bg); padding: 2rem; border-radius: 1rem; border: 1px solid var(--border); backdrop-filter: blur(5px);">
                <form>
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="form-input" placeholder="Your Name">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-input" placeholder="john@example.com">
                    </div>
                    <div class="form-group">
                        <label>Message</label>
                        <textarea class="form-input" rows="4" placeholder="Tell me about your project..."></textarea>
                    </div>
                    <button type="button" class="btn btn-primary" style="width: 100%;">Send Message</button>
                </form>
            </div>
        </div>
    `;
};

const renderFooter = () => {
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    document.getElementById('footer-name').textContent = data.name;
};

// Theme Toggle
const initTheme = () => {
    const toggle = document.getElementById('theme-toggle');
    const toggleMobile = document.getElementById('theme-toggle-mobile');
    const body = document.body;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateIcons(savedTheme);
    }

    const toggleTheme = () => {
        const current = body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcons(next);
    };

    if(toggle) toggle.addEventListener('click', toggleTheme);
    if(toggleMobile) toggleMobile.addEventListener('click', toggleTheme);
};

const updateIcons = (theme) => {
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
        if(theme === 'dark') {
            icon.setAttribute('data-lucide', 'sun');
        } else {
            icon.setAttribute('data-lucide', 'moon');
        }
    });
    initIcons(); // Re-render icons
};

// Mobile Menu
const initMobileMenu = () => {
    const btn = document.getElementById('mobile-menu-btn');
    const close = document.getElementById('mobile-close');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
        menu.classList.toggle('open');
    };

    if(btn) btn.addEventListener('click', toggleMenu);
    if(close) close.addEventListener('click', toggleMenu);
    
    links.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
};

// Terminal Logic
const initTerminal = () => {
    const overlay = document.getElementById('terminal-overlay');
    const openBtn = document.getElementById('term-toggle');
    const closeBtn = document.getElementById('close-terminal');
    const input = document.getElementById('commandInput');
    const output = document.getElementById('terminalOutput');

    // Open Terminal
    if(openBtn) {
        openBtn.addEventListener('click', () => {
            overlay.classList.remove('hidden');
            input.focus();
        });
    }

    // Close Terminal
    const closeTerminal = () => {
        overlay.classList.add('hidden');
    };

    if(closeBtn) closeBtn.addEventListener('click', closeTerminal);
    
    // Close on click outside
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) closeTerminal();
    });

    // Handle Input
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            handleCommand(command);
            input.value = '';
        }
    });

    const handleCommand = (cmd) => {
        // Add user command to history
        output.innerHTML += `<div class="output-line"><span class="prompt">➜</span> <span class="cmd">${cmd}</span></div>`;

        let response = '';

        switch(cmd) {
            case 'help':
                response = `Available commands: <span class="highlight">about, experience, education, projects, skills, certificates, contact, clear, exit</span>`;
                break;
            case 'about':
                response = data.about;
                break;
            case 'experience':
                data.experience.forEach(exp => {
                    response += `<div style="margin-bottom: 5px; color: #fff; font-weight: bold;">${exp.company}</div><div style="color: #888;">${exp.role} (${exp.period})</div><div style="color: #ccc; margin-bottom: 10px;">${exp.description}</div><br>`;
                });
                break;
            case 'education':
                data.education.forEach(edu => {
                    response += `<div style="margin-bottom: 5px; color: #fff;">${edu.degree}</div><div style="color: #888;">${edu.institution} (${edu.period})</div><br>`;
                });
                break;
            case 'projects':
                data.projects.forEach(p => {
                    const statusStr = p.status ? ` <span style="color: #10b981; font-weight: bold;">(${p.status})</span>` : '';
                    response += `<div style="margin-bottom: 5px;"><span class="highlight">${p.title}</span>${statusStr} <span style="font-size: 0.8em; color: #666;">[${p.tags.join(', ')}]</span></div><div style="color: #ccc; margin-bottom: 10px;">${p.description}</div>`;
                });
                break;
            case 'certificates':
                 if(data.certificates) {
                    data.certificates.forEach(c => {
                        response += `<div><span class="highlight">★ ${c.title}</span></div><div style="color:#888; margin-bottom: 5px;">${c.issuer} - ${c.date}</div>`;
                    });
                 } else {
                     response = "No certificates loaded.";
                 }
                 break;
            case 'skills':
                response = data.skills.join('  •  ');
                break;
            case 'contact':
                response = `Email: ${data.contact.email}<br>GitHub: ${data.contact.github}<br>Phone: ${data.contact.phone}`;
                break;
            case 'clear':
                output.innerHTML = '';
                return;
            case 'exit':
                closeTerminal();
                return;
            default:
                response = `Command not found: ${cmd}. Type 'help'.`;
        }

        if(response) {
            output.innerHTML += `<div class="response">${response}</div>`;
        }
        
        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
    };
};

// Main Init
document.addEventListener('DOMContentLoaded', () => {
    renderHero();
    renderAbout();
    renderExperience();
    renderEducation();
    renderProjects();
    renderCertificates();
    renderSkills();
    renderContact();
    renderFooter();
    
    updateResumeLinks(); // Update navbar resume links
    initTheme();
    initMobileMenu();
    initIcons();
    initTerminal();
});