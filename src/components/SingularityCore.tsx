import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/sfx';
import { 
  Radio, 
  Terminal as TerminalIcon, 
  Cpu, 
  Layers, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Activity,
  Shield,
  Disc,
  Power,
  Github,
  Linkedin,
  Instagram
} from 'lucide-react';

interface SingularityCoreProps {
  onEscape: () => void;
}

interface SkillBay {
  bayId: string;
  title: string;
  subsystem: string;
  status: string;
  color: string;
  skills: string[];
}

const AVIONICS_BAYS: SkillBay[] = [
  {
    bayId: "BAY-01",
    title: "MACHINE LEARNING & NUMERICAL COMPUTE",
    subsystem: "NEURAL CORE / INFERENCE",
    status: "ONLINE // 94% ALLOCATED",
    color: "#f59e0b", // Amber
    skills: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Hugging Face", "LLM Fine-Tuning", "RAG Pipelines", "Computer Vision"]
  },
  {
    bayId: "BAY-02",
    title: "CLIENT INTERFACE & 3D RENDERING",
    subsystem: "GRAPHICS PIPELINE / SHADERS",
    status: "ONLINE // 60 FPS NOMINAL",
    color: "#00e5ff", // Tactical Cyan
    skills: ["React 19", "TypeScript", "Three.js", "React Three Fiber", "GLSL Shaders", "Tailwind CSS", "Motion", "Vite"]
  },
  {
    bayId: "BAY-03",
    title: "RUNTIME SERVICES & PROTOCOLS",
    subsystem: "SYSTEM COMMS / APIS",
    status: "ONLINE // LOW LATENCY",
    color: "#10b981", // Emerald
    skills: ["Node.js", "Next.js", "Express", "RESTful APIs", "WebSockets", "Async Workflows", "JSON-RPC"]
  },
  {
    bayId: "BAY-04",
    title: "INFRASTRUCTURE & CONTAINERS",
    subsystem: "DEPLOYMENT MATRIX",
    status: "ONLINE // SYNCHRONIZED",
    color: "#a855f7", // Violet
    skills: ["Docker", "Linux / Bash", "Git / GitHub", "Cloud Run", "CI / CD Pipelines", "Performance Profiling", "System Optimization"]
  }
];

export default function SingularityCore({ onEscape }: SingularityCoreProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderSubject, setSenderSubject] = useState('Engineering Role / Contract');
  const [senderMessage, setSenderMessage] = useState('');
  const [transmissionSent, setTransmissionSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pilot' | 'avionics' | 'comms'>('all');
  const [systemUptime, setSystemUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `T+00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      `[STARSHIP TERMINAL] ${senderSubject} // FROM: ${senderName || 'Anonymous Operator'}`
    )}&body=${encodeURIComponent(senderMessage || 'Terminal transmission received from Singularity OS flight deck.')}`;

    window.open(mailtoUrl, '_blank');
    setTimeout(() => setTransmissionSent(false), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[150] overflow-y-auto overflow-x-hidden bg-[#06080c] text-white font-mono selection:bg-cyan-500/20 selection:text-cyan-300"
    >
      {/* Background Flight Grid & Scanlines */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.06)_0%,rgba(0,0,0,0.85)_80%)]" />

      {/* ── MFD FLIGHT DECK TOP COMMAND BAR ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080b11]/95 backdrop-blur-md px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Ship Registry & Horizon Telemetry */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-black/60 border border-white/10 text-[9px] tracking-wider text-white/80">
              <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
              <span className="text-white font-bold">MFD // TON-618</span>
              <span className="text-white/30">|</span>
              <span className="text-amber-400">R &lt; Rs DEEP HORIZON</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[9px] text-white/40 tracking-widest uppercase">
              <span>UPTIME: {formatUptime(systemUptime)}</span>
              <span>•</span>
              <span>PRESSURE: NOMINAL</span>
              <span>•</span>
              <span className="text-cyan-400/80">CORE STABILITY: 99.8%</span>
            </div>
          </div>

          {/* Quick Subsystem Nav Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 border border-white/10 text-[9px]">
            {(['all', 'pilot', 'avionics', 'comms'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundEngine.playClickSound();
                  setActiveTab(tab);
                }}
                onMouseEnter={() => soundEngine.playHoverSound()}
                className={`px-3 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'all' ? '00 // ALL BUSES' : tab === 'pilot' ? '01 // PILOT' : tab === 'avionics' ? '02 // AVIONICS' : '03 // COMMS'}
              </button>
            ))}
          </div>

          {/* Emergency Eject / Warp Out */}
          <button
            onClick={() => {
              soundEngine.playWarpExitSound();
              onEscape();
            }}
            onMouseEnter={() => soundEngine.playHoverSound()}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <Power className="w-3.5 h-3.5 text-red-400" />
            <span>DISENGAGE // WARP OUT</span>
          </button>
        </div>
      </header>

      {/* ── MAIN COCKPIT DASHBOARD AREA ── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 relative z-10">

        {/* ── TOP COCKPIT BANNER ── */}
        <div className="border border-white/10 bg-[#0b0e14]/80 p-4 sm:p-5 relative overflow-hidden">
          {/* Tech Corner Brackets */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[9px] text-cyan-400 tracking-[0.25em] uppercase mb-1">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>SPACECRAFT TERMINAL INTERFACE // STATION OPERATOR MANIFEST</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase">
                RUDI // RUDRA VABLE
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-3xl leading-relaxed">
                Full-stack developer &amp; machine learning practitioner. Architecting web platforms, deep learning pipelines, and real-time graphics engines.
              </p>
            </div>

            {/* Live Telemetry Radar Display */}
            <div className="flex items-center gap-4 bg-black/60 border border-white/10 p-3 self-start lg:self-auto">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan-500/30" />
                <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-500/20" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-500/20" />
                <div 
                  className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" 
                  style={{ animationDuration: '4s' }} 
                />
                <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping" />
              </div>

              <div className="text-[9px] space-y-0.5 text-white/60">
                <div className="text-white font-bold">HORIZON BEACON</div>
                <div>AZIMUTH: <span className="text-cyan-300">328.4°</span></div>
                <div>GRAV LOAD: <span className="text-amber-400">42.8 G</span></div>
                <div>GEODESIC: <span className="text-emerald-400">LOCKED</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: PILOT TELEMETRY CARD ── */}
        {(activeTab === 'all' || activeTab === 'pilot') && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Bio & Credentials Box */}
            <div className="lg:col-span-2 border border-white/10 bg-[#090c12]/90 p-5 relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-4 text-[10px] text-white/40 tracking-wider">
                <div className="flex items-center gap-2 text-white">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold">SYSTEM IDENTITY // OPERATOR CREDENTIALS</span>
                </div>
                <span>ID: RUDI-005-SEC</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 bg-black/40 p-3 border border-white/5">
                  <span className="text-[9px] text-white/40 uppercase tracking-wider block">OPERATOR PROFILE</span>
                  <div className="text-white font-bold text-sm">Rudra Vable</div>
                  <div className="text-white/60 text-[11px]">Pune, India // Planet Earth</div>
                  <div className="text-emerald-400 text-[10px] flex items-center gap-1.5 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    STATUS: READY FOR CONTRACT / FULL-TIME WORK
                  </div>
                </div>

                <div className="space-y-2 bg-black/40 p-3 border border-white/5">
                  <span className="text-[9px] text-white/40 uppercase tracking-wider block">CORE DIRECTIVE</span>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Engineering reliable, scalable full-stack applications combined with applied deep learning and real-time 3D spatial web environments.
                  </p>
                </div>
              </div>

              {/* Subsystem Allocation Progress Bars */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-[10px]">
                <div className="flex justify-between text-white/60">
                  <span>FULL-STACK ARCHITECTURE &amp; APIS</span>
                  <span className="text-cyan-400">96% // PROFICIENT</span>
                </div>
                <div className="w-full bg-black h-1.5 border border-white/10">
                  <div className="bg-cyan-400 h-full" style={{ width: '96%' }} />
                </div>

                <div className="flex justify-between text-white/60 pt-1">
                  <span>MACHINE LEARNING &amp; MODEL PIPELINES</span>
                  <span className="text-amber-400">90% // ACTIVE DEPLOYMENT</span>
                </div>
                <div className="w-full bg-black h-1.5 border border-white/10">
                  <div className="bg-amber-400 h-full" style={{ width: '90%' }} />
                </div>

                <div className="flex justify-between text-white/60 pt-1">
                  <span>3D GRAPHICS &amp; SHADER PROGRAMMING</span>
                  <span className="text-emerald-400">86% // OPERATIONAL</span>
                </div>
                <div className="w-full bg-black h-1.5 border border-white/10">
                  <div className="bg-emerald-400 h-full" style={{ width: '86%' }} />
                </div>
              </div>
            </div>

            {/* Quick Specs Manifest */}
            <div className="border border-white/10 bg-[#090c12]/90 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3 text-[10px] text-white font-bold tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>SHIP DIAGNOSTICS &amp; METRICS</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">ENGINEERING DISCIPLINE</span>
                    <span className="text-white">Full Stack &amp; ML</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">CODEBASE REPOSITORIES</span>
                    <span className="text-cyan-400">30+ Hosted Projects</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">SPECIALIZED RUNTIME</span>
                    <span className="text-white">Node / Python / WebGL</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">SYSTEM SECURITY</span>
                    <span className="text-emerald-400">Deterministic &amp; Type-Safe</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[9px] text-white/40">
                <span>TERMINAL_ID: TON-618</span>
                <span>OS_KERNEL: v6.4.2</span>
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 2: AVIONICS BAYS (THE SKILLS MATRIX) ── */}
        {(activeTab === 'all' || activeTab === 'avionics') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-white tracking-wider font-bold">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AVIONICS RACKS // TECHNICAL CAPABILITIES</span>
              </div>
              <span className="text-white/40 text-[9px] font-normal">MODULES: 4/4 ONLINE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVIONICS_BAYS.map((bay) => (
                <div
                  key={bay.bayId}
                  className="border border-white/10 bg-[#090c12]/90 p-4 relative group hover:border-white/20 transition-all duration-200"
                  onMouseEnter={() => soundEngine.playHoverSound()}
                >
                  {/* Left Color Indicator Bar */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 w-1" 
                    style={{ backgroundColor: bay.color }} 
                  />

                  {/* Rack Header */}
                  <div className="flex items-start justify-between mb-3 pl-2 border-b border-white/5 pb-2">
                    <div>
                      <div className="text-[9px] text-white/40 tracking-wider">
                        {bay.bayId} // {bay.subsystem}
                      </div>
                      <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5">
                        {bay.title}
                      </h2>
                    </div>
                    <span 
                      className="text-[8px] font-mono px-1.5 py-0.5 border"
                      style={{ 
                        borderColor: `${bay.color}40`, 
                        color: bay.color,
                        backgroundColor: `${bay.color}10`
                      }}
                    >
                      {bay.status}
                    </span>
                  </div>

                  {/* Skills Module Badges */}
                  <div className="flex flex-wrap gap-1.5 pl-2 pt-1">
                    {bay.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-black/50 border border-white/10 hover:border-white/30 text-[10px] text-white/80 hover:text-white transition-colors cursor-default"
                        onMouseEnter={() => soundEngine.playHoverSound()}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SECTION 3: SUB-SPACE COMMS & NAV BEACONS ── */}
        {(activeTab === 'all' || activeTab === 'comms') && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Direct Comms Terminal (2 Cols) */}
            <div className="lg:col-span-2 border border-white/10 bg-[#090c12]/90 p-5 relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-4 text-[10px] text-white/40 tracking-wider">
                <div className="flex items-center gap-2 text-white font-bold">
                  <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SUB-SPACE TRANSMISSION RELAY // DIRECT CONTACT</span>
                </div>
                <span className="text-emerald-400 flex items-center gap-1.5 text-[9px]">
                  <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                  CHANNEL READY
                </span>
              </div>

              <form onSubmit={handleSendTransmission} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">
                      &gt; SENDER CALLSIGN / NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. John Doe / Engineering Recruiter"
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">
                      &gt; OBJECTIVE / TOPIC
                    </label>
                    <select
                      value={senderSubject}
                      onChange={(e) => setSenderSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="Engineering Role / Contract">Engineering Role / Contract</option>
                      <option value="Project Collaboration">Project Collaboration</option>
                      <option value="Machine Learning Consultation">Machine Learning Consultation</option>
                      <option value="General Transmission">General Transmission</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">
                    &gt; TRANSMISSION PAYLOAD (MESSAGE)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Enter project details, inquiry, or message payload..."
                    className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    onMouseEnter={() => soundEngine.playHoverSound()}
                    className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'COPIED TO CLIPBOARD' : 'COPY EMAIL ADDRESS'}</span>
                  </button>

                  <button
                    type="submit"
                    onMouseEnter={() => soundEngine.playHoverSound()}
                    className="flex items-center gap-2 px-5 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{transmissionSent ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Navigational Orbital Beacons (1 Col) */}
            <div className="border border-white/10 bg-[#090c12]/90 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3 text-[10px] text-white font-bold tracking-wider">
                  <Disc className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ORBITAL REPOSITORIES &amp; BEACONS</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <a
                    href="https://github.com/Neverfinished005"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => soundEngine.playHoverSound()}
                    className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 hover:border-white/20 text-white transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Github className="w-4 h-4 text-white/60 group-hover:text-white" />
                      <div>
                        <div className="font-bold text-[11px]">GITHUB ARCHIVE</div>
                        <div className="text-[9px] text-white/40">@Neverfinished005</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/rudra-vable/"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => soundEngine.playHoverSound()}
                    className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 hover:border-blue-500/30 text-white transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Linkedin className="w-4 h-4 text-[#0a84ff]" />
                      <div>
                        <div className="font-bold text-[11px]">LINKEDIN NETWORK</div>
                        <div className="text-[9px] text-white/40">/in/rudra-vable</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-blue-400" />
                  </a>

                  <a
                    href="https://www.instagram.com/rudr_a.25"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => soundEngine.playHoverSound()}
                    className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 hover:border-pink-500/30 text-white transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Instagram className="w-4 h-4 text-[#e1306c]" />
                      <div>
                        <div className="font-bold text-[11px]">INSTAGRAM FEED</div>
                        <div className="text-[9px] text-white/40">@rudr_a.25</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-pink-400" />
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-white/30">
                <span>BEACON STATUS: ACTIVE</span>
                <button
                  onClick={() => {
                    soundEngine.playWarpExitSound();
                    onEscape();
                  }}
                  className="text-cyan-400 hover:text-white underline cursor-pointer"
                >
                  RETURN TO EXTERIOR
                </button>
              </div>
            </div>
          </section>
        )}

      </main>
    </motion.div>
  );
}
