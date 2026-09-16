import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/sfx';
import { 
  Copy, 
  Check, 
  ArrowUpRight,
  Mail,
  X,
  Github,
  Linkedin,
  Instagram
} from 'lucide-react';

interface SingularityCoreProps {
  onEscape: () => void;
}

const TECH_STACK = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "GLSL / Shaders", "SQL", "HTML5 / CSS3"]
  },
  {
    category: "AI & Machine Learning",
    items: ["PyTorch", "TensorFlow", "Scikit-Learn", "Hugging Face", "LLM Integration", "RAG Pipelines", "Computer Vision"]
  },
  {
    category: "Web & Spatial Systems",
    items: ["React 19", "Next.js", "Three.js", "React Three Fiber", "Tailwind CSS", "Node.js", "Express", "WebSockets"]
  },
  {
    category: "Infrastructure & Toolchain",
    items: ["Docker", "Git / GitHub", "Linux / Bash", "Vite", "RESTful APIs", "Cloud Run", "CI / CD"]
  }
];

const FEATURED_PROJECTS = [
  {
    title: "Singularity OS — TON 618",
    role: "Lead Creator",
    description: "Interactive 3D black hole raymarched simulation with real-time relativistic spacetime distortion, Web Audio frequency reactivity, and precision camera controls.",
    tags: ["Three.js", "GLSL", "React 19", "Web Audio API", "Tailwind"],
    url: "https://github.com/Neverfinished005/PORTFOLIO"
  },
  {
    title: "Deep Learning & Vision Experiments",
    role: "ML Engineer",
    description: "Neural network architectures, transformer models, and computer vision pipelines built for structured inference and classification tasks.",
    tags: ["Python", "PyTorch", "OpenCV", "Scikit-Learn", "Hugging Face"],
    url: "https://github.com/Neverfinished005"
  },
  {
    title: "Full-Stack Web Platforms",
    role: "Full-Stack Developer",
    description: "High-performance client-server applications, responsive interfaces, and low-latency API integration built with modern TypeScript ecosystems.",
    tags: ["TypeScript", "Next.js", "React", "Node.js", "REST APIs"],
    url: "https://github.com/Neverfinished005"
  }
];

export default function SingularityCore({ onEscape }: SingularityCoreProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderSubject, setSenderSubject] = useState('Project Collaboration');
  const [senderMessage, setSenderMessage] = useState('');
  const [transmissionSent, setTransmissionSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'stack' | 'projects' | 'contact'>('overview');

  const handleCopyEmail = () => {
    soundEngine.playClickSound();
    navigator.clipboard.writeText('rudra.vable@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickSound();
    setTransmissionSent(true);

    const mailtoUrl = `mailto:rudra.vable@gmail.com?subject=${encodeURIComponent(
      `[Portfolio Contact] ${senderSubject} — from ${senderName || 'Visitor'}`
    )}&body=${encodeURIComponent(senderMessage || 'Hello Rudi, reaching out regarding your work.')}`;

    window.open(mailtoUrl, '_blank');
    setTimeout(() => setTransmissionSent(false), 3500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[150] overflow-y-auto overflow-x-hidden bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090b]/95 backdrop-blur-xl px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-xs font-mono font-medium tracking-wider text-white">
              SINGULARITY <span className="text-zinc-600">/</span> <span className="text-zinc-400">CORE</span>
            </span>
            <span className="hidden md:inline-block w-px h-3 bg-zinc-800" />
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for opportunities</span>
            </div>
          </div>

          {/* Navigation Tabs - Horizontally scrollable on small mobile screens */}
          <div className="flex items-center gap-1 bg-zinc-900/90 p-1 border border-white/[0.06] rounded-lg overflow-x-auto max-w-[calc(100vw-180px)] sm:max-w-none scrollbar-none">
            {(['overview', 'stack', 'projects', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundEngine.playClickSound();
                  setActiveTab(tab);
                }}
                onMouseEnter={() => soundEngine.playHoverSound()}
                className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize whitespace-nowrap cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Close / Return Button */}
          <button
            onClick={() => {
              soundEngine.playWarpExitSound();
              onEscape();
            }}
            onMouseEnter={() => soundEngine.playHoverSound()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/[0.2] bg-zinc-900/80 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <span>Close</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 relative z-10">

        {/* ── PROFILE & CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Card: Profile Dossier (4 cols) */}
          <div className="lg:col-span-4 border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-5 sm:p-6 rounded-xl space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/[0.1] bg-zinc-800 flex-shrink-0">
                <img 
                  src="/avatar.jpg" 
                  alt="Rudra Vable" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }} 
                />
                <div className="w-full h-full flex items-center justify-center font-bold text-xl text-white">
                  R
                </div>
              </div>

              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                  Rudra Vable
                </h1>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  @Neverfinished005
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Open to work</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/[0.06] text-xs leading-relaxed text-zinc-300">
              <p>
                Full-stack developer and machine learning engineer.
              </p>
              <p className="text-zinc-400">
                Focused on building high-performance web systems, deep learning pipelines, and interactive 3D interfaces with modern developer toolchains.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>GitHub Repositories</span>
                <span className="text-zinc-200">30+ Projects</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Core Ecosystem</span>
                <span className="text-zinc-200">React · Python · PyTorch</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Work Preference</span>
                <span className="text-zinc-200">Remote / Global</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2">
              <a
                href="https://github.com/Neverfinished005"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => soundEngine.playHoverSound()}
                className="flex flex-col items-center justify-center py-2.5 px-2 border border-white/[0.08] hover:border-white/[0.2] bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-mono">GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/rudra-vable/"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => soundEngine.playHoverSound()}
                className="flex flex-col items-center justify-center py-2.5 px-2 border border-white/[0.08] hover:border-white/[0.2] bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-mono">LinkedIn</span>
              </a>

              <a
                href="https://www.instagram.com/rudr_a.25"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => soundEngine.playHoverSound()}
                className="flex flex-col items-center justify-center py-2.5 px-2 border border-white/[0.08] hover:border-white/[0.2] bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-mono">Instagram</span>
              </a>
            </div>
          </div>

          {/* Right Area: Content based on activeTab (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* ── TECHNICAL STACK ── */}
            {(activeTab === 'overview' || activeTab === 'stack') && (
              <div className="border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-5 sm:p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <h2 className="text-sm font-semibold text-white tracking-wide">
                    Technical Stack &amp; Architecture
                  </h2>
                  <span className="text-xs font-mono text-zinc-500">
                    4 Domains
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {TECH_STACK.map((group) => (
                    <div key={group.category} className="space-y-2">
                      <span className="text-xs font-mono font-medium text-zinc-400 block">
                        {group.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            onMouseEnter={() => soundEngine.playHoverSound()}
                            className="px-2.5 py-1 text-xs font-mono bg-zinc-900 border border-white/[0.08] hover:border-zinc-500 text-zinc-300 hover:text-white rounded-md transition-colors cursor-default"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FEATURED PROJECTS ── */}
            {(activeTab === 'overview' || activeTab === 'projects') && (
              <div className="border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-5 sm:p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <h2 className="text-sm font-semibold text-white tracking-wide">
                    Featured Work &amp; Systems
                  </h2>
                  <a
                    href="https://github.com/Neverfinished005"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => soundEngine.playHoverSound()}
                    className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    <span>All Repositories</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-3">
                  {FEATURED_PROJECTS.map((project) => (
                    <a
                      key={project.title}
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => soundEngine.playHoverSound()}
                      className="block p-3.5 sm:p-4 rounded-lg border border-white/[0.06] hover:border-white/[0.18] bg-zinc-950/40 hover:bg-zinc-900/60 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                          {project.title}
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded border border-white/[0.08] flex-shrink-0">
                          {project.role}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-white/[0.04]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── CONTACT FORM ── */}
            {(activeTab === 'overview' || activeTab === 'contact') && (
              <div className="border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-5 sm:p-6 rounded-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                  <div>
                    <h2 className="text-sm font-semibold text-white tracking-wide">
                      Direct Message
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Reach out directly to rudra.vable@gmail.com
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    onMouseEnter={() => soundEngine.playHoverSound()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white border border-white/[0.08] hover:border-white/[0.2] bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>

                <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-zinc-400 mb-1.5 text-xs">
                        Your Name / Team
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Alex / Engineering Team"
                        className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.08] focus:border-white/[0.3] rounded-lg text-white placeholder-zinc-600 focus:outline-none transition-colors text-[16px] sm:text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-zinc-400 mb-1.5 text-xs">
                        Topic
                      </label>
                      <select
                        value={senderSubject}
                        onChange={(e) => setSenderSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.08] focus:border-white/[0.3] rounded-lg text-white focus:outline-none transition-colors text-[16px] sm:text-xs"
                      >
                        <option value="Project Collaboration">Project Collaboration</option>
                        <option value="Full-Time Engineering Role">Full-Time Engineering Role</option>
                        <option value="Contract / Freelance">Contract / Freelance</option>
                        <option value="General Conversation">General Conversation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-zinc-400 mb-1.5 text-xs">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      placeholder="Write your note or project scope..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.08] focus:border-white/[0.3] rounded-lg text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none text-[16px] sm:text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="submit"
                      onMouseEnter={() => soundEngine.playHoverSound()}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-medium text-xs rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{transmissionSent ? 'Opening Mail Client...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>

      </main>
    </motion.div>
  );
}
