import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/sfx';
import { 
  Rocket, 
  Terminal, 
  Cpu, 
  Globe, 
  Layers, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Sparkles,
  Github,
  Linkedin,
  Instagram
} from 'lucide-react';

interface SingularityCoreProps {
  onEscape: () => void;
}

const SKILL_CATEGORIES = [
  {
    title: "Machine Learning & AI",
    icon: Cpu,
    color: "#ff8c00",
    skills: ["Python", "PyTorch", "TensorFlow", "Generative AI", "LLM Fine-Tuning", "RAG Systems", "Scikit-Learn", "Computer Vision"]
  },
  {
    title: "Full Stack & Web",
    icon: Globe,
    color: "#4a90e2",
    skills: ["React 19", "TypeScript", "Node.js", "Express", "Tailwind CSS", "Next.js", "REST APIs", "WebSockets"]
  },
  {
    title: "3D & Creative Tech",
    icon: Layers,
    color: "#e1306c",
    skills: ["Three.js", "React Three Fiber", "GLSL Shaders", "Raymarching", "Post-Processing", "Framer Motion", "WebGL"]
  },
  {
    title: "Systems & Infrastructure",
    icon: Terminal,
    color: "#10b981",
    skills: ["Git / GitHub", "Docker", "Linux CLI", "Vite", "Cloud Run", "CI / CD", "Performance Tuning"]
  }
];

export default function SingularityCore({ onEscape }: SingularityCoreProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderSubject, setSenderSubject] = useState('Project Collaboration');
  const [senderMessage, setSenderMessage] = useState('');
  const [transmissionSent, setTransmissionSent] = useState(false);

  const handleCopyEmail = () => {
    soundEngine.playClickSound();
    navigator.clipboard.writeText('rudra.vable@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickSound();
    setTransmissionSent(true);

    const mailtoUrl = `mailto:rudra.vable@gmail.com?subject=${encodeURIComponent(
      `[Singularity OS Transmission] ${senderSubject} - from ${senderName || 'Visitor'}`
    )}&body=${encodeURIComponent(senderMessage || 'Hello Rudi, reaching out from Singularity OS!')}`;

    window.open(mailtoUrl, '_blank');
    setTimeout(() => setTransmissionSent(false), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[150] overflow-y-auto overflow-x-hidden bg-black/90 backdrop-blur-3xl text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Background Matrix Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="fixed inset-0 pointer-events-none bg-radial-gradient from-cyan-900/10 via-black/40 to-black/90" />

      {/* Top Telemetry Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-[9px] uppercase tracking-widest animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SINGULARITY_CORE // R &lt; Rs</span>
          </div>
          <span className="hidden md:inline font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase">
            GEODESIC CONVERGENCE REACHED
          </span>
        </div>

        {/* Escape Button */}
        <button
          onClick={() => {
            soundEngine.playWarpExitSound();
            onEscape();
          }}
          onMouseEnter={() => soundEngine.playHoverSound()}
          className="group relative flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] cursor-pointer"
        >
          <Rocket className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span>ESCAPE TO ORBIT</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping ml-1" />
        </button>
      </header>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 relative z-10">
        {/* Hero Title Section */}
        <div className="mb-14 text-center sm:text-left border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-[9px] uppercase tracking-widest">
              Event Horizon Deep Matrix
            </span>
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
              Time Dilation: 1 sec = ∞ Earth Time
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white/60 mb-3">
            RUDI // RUDRA VABLE
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl font-mono leading-relaxed">
            Full-stack engineer, machine learning builder, and creative technologist. Exploring the boundary between compute, intelligence, and high-performance immersive interfaces.
          </p>
        </div>

        {/* Skills Constellation Matrix */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                Quantum Skills Matrix
              </h2>
            </div>
            <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
              ACTIVE_STACK_V4.2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 relative group overflow-hidden"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.01)',
                  }}
                  onMouseEnter={() => soundEngine.playHoverSound()}
                >
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border"
                      style={{
                        borderColor: `${cat.color}40`,
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm tracking-wide uppercase">
                      {cat.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md border border-white/10 bg-black/40 font-mono text-[10px] text-white/80 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-colors duration-200 cursor-default"
                        onMouseEnter={() => soundEngine.playHoverSound()}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quantum Transmission Uplink (Contact) & Social Coordinates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Transmission Terminal (2 cols) */}
          <section className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                  Quantum Transmission Uplink
                </h3>
              </div>
              <span className="font-mono text-[8px] text-emerald-400/80 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Channel Open
              </span>
            </div>

            <form onSubmit={handleSendTransmission} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/50 mb-1">
                    Transmitter Identifier (Your Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Elena Rostova / Google Recruiter"
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/20 font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/50 mb-1">
                    Transmission Objective
                  </label>
                  <select
                    value={senderSubject}
                    onChange={(e) => setSenderSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
                  >
                    <option value="Project Collaboration">Project Collaboration</option>
                    <option value="Full-Time Engineering Role">Full-Time Engineering Role</option>
                    <option value="Freelance Architecture">Freelance Architecture</option>
                    <option value="AI / ML Research Discussion">AI / ML Research Discussion</option>
                    <option value="General Uplink">General Uplink</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-white/50 mb-1">
                  Encrypted Payload (Message)
                </label>
                <textarea
                  rows={4}
                  required
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  placeholder="Transmit your message directly into Rudi's terminal..."
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/20 font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30 text-white/60 hover:text-white font-mono text-[10px] tracking-wider uppercase transition-all"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Email Copied' : 'Copy Email Address'}</span>
                </button>

                <button
                  type="submit"
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{transmissionSent ? 'Relaying...' : 'Dispatch Transmission'}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Direct Coordinates (1 col) */}
          <section className="p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                  Sub-Space Coordinates
                </h3>
              </div>

              <div className="space-y-3">
                <a
                  href="https://github.com/Neverfinished005"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 text-white transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-white/60 group-hover:text-white" />
                    <div>
                      <p className="font-bold text-xs">GitHub Matrix</p>
                      <p className="font-mono text-[9px] text-white/40">@Neverfinished005</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/rudra-vable/"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-blue-950/30 hover:border-blue-500/40 text-white transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Linkedin className="w-4 h-4 text-[#0a84ff]" />
                    <div>
                      <p className="font-bold text-xs">LinkedIn Network</p>
                      <p className="font-mono text-[9px] text-white/40">/in/rudra-vable</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                </a>

                <a
                  href="https://www.instagram.com/rudr_a.25"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-pink-950/30 hover:border-pink-500/40 text-white transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-[#e1306c]" />
                    <div>
                      <p className="font-bold text-xs">Instagram Feed</p>
                      <p className="font-mono text-[9px] text-white/40">@rudr_a.25</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-pink-400 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
                Singularity OS // Core
              </span>
              <button
                onClick={() => {
                  soundEngine.playWarpExitSound();
                  onEscape();
                }}
                className="font-mono text-[9px] text-cyan-400 hover:text-cyan-300 underline uppercase tracking-widest cursor-pointer"
              >
                Return to Surface
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
