import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Download } from 'lucide-react';

export const Hero = ({ role, name, about, resumeUrl, githubUrl, linkedinUrl, data }) => {
  // Split the name to highlight the second part
  const nameParts = name.split(" ");

  // Terminal state
  const [terminalInputVal, setTerminalInputVal] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: "Welcome to Terminal Mode." },
    { type: 'system', text: "Type 'help' to see available commands." }
  ]);

  const terminalBodyRef = useRef(null);
  const terminalInputRef = useRef(null);

  // Auto-scroll terminal to bottom on history change
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const focusTerminalInput = () => {
    if (terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  };

  const handleTerminalCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const cmd = trimmed.toLowerCase();
    let response = '';
    const newHistory = [...terminalHistory, { type: 'input', text: trimmed }];

    switch (cmd) {
      case 'help':
        response = `Available commands: \n  • about: Personal bio\n  • experience: Professional journey\n  • education: Academic milestones\n  • projects: Technical projects catalog\n  • skills: My technical stack\n  • contact: Get in touch\n  • clear: Clear the screen`;
        break;
      case 'about':
        response = data.about;
        break;
      case 'experience':
        response = data.experience.map(exp =>
          `[${exp.period}] ${exp.role} @ ${exp.company}\n  ↳ ${exp.description || 'No description provided'}`
        ).join('\n\n');
        break;
      case 'education':
        response = data.education.map(edu =>
          `[${edu.period}] ${edu.degree}\n  ↳ ${edu.institution} (${edu.description || ''})`
        ).join('\n\n');
        break;
      case 'projects':
        const sortedProj = [...data.projects].sort((a, b) => (b.stars || 0) - (a.stars || 0));
        response = sortedProj.map(p => {
          const rating = p.stars ? ` [Rating: ${p.stars}/5]` : '';
          return `★ ${p.title} (${p.status || 'Completed'})${rating}\n  - Tags: ${p.tags.join(', ')}\n  - ${p.description}`;
        }).join('\n\n');
        break;
      case 'skills':
        response = `Technical Stack:\n  • ` + data.skills.join('\n  • ');
        break;
      case 'contact':
        response = `Email: ${data.contact.email}\nPhone: ${data.contact.phone}\nLocation: ${data.contact.location}\nGitHub: ${data.contact.github}\nLinkedIn: ${data.contact.linkedin}`;
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInputVal('');
        return;
      default:
        response = `Command not found: '${trimmed}'. Type 'help' for a list of commands.`;
    }

    setTerminalHistory([...newHistory, { type: 'response', text: response }]);
    setTerminalInputVal('');
  };

  const handleTerminalKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTerminalCommand(terminalInputVal);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-36 min-h-[85vh] w-full">
      <div className="text-left space-y-6 max-w-xl animate-fade-in">
        <span className="text-primary font-mono uppercase tracking-widest text-xs font-semibold block">{role}</span>
        <h1 className="text-6xl font-extrabold tracking-tight leading-none text-text-primary">
          Hello, I'm <br />
          <span className="text-primary">{nameParts.slice(-2).join(" ")}</span>
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          Engineer focused on building clean, modular software systems, secure local-first cloud containers, and real-time automation.
        </p>

        <div className="flex gap-4 flex-wrap">
          <a href="#projects" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all duration-200 bg-primary text-bg-secondary hover:bg-primary-hover hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30">
            View Projects <ArrowRight size={16} />
          </a>
          <a href={resumeUrl} download className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all duration-200 border border-border-color bg-transparent text-text-primary hover:bg-bg-tertiary hover:border-text-secondary hover:-translate-y-1">
            Download Resume <Download size={16} />
          </a>
        </div>
      </div>

      <div className="animate-fade-in [animation-delay:0.2s] w-full">
        <div className="bg-bg-secondary border border-border-color rounded-2xl h-[440px] flex flex-col shadow-xl overflow-hidden font-mono cursor-text transition-all duration-300 hover:border-primary/40 hover:shadow-2xl" onClick={focusTerminalInput}>
          <div className="bg-bg-tertiary px-5 py-3.5 flex items-center border-b border-border-color">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 text-center text-xs text-text-muted mr-9">ismail@portfolio-server:~</div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto text-xs text-text-primary flex flex-col gap-2 text-left" ref={terminalBodyRef}>
            {terminalHistory.map((item, idx) => (
              <div key={idx} className={`whitespace-pre-wrap leading-relaxed ${item.type === 'input' ? 'font-semibold text-primary' : item.type === 'response' ? 'text-text-secondary' : 'text-text-muted'}`}>
                {item.type === 'input' && <span className="text-primary font-bold">➜ </span>}
                <span>{item.text}</span>
              </div>
            ))}

            <div className="flex items-center gap-1 w-full">
              <span className="text-primary font-bold">➜ </span>
              <input
                type="text"
                ref={terminalInputRef}
                value={terminalInputVal}
                onChange={(e) => setTerminalInputVal(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-text-primary font-mono text-xs w-full caret-primary"
                placeholder="type 'help'..."
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
