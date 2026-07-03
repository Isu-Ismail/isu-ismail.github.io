import React, { useState, useEffect, useRef } from 'react';
import { X, Square, Minus } from 'lucide-react';

export const Terminal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: "Welcome to Terminal Mode." },
    { type: 'system', text: "Type 'help' to see available commands." },
    { type: 'system', text: "Type 'exit' to close." }
  ]);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const cmd = trimmed.toLowerCase();
    let response = '';
    const newHistory = [...history, { type: 'input', text: trimmed }];

    switch (cmd) {
      case 'help':
        response = `Available commands: \n  • about: Personal bio\n  • experience: Professional journey\n  • education: Academic milestones\n  • projects: Technical projects catalog\n  • skills: My technical stack\n  • contact: Get in touch\n  • clear: Clear the screen\n  • exit: Close terminal`;
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
        setHistory([]);
        setInputVal('');
        return;
      case 'exit':
        onClose();
        setInputVal('');
        return;
      default:
        response = `Command not found: '${trimmed}'. Type 'help' for a list of commands.`;
    }

    setHistory([...newHistory, { type: 'response', text: response }]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('terminal-overlay')) {
      onClose();
    }
  };

  return (
    <>
      <style>{`
        .terminal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .terminal-window {
          width: 100%;
          max-width: 700px;
          height: 480px;
          background-color: #0d1117;
          border: 1px solid #30363d;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          font-family: var(--font-mono);
        }
        .terminal-header {
          background-color: #161b22;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #30363d;
          user-select: none;
        }
        .terminal-dots {
          display: flex;
          gap: 0.5rem;
        }
        .terminal-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-close { background-color: #f85149; cursor: pointer; }
        .dot-min { background-color: #f0883e; }
        .dot-max { background-color: #56d364; }
        
        .terminal-title-text {
          color: #8b949e;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .terminal-body {
          flex: 1;
          padding: 1.25rem;
          overflow-y: auto;
          color: #c9d1d9;
          font-size: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .line-prompt {
          color: #58a6ff;
          font-weight: bold;
          margin-right: 0.5rem;
        }
        .line-cmd {
          color: #f2f4f8;
        }
        .line-response {
          white-space: pre-wrap;
          color: #c9d1d9;
          line-height: 1.6;
        }
        .line-system {
          color: #8b949e;
          font-style: italic;
        }
        .terminal-input-row {
          display: flex;
          align-items: center;
          background-color: #0d1117;
          padding: 0.5rem 1.25rem 1.25rem 1.25rem;
        }
        .terminal-raw-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: #56d364;
          font-family: var(--font-mono);
          font-size: 0.875rem;
        }
      `}</style>

      <div className="terminal-overlay" onClick={handleOverlayClick}>
        <div className="terminal-window animate-fade-in">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot dot-close" onClick={onClose} />
              <span className="terminal-dot dot-min" />
              <span className="terminal-dot dot-max" />
            </div>
            <span className="terminal-title-text">ismail@portfolio-shell:~</span>
            <div style={{ width: '40px' }} />
          </div>

          <div className="terminal-body" ref={outputRef}>
            {history.map((line, idx) => (
              <div key={idx}>
                {line.type === 'input' && (
                  <div>
                    <span className="line-prompt">➜</span>
                    <span className="line-cmd">{line.text}</span>
                  </div>
                )}
                {line.type === 'response' && (
                  <div className="line-response">{line.text}</div>
                )}
                {line.type === 'system' && (
                  <div className="line-system">{line.text}</div>
                )}
              </div>
            ))}
          </div>

          <div className="terminal-input-row" onClick={() => inputRef.current?.focus()}>
            <span className="line-prompt">➜</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-raw-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
              placeholder="Type command..."
            />
          </div>
        </div>
      </div>
    </>
  );
};
