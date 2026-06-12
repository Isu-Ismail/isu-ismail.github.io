import React from 'react';
import { ArrowRight, Download, Cpu, Send, Database, Monitor, Shield } from 'lucide-react';

export const Hero = ({ role, name, about, resumeUrl, githubUrl, linkedinUrl }) => {
  // Split the name to highlight the second part
  const nameParts = name.split(" ");
  const lastName = nameParts[nameParts.length - 1];
  const firstName = nameParts.slice(0, -1).join(" ");

  return (
    <>
      <style>{`
        .hero-split-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr; 
          gap: 4rem;
          align-items: center;
          padding: 8rem 0 5rem 0;
          min-height: 80vh;
        }
        @media (max-width: 992px) {
          .hero-split-layout {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding-top: 6rem;
            text-align: center;
          }
        }
        .hero-title {
          font-size: 3.75rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        @media (max-width: 576px) {
          .hero-title {
            font-size: 2.75rem;
          }
        }
        .hero-sub {
          color: var(--color-primary);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 0.85rem;
          font-weight: 600;
          display: block;
          margin-bottom: 1.25rem;
        }
        .hero-desc {
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
          color: var(--text-secondary);
          max-width: 540px;
        }
        @media (max-width: 992px) {
          .hero-desc {
            margin-left: auto;
            margin-right: auto;
          }
        }
        .hero-actions-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        @media (max-width: 992px) {
          .hero-actions-container {
            justify-content: center;
          }
        }
        
        /* Interactive Visualizer Card */
        .visualizer-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 2.25rem;
          position: relative;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }
        .visualizer-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1.75rem;
        }
        .status-dot-active {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          display: inline-block;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
          animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        
        /* System Diagram Nodes */
        .system-nodes-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
        }
        .sys-node {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 2;
          transition: all var(--transition-fast);
        }
        .sys-node:hover {
          border-color: var(--color-primary);
          background-color: rgba(var(--color-primary-rgb), 0.04);
        }
        .sys-node-icon {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 0.5rem;
          border-radius: 8px;
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sys-node-info {
          flex: 1;
        }
        .sys-node-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sys-node-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        
        /* Floating Telemetry Line animations */
        .telemetry-pipeline {
          position: absolute;
          left: 1.85rem;
          top: 1.5rem;
          bottom: 1.5rem;
          width: 2px;
          background: var(--border-color);
          z-index: 1;
        }
        .data-packet {
          position: absolute;
          left: -4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary);
          animation: float-packet 4s infinite linear;
        }
        .packet-2 {
          animation-delay: 2s;
        }
        @keyframes float-packet {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      <div className="container hero-split-layout">
        <div className="hero-left animate-fade-in">
          <span className="hero-sub">{role}</span>
          <h1 className="hero-title">
            Hello, I'm <br />
            <span style={{ color: 'var(--color-primary)' }}>{nameParts.slice(-2).join(" ")}</span>
          </h1>
          <p className="hero-desc">
            Production Engineering student focused on building clean, modular software systems, secure local-first cloud containers, and real-time automation.
          </p>

          <div className="hero-actions-container">
            <a href="#projects" className="btn btn-primary">
              View Projects <ArrowRight size={16} />
            </a>
            <a href={resumeUrl} download className="btn btn-outline">
              Download Resume <Download size={16} />
            </a>
          </div>
        </div>

        <div className="hero-right animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="visualizer-card">
            <div className="visualizer-header">
              <span className="status-dot-active" />
              <span>LIVE TELEMETRY WORKSPACE</span>
            </div>

            <div className="system-nodes-grid">
              <div className="telemetry-pipeline">
                <span className="data-packet" />
                <span className="data-packet packet-2" />
              </div>

              <div className="sys-node">
                <span className="sys-node-icon"><Cpu size={18} /></span>
                <div className="sys-node-info">
                  <div className="sys-node-name">Hardware Layer</div>
                  <div className="sys-node-desc">ESP32-S3-ETH • Sensors</div>
                </div>
              </div>

              <div className="sys-node">
                <span className="sys-node-icon"><Send size={18} /></span>
                <div className="sys-node-info">
                  <div className="sys-node-name">MQTT Comm Broker</div>
                  <div className="sys-node-desc">Mosquitto • TLS Security</div>
                </div>
              </div>

              <div className="sys-node">
                <span className="sys-node-icon"><Database size={18} /></span>
                <div className="sys-node-info">
                  <div className="sys-node-name">Backend & DB Swarm</div>
                  <div className="sys-node-desc">FastAPI • Pocketbase</div>
                </div>
              </div>

              <div className="sys-node">
                <span className="sys-node-icon"><Monitor size={18} /></span>
                <div className="sys-node-info">
                  <div className="sys-node-name">User Frontend</div>
                  <div className="sys-node-desc">React SPA • Nginx Gateway</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
