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
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[200] flex items-center justify-center p-6" onClick={handleOverlayClick}>
      <div className="w-full max-w-2xl h-[480px] bg-[#0d1117] border border-[#30363d] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-mono text-left animate-fade-in">
        <div className="bg-[#161b22] px-5 py-3 flex items-center justify-between border-b border-[#30363d] select-none">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs text-[#8b949e] font-semibold mr-10">ismail@portfolio-shell:~</span>
          <div style={{ width: '40px' }} />
        </div>

        <div className="flex-1 p-5 overflow-y-auto text-sm text-[#c9d1d9] flex flex-col gap-3" ref={outputRef}>
          {history.map((line, idx) => (
            <div key={idx}>
              {line.type === 'input' && (
                <div>
                  <span className="text-[#58a6ff] font-bold mr-2">➜</span>
                  <span className="text-[#f2f4f8]">{line.text}</span>
                </div>
              )}
              {line.type === 'response' && (
                <div className="whitespace-pre-wrap text-[#c9d1d9] leading-relaxed">{line.text}</div>
              )}
              {line.type === 'system' && (
                <div className="text-[#8b949e] italic">{line.text}</div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center bg-[#0d1117] px-5 pb-5 pt-2 cursor-text" onClick={() => inputRef.current?.focus()}>
          <span className="text-[#58a6ff] font-bold mr-2">➜</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[#56d364] font-mono text-sm caret-[#58a6ff] w-full"
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
  );
};
