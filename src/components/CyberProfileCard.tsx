import React from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/sfx';
import { X, Github, Linkedin, Instagram } from 'lucide-react';

interface CyberProfileCardProps {
  onClose?: () => void;
  avatarSrc?: string;
  isModal?: boolean;
}

export default function CyberProfileCard({
  onClose,
  avatarSrc = '/avatar.jpg',
  isModal = false,
}: CyberProfileCardProps) {
  // Real technical skills from GitHub repositories (AGENTOS-, ORBITGAURD, TON 618, PRISM, DemandAnalyzer)
  const attributes = [
    { label: 'PYTHON', value: 10 },
    { label: 'TYPESCRIPT', value: 9 },
    { label: '3D / SHADERS', value: 9 },
    { label: 'AI / AGENTS', value: 9 },
    { label: 'ML / DATA', value: 8 },
  ];

  // Authentic bio directly from Rudi's GitHub profile (@Neverfinished005)
  const bioText = `I SPAWN AT NIGHT, CODE, EXPLORE, WATCH STARS & ADMIRE NATURE.
IF YOU WANT TO KNOW ME YOU JUST NEED TO KNOW ME <>`;

  const cardContent = (
    <div
      className={`relative w-full ${
        isModal ? 'max-w-[360px]' : 'w-[310px] sm:w-[325px]'
      } bg-black/55 backdrop-blur-2xl text-white font-mono select-none border border-white/20 rounded-2xl p-2 sm:p-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.85),inset_0_0_20px_rgba(255,255,255,0.03)] hover:border-white/35 transition-all duration-300`}
      style={{ letterSpacing: '0.04em' }}
    >
      {/* Subtle CRT scanline texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)`
        }}
      />

      {/* ── INNER BORDER FRAME WITH CORNER CROSSHAIRS & GLASSMORPHISM ── */}
      <div className="relative border border-white/40 p-2 sm:p-2.5 bg-white/[0.02] backdrop-blur-md rounded-xl">
        
        {/* Corner Crosshairs (+) */}
        <span className="absolute -top-1.5 -left-1.5 text-[10px] leading-none text-white font-mono select-none">+</span>
        <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-none text-white font-mono select-none">+</span>
        <span className="absolute -bottom-1.5 -left-1.5 text-[10px] leading-none text-white font-mono select-none">+</span>
        <span className="absolute -bottom-1.5 -right-1.5 text-[10px] leading-none text-white font-mono select-none">+</span>

        {/* Modal Close Button */}
        {isModal && onClose && (
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onClose();
            }}
            className="absolute -top-3.5 -right-3.5 w-7 h-7 bg-white text-black font-bold flex items-center justify-center text-xs hover:bg-zinc-200 transition-colors cursor-pointer border border-black shadow-xl rounded-full z-30"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* ── TOP HEADER ROW: >CARD_ID + SIGNAL LOW [||||] ── */}
        <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-bold tracking-wider pb-1.5 border-b border-white/30">
          <span className="truncate text-white/90">
            &gt;RUDI_DEV_CARD
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[7.5px] sm:text-[8px] tracking-normal font-sans font-semibold text-white/70">SIGNAL LOW</span>
            {/* Battery indicator: 5 segments with terminal nipple */}
            <div className="flex items-center">
              <div className="w-8 sm:w-9 h-2.5 sm:h-3 border border-white/80 flex p-[1px] gap-[1px] bg-black/40">
                <div className="w-1.5 h-full bg-white" />
                <div className="w-1.5 h-full bg-white" />
                <div className="w-1.5 h-full bg-white" />
                <div className="w-1.5 h-full bg-white" />
                <div className="w-1.5 h-full bg-transparent" />
              </div>
              <div className="w-[2px] h-1.5 bg-white/80 -ml-[0.5px]" />
            </div>
          </div>
        </div>

        {/* ── SECOND ROW: KATAKANA + LOGO + ACCESS ── */}
        <div className="flex items-center justify-between py-1.5 sm:py-2 border-b border-white/30">
          {/* Left brand logo */}
          <div>
            <div className="text-[8px] sm:text-[9px] text-zinc-400 font-sans tracking-widest leading-none mb-0.5">
              エンジニア
            </div>
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-white font-sans uppercase leading-none drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]">
                RUDI$
              </span>
              <div className="flex flex-col ml-1 gap-[2px]">
                <span className="w-3 h-[2px] bg-white" />
                <span className="w-4 h-[2px] bg-white" />
                <span className="w-2.5 h-[2px] bg-white" />
              </div>
            </div>
          </div>

          {/* Right Access block */}
          <div className="text-right">
            <div className="text-[8px] sm:text-[9px] text-zinc-400 tracking-widest leading-none mb-0.5 font-sans">
              アクセス
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold tracking-wider leading-none text-white">
              ACCESS
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-widest text-zinc-300 leading-none mt-0.5">
              ******
            </div>
          </div>
        </div>

        {/* ── 2-COLUMN MAIN BODY: PHOTO (LEFT) | ATTRIBUTES (RIGHT) ── */}
        <div className="grid grid-cols-2 gap-2 py-2 sm:py-2.5 border-b border-white/30">
          
          {/* LEFT COLUMN: Rudi's Photo Frame with Matrix Background & Corner Ticks */}
          <div className="relative border border-white/50 bg-black/60 backdrop-blur-md aspect-[4/5] rounded-md overflow-hidden flex flex-col justify-end">
            {/* Subtle matrix binary rain in background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 text-[7px] text-zinc-300 overflow-hidden leading-[9px] font-mono select-none"
            >
              01010110 01100001<br />
              11010010 10101111<br />
              00101010 01010101<br />
              11100011 00110010<br />
              01010101 11010011<br />
              10101010 01010101<br />
              01110010 11010010<br />
              00101101 10101101<br />
              11010010 01010101<br />
              01010110 11001100<br />
              10101101 01010110
            </div>

            {/* Rudi's Photograph in high-contrast monochrome */}
            <img
              src={avatarSrc}
              alt="Rudra Vable"
              className="relative z-10 w-full h-full object-cover object-center"
              style={{
                filter: 'grayscale(100%) contrast(145%) brightness(95%)'
              }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* Corner ticks inside photo */}
            <div className="absolute top-1 left-1 text-[8px] text-white/70 z-20 leading-none">┌</div>
            <div className="absolute top-1 right-1 text-[8px] text-white/70 z-20 leading-none">┐</div>
            <div className="absolute bottom-1 left-1 text-[8px] text-white/70 z-20 leading-none">└</div>
            <div className="absolute bottom-1 right-1 text-[8px] text-white/70 z-20 leading-none">┘</div>
          </div>

          {/* RIGHT COLUMN: AGE + ATTRIBUTES with 10-segment bars */}
          <div className="flex flex-col justify-between text-white pl-1">
            
            {/* Repos & Square Slash Icon */}
            <div className="flex items-center justify-between pb-1 border-b border-white/20">
              <span className="text-[9.5px] sm:text-[10px] font-bold tracking-wider text-white">
                REPOS: 12
              </span>
              {/* Square with diagonal slash */}
              <div className="w-3.5 h-3.5 border border-white/80 flex items-center justify-center relative bg-white/[0.04]">
                <div className="w-[1px] h-full bg-white rotate-45 transform origin-center" />
              </div>
            </div>

            {/* Section title: ATTRIBUTES */}
            <div className="text-center py-0.5">
              <span className="text-[9px] sm:text-[9.5px] font-bold tracking-[0.25em] text-white/90">
                ATTRIBUTES
              </span>
            </div>

            {/* 5 Real Segmented meter bars */}
            <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-around py-0.5">
              {attributes.map((attr) => (
                <div key={attr.label} className="flex flex-col gap-0.5">
                  <span className="text-[7.5px] sm:text-[8px] font-bold tracking-wider text-zinc-300">
                    {attr.label}
                  </span>
                  {/* 10-Segmented block bar */}
                  <div className="flex border border-white/80 h-2 sm:h-2.5 w-full bg-black/60 p-[1px] gap-[1px] rounded-[1px]">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-full ${
                          idx < attr.value ? 'bg-white' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── BIO SECTION: REAL WORDS FROM GITHUB BIO ── */}
        <div className="py-2 border-b border-white/30 text-left">
          <div className="text-[9.5px] sm:text-[10px] font-bold text-white mb-0.5 tracking-wider">
            &gt;BIO:
          </div>
          <p className="text-[7.5px] sm:text-[8.5px] leading-relaxed font-mono uppercase text-zinc-200 whitespace-pre-line tracking-wide">
            {bioText}
            <span className="inline-block w-1.5 h-2.5 bg-white ml-1 animate-pulse align-middle" />
          </p>
        </div>

        {/* ── FOOTER: CARDBOARD BOXES ── */}
        <div className="flex items-center justify-between pt-2">
          
          {/* Left open cardboard box icon */}
          <div className="w-5 h-5 sm:w-6 sm:h-6 border border-white/60 bg-white/[0.04] backdrop-blur-sm relative flex items-center justify-center flex-shrink-0 rounded-[1px]">
            <div className="absolute -top-1 -left-1 w-2 sm:w-2.5 h-[1.5px] bg-white -rotate-45" />
            <div className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-[1.5px] bg-white rotate-45" />
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <circle cx="12" cy="12" r="8" />
              <path d="M9 10h.01M15 10h.01M9 15c1 1 5 1 6 0" />
            </svg>
          </div>

          {/* Minimalist central glassmorphic divider */}
          <div className="flex-1 mx-3 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Right open cardboard box icon */}
          <div className="w-5 h-5 sm:w-6 sm:h-6 border border-white/60 bg-white/[0.04] backdrop-blur-sm relative flex items-center justify-center flex-shrink-0 rounded-[1px]">
            <div className="absolute -top-1 -left-1 w-2 sm:w-2.5 h-[1.5px] bg-white -rotate-45" />
            <div className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-[1.5px] bg-white rotate-45" />
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <circle cx="12" cy="12" r="8" />
              <path d="M9 10h.01M15 10h.01M9 15c1 1 5 1 6 0" />
            </svg>
          </div>

        </div>

        {/* ── ACTION FOOTER: CLEAN B&W GLASSMORPHISM SOCIAL BUTTONS ── */}
        <div className="mt-2.5 pt-2 border-t border-dashed border-white/25 flex items-center justify-center gap-1.5 text-[8px] sm:text-[9px]">
          <a
            href="https://github.com/Neverfinished005"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHoverSound()}
            className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-md border border-white/20 hover:border-white/60 bg-white/[0.05] hover:bg-white/15 backdrop-blur-md text-white/85 hover:text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <Github className="w-2.5 h-2.5" />
            <span className="font-semibold tracking-wider">GITHUB</span>
          </a>
          <a
            href="https://www.linkedin.com/in/rudra-vable/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHoverSound()}
            className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-md border border-white/20 hover:border-white/60 bg-white/[0.05] hover:bg-white/15 backdrop-blur-md text-white/85 hover:text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <Linkedin className="w-2.5 h-2.5" />
            <span className="font-semibold tracking-wider">LINKEDIN</span>
          </a>
          <a
            href="https://www.instagram.com/rudr_a.25"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHoverSound()}
            className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-md border border-white/20 hover:border-white/60 bg-white/[0.05] hover:bg-white/15 backdrop-blur-md text-white/85 hover:text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <Instagram className="w-2.5 h-2.5" />
            <span className="font-semibold tracking-wider">IG</span>
          </a>
        </div>

      </div>
    </div>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="my-auto"
        >
          {cardContent}
        </motion.div>
      </div>
    );
  }

  return cardContent;
}
