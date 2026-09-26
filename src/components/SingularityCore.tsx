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
  Instagram,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SingularityCoreProps {
  onEscape: () => void;
}

const TECH_STACK = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "GLSL / Shaders", "HTML5 / CSS3", "PHP", "SQL"]
  },
  {
    category: "AI & Machine Learning",
    items: ["PyTorch", "Scikit-Learn", "LangChain", "Autonomous Agents", "Predictive Modeling", "AI Security"]
  },
  {
    category: "Web & 3D Systems",
    items: ["React 19", "Three.js", "WebGL / Raymarching", "Web Audio API", "Tailwind CSS", "Vite", "Node.js"]
  },
  {
    category: "Infrastructure & Toolchain",
    items: ["Git / GitHub", "Linux / Bash", "RESTful APIs", "FastAPI", "Docker", "Vercel"]
  }
];

const FEATURED_PROJECTS = [
  {
    title: "Singularity OS — TON 618",
    role: "Lead Creator",
    description: "Interactive 3D black hole raymarched simulation with real-time relativistic spacetime distortion, Web Audio frequency reactivity, and precision camera controls.",
    tags: ["Three.js", "GLSL", "React 19", "Web Audio API", "Tailwind CSS"],
    url: "https://github.com/Neverfinished005/PORTFOLIO"
  },
  {
    title: "AGENTOS-",
    role: "Creator",
    description: "Zero-overhead runtime safety guard for LangChain & Python agents with budget ceilings, infinite loop detection, and real-time dashboard telemetry.",
    tags: ["Python", "LangChain", "AI Agents", "Runtime Safety", "Telemetry"],
    url: "https://github.com/Neverfinished005/AGENTOS-"
  },
  {
    title: "ORBITGAURD",
    role: "Creator",
    description: "3D Space Situational Awareness (SSA) platform engineered for orbital debris tracking and satellite collision avoidance trajectory modeling.",
    tags: ["TypeScript", "Three.js", "Orbital Mechanics", "3D Simulation"],
    url: "https://github.com/Neverfinished005/ORBITGAURD"
  },
  {
    title: "DemandAnalyzer",
    role: "ML Engineer",
    description: "Machine learning algorithms predicting future sales, market demand, and production trends for industrial pharmaceuticals and seasonal medicine.",
    tags: ["Python", "Machine Learning", "Scikit-Learn", "Predictive Analytics"],
    url: "https://github.com/Neverfinished005/demandanalyzer"
  },
  {
    title: "PENTEST-AI",
    role: "Security Engineer",
    description: "AI-driven automated penetration testing and security vulnerability analysis framework with intelligent assessment workflows.",
    tags: ["Python", "AI Agents", "Cybersecurity", "Automated Auditing"],
    url: "https://github.com/Neverfinished005/PENTEST-AI"
  },
  {
    title: "ElevAI",
    role: "Full-Stack Developer",
    description: "AI-augmented web platform built with TypeScript and modern component architecture for intelligent productivity workflows.",
    tags: ["TypeScript", "React", "AI Integration", "Productivity"],
    url: "https://github.com/Neverfinished005/ElevAI"
  }
];

export default function SingularityCore({ onEscape }: SingularityCoreProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderSubject, setSenderSubject] = useState('Project Collaboration');
  const [senderMessage, setSenderMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusFeedback, setStatusFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'stack' | 'projects' | 'contact'>('overview');

  const handleCopyEmail = () => {
    soundEngine.playClickSound();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('rudra.vable@gmail.com')
        .then(() => {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2500);
        })
        .catch(() => {
          setCopiedEmail(false);
        });
    } else {
      setCopiedEmail(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickSound();

    if (!senderEmail.trim() || !senderMessage.trim()) {
      setFormStatus('error');
      setStatusFeedback('Please provide both your return email and a message.');
      return;
    }

    setFormStatus('submitting');
    setStatusFeedback('Transmitting message directly to rudra.vable@gmail.com...');

    const payload = {
      name: senderName.trim() || 'Visitor',
      email: senderEmail.trim(),
      _subject: `[Singularity Core] ${senderSubject} — from ${senderName.trim() || 'Visitor'}`,
      message: senderMessage.trim(),
      _replyto: senderEmail.trim()
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/rudra.vable@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (response.ok || (data && data.success === 'true')) {
        soundEngine.playClickSound();
        setFormStatus('success');
        setStatusFeedback('Message dispatched successfully! It has been delivered directly to rudra.vable@gmail.com.');
        setSenderName('');
        setSenderEmail('');
        setSenderMessage('');
      } else {
        // If first-time activation is pending on FormSubmit, notify gracefully
        if (data && typeof data.message === 'string' && data.message.includes('Activation')) {
          setFormStatus('success');
          setStatusFeedback('Transmission recorded! Rudi will receive it once one-time inbox activation is verified.');
          setSenderName('');
          setSenderEmail('');
          setSenderMessage('');
        } else {
          setFormStatus('error');
          setStatusFeedback(
            data?.message || 'Direct transmission encountered an issue. You can click below to mail Rudi directly via mailto.'
          );
        }
      }
    } catch {
      setFormStatus('error');
      setStatusFeedback('Network error contacting email dispatch. Please use the direct mailto or copy email options below.');
    }
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
              <p className="font-mono text-[11px] leading-relaxed text-zinc-300">
                &gt; "I SPWAN AT NIGHT , CODE , EXPLORE , WATCH STARS ADMIRE NATURE AND MAIN THING IF U WANT TO KNOW ME U JUST NEED TO KNOW ME &lt;&gt;"
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>GitHub Repositories</span>
                <span className="text-zinc-200 font-semibold">12 Public Repos</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Core Ecosystem</span>
                <span className="text-zinc-200">Python · TypeScript · React · 3D</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>GitHub Identity</span>
                <span className="text-zinc-200">BAT_MAN / Rudi</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Work Preference</span>
                <span className="text-emerald-400 font-medium">Open to Work / Global</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2">
              <a
                href="https://github.com/Neverfinished005"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHoverSound()}
                className="flex flex-col items-center justify-center py-2.5 px-2 border border-white/[0.08] hover:border-white/[0.2] bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-mono">GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/rudra-vable/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHoverSound()}
                className="flex flex-col items-center justify-center py-2.5 px-2 border border-white/[0.08] hover:border-white/[0.2] bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-mono">LinkedIn</span>
              </a>

              <a
                href="https://www.instagram.com/rudr_a.25"
                target="_blank"
                rel="noopener noreferrer"
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
                    rel="noopener noreferrer"
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
                      rel="noopener noreferrer"
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
                  {/* Status Banner */}
                  {formStatus !== 'idle' && (
                    <div 
                      className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                        formStatus === 'submitting'
                          ? 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                          : formStatus === 'success'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                      }`}
                    >
                      {formStatus === 'submitting' && (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
                      )}
                      {formStatus === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      )}
                      {formStatus === 'error' && (
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 text-[11px] leading-relaxed">
                        <p>{statusFeedback}</p>
                        {formStatus === 'error' && (
                          <div className="mt-2 flex items-center gap-2">
                            <a
                              href={`mailto:rudra.vable@gmail.com?subject=${encodeURIComponent(
                                `[Direct Reachout] ${senderSubject}`
                              )}&body=${encodeURIComponent(senderMessage)}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-zinc-950 rounded font-medium text-[10px] hover:bg-zinc-200 transition-colors"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Open in Mail App</span>
                            </a>
                            <button
                              type="button"
                              onClick={handleCopyEmail}
                              className="inline-flex items-center gap-1 px-2.5 py-1 border border-white/20 hover:border-white/40 rounded text-white text-[10px] transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy rudra.vable@gmail.com</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-mono text-zinc-400 mb-1.5 text-xs">
                        Your Name / Team
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        autoComplete="name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Alex / Engineering Team"
                        className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.08] focus:border-white/[0.3] rounded-lg text-white placeholder-zinc-600 focus:outline-none transition-colors text-[16px] sm:text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-zinc-400 mb-1.5 text-xs">
                        Your Email Address <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        maxLength={120}
                        autoComplete="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="e.g. alex@company.com"
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
                        className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.08] focus:border-white/[0.3] rounded-lg text-white focus:outline-none transition-colors text-[16px] sm:text-xs cursor-pointer"
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
                      Message <span className="text-emerald-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      maxLength={1500}
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      placeholder="Write your note, role details, or project scope..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.08] focus:border-white/[0.3] rounded-lg text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none text-[16px] sm:text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-[10px] font-mono text-zinc-500">
                      Direct transmission to rudra.vable@gmail.com
                    </span>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      onMouseEnter={() => soundEngine.playHoverSound()}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-medium text-xs rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Direct Message</span>
                        </>
                      )}
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
