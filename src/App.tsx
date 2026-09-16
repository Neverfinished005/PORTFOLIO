/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Zap, Compass } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useState, useEffect, useRef } from 'react';
import BlackHole3D from './components/BlackHole';
import SingularityCore from './components/SingularityCore';
import CustomCursor from './components/CustomCursor';
import { soundEngine } from './utils/sfx';
import * as THREE from 'three';

// — Rudi's real social links —
const PORTFOLIO_PROJECTS = [
  {
    title: "GitHub",
    handle: "Neverfinished005",
    category: "Source / Code",
    description: "Explore my repositories, experiments, and open-source work.",
    details: "From ML pipelines to full-stack web apps — everything lives here. Feel free to star, fork, or contribute.",
    tags: ["Open Source", "ML", "Full Stack"],
    actionLabel: "Open_GitHub",
    url: "https://github.com/Neverfinished005",
    pos: [6, 1, -2],
    color: "#e8e8e8",
    icon: "github"
  },
  {
    title: "LinkedIn",
    handle: "rudra-vable",
    category: "Professional",
    description: "Connect with me professionally — open to collabs and opportunities.",
    details: "Building skills in ML & AI while shipping cool sites. Always learning, always shipping.",
    tags: ["Networking", "Career", "Connect"],
    actionLabel: "Connect_In",
    url: "https://www.linkedin.com/in/rudra-vable/",
    pos: [-5, -2, -5],
    color: "#0a84ff",
    icon: "linkedin"
  },
  {
    title: "Instagram",
    handle: "rudr_a.25",
    category: "Creative",
    description: "Behind-the-scenes, builds, and whatever catches my eye.",
    details: "Not just code — also the aesthetics, the process, and random things I find interesting.",
    tags: ["Creative", "Design", "Life"],
    actionLabel: "Follow_Me",
    url: "https://www.instagram.com/rudr_a.25",
    pos: [0, 4, -6],
    color: "#e1306c",
    icon: "instagram"
  }
];

const AUDIO_TRACKS = [
  {
    title: "Zero Gravity",
    artist: "Orbital Waves",
    src: "/audio/portfolio-ambient-2.mp3"
  },
  {
    title: "Interstellar — Oppenheimer",
    artist: "Hans Zimmer",
    src: "/audio/oppenheimer-interstellar.mp3"
  }
];

const WarpAnchors = ({ activeIndex }: { activeIndex: number }) => {
  return (
    <group>
      {PORTFOLIO_PROJECTS.map((p, i) => {
        const angle = (i / PORTFOLIO_PROJECTS.length) * Math.PI * 2;
        const radius = 14;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const rotY = -angle + Math.PI / 2;

        const isActive = i === activeIndex;

        return (
          <group key={p.title} position={[x, 0, z]} rotation={[0, rotY, 0]}>
            <mesh>
              <ringGeometry args={[0.4, 0.5, 32]} />
              <meshBasicMaterial color={isActive ? p.color : "#ffffff"} transparent opacity={isActive ? 0.4 : 0.05} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.0, 1.02, 64]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const PortfolioScene = ({
  mass,
  spin,
  activeIndex,
  scrollRef,
  isFreeCam,
  isWarping,
  warpIntensity,
}: {
  mass: number;
  spin: number;
  activeIndex: number;
  scrollRef: React.MutableRefObject<number>;
  isFreeCam: boolean;
  isWarping: boolean;
  warpIntensity: number;
}) => {
  useFrame((state) => {
    if (isWarping) {
      // Warp dive: plunge straight through the singularity (y=0, x=0, z=0)
      const warpTarget = new THREE.Vector3(0, 0, 0);
      state.camera.position.lerp(warpTarget, 0.07);
      // Add relativistic turbulence / camera shake
      const shake = (Math.random() - 0.5) * warpIntensity * 1.8;
      state.camera.position.x += shake;
      state.camera.position.y += shake;
      state.camera.lookAt(0, 0, 0);
      return;
    }

    if (isFreeCam) {
      // Camera controlled by OrbitControls
      return;
    }

    const targetAngle = (activeIndex / PORTFOLIO_PROJECTS.length) * Math.PI * 2;
    const bhX = Math.cos(targetAngle) * 26;
    const bhZ = Math.sin(targetAngle) * 26;
    const t = state.clock.getElapsedTime();
    const bhY = Math.sin(t * 0.5) * 1.5;

    // Destination when scrolled fully into the black hole (scroll = 1)
    const bhTargetPos = new THREE.Vector3(bhX, bhY, bhZ);
    // Starting position (orbit vantage point)
    const galaxyTargetPos = new THREE.Vector3(0, 15, 60);

    const scroll = scrollRef.current;
    const easeScroll = scroll < 0.5 ? 2 * scroll * scroll : 1 - Math.pow(-2 * scroll + 2, 2) / 2;

    const currentTargetPos = new THREE.Vector3().lerpVectors(galaxyTargetPos, bhTargetPos, easeScroll);
    state.camera.position.lerp(currentTargetPos, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {isFreeCam && (
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={6}
          maxDistance={90}
          makeDefault
        />
      )}
      <BlackHole3D mass={mass} spin={spin} zoom={0} scrollRef={scrollRef} warpIntensity={warpIntensity} />
      <WarpAnchors activeIndex={activeIndex} />
    </>
  );
};

const PerfHUD = () => {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0;
    let lastTime = performance.now();
    const update = () => {
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frames);
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(update);
    };
    const id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[60] font-mono text-[8px] uppercase tracking-[0.4em] opacity-50 flex flex-col gap-1.5 pointer-events-none text-white select-none">
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
        <span>Core_Stable // TON_618</span>
      </div>
      <div className="flex items-center gap-2.5 text-cyan-400">
        <div className="w-1 h-1 bg-current" />
        <span>FPS: {fps}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [mass, setMass] = useState(0.5);
  const [spin, setSpin] = useState(0.85);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playerVolume, setPlayerVolume] = useState(0.58);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hasScrolledDown, setHasScrolledDown] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // New Features: Free-cam & Event Horizon Warp Plunge
  const [isFreeCam, setIsFreeCam] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [warpIntensity, setWarpIntensity] = useState(0);
  const [isInsideSingularity, setIsInsideSingularity] = useState(false);

  // ── PUT YOUR PHOTO HERE ──────────────────────────────────────
  // Drop your image in the public/ folder (e.g. public/avatar.jpg)
  // then update the path below:
  const AVATAR_SRC = '/avatar.jpg';
  // ─────────────────────────────────────────────────────────────

  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollRef.current = latest;
    if (latest > 0.9) {
      setHasScrolledDown(true);
    } else {
      setHasScrolledDown(false);
      setHoveredCard(null);
    }
  });

  const currentTrack = AUDIO_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = playerVolume;
  }, [playerVolume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.play().catch(() => {
        setIsMusicPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isMusicPlaying, currentTrack]);

  useEffect(() => {
    let hasPlayed = false;
    const handleInteraction = () => {
      if (audioRef.current) {
        soundEngine.initAudioElement(audioRef.current);
      }
      if (hasPlayed || !audioRef.current) return;

      audioRef.current.play()
        .then(() => {
          hasPlayed = true;
          setIsMusicPlaying(true);
          ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(evt =>
            document.removeEventListener(evt, handleInteraction)
          );
        })
        .catch(() => { });
    };

    ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(evt =>
      document.addEventListener(evt, handleInteraction)
    );

    if (audioRef.current) {
      soundEngine.initAudioElement(audioRef.current);
      audioRef.current.play().then(() => {
        hasPlayed = true;
        setIsMusicPlaying(true);
      }).catch(() => { });
    }

    return () => {
      ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(evt =>
        document.removeEventListener(evt, handleInteraction)
      );
    };
  }, []);

  const handleNextTrack = () => {
    soundEngine.playClickSound();
    setCurrentTrackIndex((index) => (index + 1) % AUDIO_TRACKS.length);
    setIsMusicPlaying(true);
  };

  const handlePrevTrack = () => {
    soundEngine.playClickSound();
    setCurrentTrackIndex((index) => (index - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length);
    setIsMusicPlaying(true);
  };

  const handleCrossEventHorizon = () => {
    if (isWarping) return;
    setIsWarping(true);
    setIsFreeCam(false);
    soundEngine.playWarpDiveSound();
    soundEngine.setRedshiftFilter(true);

    let start: number | null = null;
    const duration = 1400; // ms

    const animateWarp = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setWarpIntensity(progress);

      if (progress < 1) {
        requestAnimationFrame(animateWarp);
      } else {
        setIsWarping(false);
        setWarpIntensity(0);
        setIsInsideSingularity(true);
      }
    };

    requestAnimationFrame(animateWarp);
  };

  const handleEscapeSingularity = () => {
    setIsInsideSingularity(false);
    soundEngine.setRedshiftFilter(false);
  };

  return (
    <main className="relative bg-black text-white min-h-screen w-screen overflow-x-hidden">
      {/* Sci-Fi Gravitational Reticle Cursor */}
      <CustomCursor />

      <div className="h-[200vh]">
        {/* Main 3D Scene */}
        <div className={`fixed inset-0 z-0 bg-black ${isFreeCam ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <Canvas
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}
            frameloop={isInsideSingularity ? "never" : "always"}
            gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
          >
            <PerspectiveCamera makeDefault position={[0, 4, 30]} fov={60} />
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <PortfolioScene
              mass={mass}
              spin={spin}
              activeIndex={activeIndex}
              scrollRef={scrollRef}
              isFreeCam={isFreeCam}
              isWarping={isWarping}
              warpIntensity={warpIntensity}
            />
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={1.1 + warpIntensity * 1.5}
                luminanceThreshold={0.25}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.1} darkness={1.1 + warpIntensity * 0.4} />
            </EffectComposer>
          </Canvas>
        </div>

        {/* ── FREE-CAM 360 ORBIT TOGGLE (top-right) ── */}
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClickSound();
              setIsFreeCam((v) => !v);
            }}
            onMouseEnter={() => soundEngine.playHoverSound()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg ${
              isFreeCam
                ? 'border-cyan-400/80 bg-cyan-950/70 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)] backdrop-blur-md'
                : 'border-white/10 bg-black/70 text-white/50 hover:text-white hover:border-white/30 backdrop-blur-md'
            }`}
            title={isFreeCam ? 'Switch to Cinematic Scroll Camera' : 'Switch to Interactive 360° Free Camera'}
          >
            <Compass className={`w-3 h-3 ${isFreeCam ? 'text-cyan-400 animate-spin' : 'text-white/40'}`} style={{ animationDuration: '6s' }} />
            <span>{isFreeCam ? 'FREE 360° ORBIT' : 'AUTO CAM'}</span>
          </button>
        </div>

        {/* Black Hole Page Title — fades IN when scrolled */}
        <div className="fixed inset-0 z-10 pointer-events-none flex items-end justify-center pb-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: hasScrolledDown && !isInsideSingularity ? 1 : 0, y: hasScrolledDown ? 0 : 30 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center select-none"
          >
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(9px, 0.9vw, 13px)',
              letterSpacing: '0.6em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.20)',
              fontWeight: 300,
              marginBottom: '0.6rem',
            }}>
              RUDI — RUDRA VABLE
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 5vw, 80px)',
              letterSpacing: '0.55em',
              textTransform: 'uppercase',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.25)',
              lineHeight: 1,
              textShadow: '0 0 40px rgba(255,255,255,0.05)',
              paddingLeft: '0.55em',
            }}>
              TON 618
            </h2>
          </motion.div>
        </div>

        {/* ── CROSS EVENT HORIZON CTA BUTTON ── */}
        <div className="fixed inset-0 z-20 pointer-events-none flex items-end justify-center pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hasScrolledDown && !isInsideSingularity ? 1 : 0,
              y: hasScrolledDown && !isInsideSingularity ? 0 : 20,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className={hasScrolledDown && !isInsideSingularity ? 'pointer-events-auto text-center' : 'pointer-events-none text-center'}
          >
            <button
              type="button"
              onClick={handleCrossEventHorizon}
              onMouseEnter={() => soundEngine.playHoverSound()}
              disabled={isWarping}
              className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-amber-500/50 bg-black/85 hover:bg-amber-500/10 text-amber-300 hover:text-amber-200 font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_45px_rgba(245,158,11,0.5)] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform animate-pulse" />
              <span>{isWarping ? 'COLLAPSING GEODESIC...' : 'CROSS EVENT HORIZON'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping ml-0.5" />
            </button>
            <p className="font-mono text-[8px] tracking-[0.4em] uppercase text-white/30 mt-2">
              Tidal Warning: Severe Spacetime Curvature
            </p>
          </motion.div>
        </div>

        {/* ── GRAVITY TETHER SOCIAL CARDS (right side) ── */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-5 pr-0 md:gap-7">
          {PORTFOLIO_PROJECTS.map((project, i) => {
            const isOpen = hoveredCard === i;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: 80 }}
                animate={{
                  opacity: hasScrolledDown && !isInsideSingularity ? 1 : 0,
                  x: hasScrolledDown && !isInsideSingularity ? 0 : 80,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.12 }}
                className="relative flex items-center justify-end"
              >
                {/* Gravity tether line */}
                <div
                  className="absolute right-full top-1/2 -translate-y-1/2 h-[1px] pointer-events-none transition-all duration-500"
                  style={{
                    width: isOpen ? '40px' : '16px',
                    background: `linear-gradient(to left, ${project.color}80, transparent)`,
                  }}
                />

                {/* The card itself */}
                <div
                  className="relative overflow-hidden cursor-pointer select-none"
                  style={{
                    width: isOpen ? (window.innerWidth < 640 ? '220px' : '260px') : '32px',
                    transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
                    borderLeft: isOpen ? `2px solid ${project.color}60` : '2px solid transparent',
                    borderTop: `1px solid ${isOpen ? project.color + '40' : 'transparent'}`,
                    borderBottom: `1px solid ${isOpen ? project.color + '40' : 'transparent'}`,
                    background: isOpen
                      ? `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, ${project.color}0d 100%)`
                      : 'transparent',
                    backdropFilter: isOpen ? 'blur(20px)' : 'none',
                    boxShadow: isOpen ? `0 0 30px ${project.color}20, inset 0 0 20px ${project.color}08` : 'none',
                  }}
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  onClick={() => {
                    soundEngine.playClickSound();
                    setHoveredCard(isOpen ? null : i);
                  }}
                >
                  <div className="flex items-stretch" style={{ minWidth: '32px' }}>
                    <div
                      className="flex-shrink-0 flex items-center justify-center py-2"
                      style={{ width: '32px' }}
                    >
                      {project.icon === 'github' && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      )}
                      {project.icon === 'linkedin' && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={project.color}>
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {project.icon === 'instagram' && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={project.color}>
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                    </div>

                    <div
                      className="flex-1 py-2 pr-3 min-w-0"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        transitionDelay: isOpen ? '0.2s' : '0s',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-white text-sm tracking-tight leading-none">{project.title}</span>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={() => soundEngine.playHoverSound()}
                          className="flex-shrink-0 ml-2"
                          style={{ color: project.color }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                        </a>
                      </div>
                      <p className="font-mono text-[9px] text-white/40 mb-1.5 truncate">@{project.handle}</p>
                      <p className="font-mono text-[9px] leading-relaxed" style={{ color: project.color + 'cc' }}>
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 h-[1px] transition-all duration-700"
                    style={{
                      width: isOpen ? '100%' : '0%',
                      background: `linear-gradient(to right, ${project.color}, transparent)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.src}
          preload="auto"
          autoPlay
          onEnded={handleNextTrack}
        />

        <PerfHUD />

        {/* ── MUSIC PLAYER (top-center) ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: hasScrolledDown && !isInsideSingularity ? 1 : 0, y: hasScrolledDown ? 0 : -20 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto
            flex items-center gap-3 p-1.5 border border-white/10 bg-black/70 backdrop-blur-md rounded-full shadow-lg
            max-w-[calc(100vw-2rem)]"
        >
          <button
            type="button"
            onClick={handlePrevTrack}
            onMouseEnter={() => soundEngine.playHoverSound()}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition flex-shrink-0 cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClickSound();
              setIsMusicPlaying(v => !v);
            }}
            onMouseEnter={() => soundEngine.playHoverSound()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition transform flex-shrink-0 cursor-pointer"
          >
            {isMusicPlaying
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}><polygon points="5 3 19 12 5 21 5 3" /></svg>}
          </button>
          <button
            type="button"
            onClick={handleNextTrack}
            onMouseEnter={() => soundEngine.playHoverSound()}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition flex-shrink-0 cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
          </button>
          <div className="flex flex-col justify-center px-3 border-l border-white/10 min-w-0 hidden sm:flex">
            <span className="text-[9px] uppercase tracking-widest text-white font-mono truncate max-w-[120px]">{currentTrack.title}</span>
            <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono truncate max-w-[120px]">{currentTrack.artist}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 pr-3 border-l border-white/10 pl-3">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 flex-shrink-0"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
            <input type="range" min="0" max="1" step="0.01" value={playerVolume}
              onChange={e => setPlayerVolume(parseFloat(e.target.value))}
              className="w-14 h-1 bg-white/20 rounded-full appearance-none accent-white cursor-pointer" />
          </div>
        </motion.div>

        {/* ── PROFILE CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: hasScrolledDown && !isInsideSingularity ? 1 : 0, y: hasScrolledDown ? 0 : 40 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="fixed z-50 pointer-events-auto bottom-4 left-4 sm:bottom-6 sm:left-6 sm:w-72"
        >
          {/* MOBILE: small avatar circle */}
          <button
            className="sm:hidden w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden shadow-xl backdrop-blur-xl bg-black/60 flex items-center justify-center cursor-pointer"
            style={{ boxShadow: '0 0 20px rgba(74,144,226,0.3)' }}
            onMouseEnter={() => soundEngine.playHoverSound()}
            onClick={() => {
              soundEngine.playClickSound();
              setProfileOpen(true);
            }}
          >
            {AVATAR_SRC
              ? <img src={AVATAR_SRC} alt="Rudi" className="w-full h-full object-cover" />
              : <span className="font-black text-white text-xl">R</span>
            }
          </button>

          {/* DESKTOP: full card */}
          <div className="hidden sm:block border border-white/10 bg-black/75 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,255,255,0.02)' }}
          >
            <div className="relative w-full aspect-square flex items-center justify-center"
              style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)' }}
            >
              {AVATAR_SRC
                ? <img src={AVATAR_SRC} alt="Rudi" className="w-full h-full object-cover" />
                : (
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="font-mono text-[7px] text-white/20 uppercase tracking-widest">Add Photo</span>
                  </div>
                )
              }
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)' }}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="font-black text-white text-xl uppercase tracking-tighter leading-none">Rudi</h2>
                  <p className="font-mono text-[9px] tracking-[0.4em] uppercase mt-0.5" style={{ color: '#4a90e2' }}>Rudra Vable</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[7px] text-white/30 uppercase tracking-widest">Open to work</span>
                </div>
              </div>
              <p className="font-mono text-[10px] text-white/50 leading-relaxed mt-2 mb-3">
                Full-stack dev &amp; ML learner.<br />I build cool sites and dig deep into AI.
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {['ML / AI', 'Full Stack', 'Web Design'].map(t => (
                  <span key={t} className="font-mono text-[7px] uppercase tracking-widest border border-white/10 text-white/40 px-1.5 py-0.5 rounded-sm">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2.5 border-t border-white/10">
                <a
                  href="https://github.com/Neverfinished005"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                  <span className="font-mono text-[8px]">GH</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/rudra-vable/"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border border-white/10 text-white/40 hover:text-[#0a84ff] hover:border-[#0a84ff]/40 transition-all duration-200"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  <span className="font-mono text-[8px]">LI</span>
                </a>
                <a
                  href="https://www.instagram.com/rudr_a.25"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border border-white/10 text-white/40 hover:text-[#e1306c] hover:border-[#e1306c]/40 transition-all duration-200"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  <span className="font-mono text-[8px]">IG</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MOBILE PROFILE MODAL */}
        {profileOpen && (
          <motion.div
            className="sm:hidden fixed inset-0 z-[200] flex items-end pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProfileOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative w-full border-t border-white/10 bg-black/90 backdrop-blur-2xl rounded-t-3xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              <div className="flex gap-4 p-5 pt-2">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5 flex items-center justify-center">
                  {AVATAR_SRC
                    ? <img src={AVATAR_SRC} alt="Rudi" className="w-full h-full object-cover" />
                    : <span className="font-black text-white text-3xl">R</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-white text-2xl uppercase tracking-tighter leading-none">Rudi</h2>
                  <p className="font-mono text-[9px] tracking-[0.4em] uppercase mt-0.5 mb-2" style={{ color: '#4a90e2' }}>Rudra Vable</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[7px] text-white/30 uppercase tracking-widest">Open to work</span>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-2">
                <p className="font-mono text-[11px] text-white/50 leading-relaxed mb-3">
                  Full-stack dev &amp; ML learner.<br />I build cool sites and dig deep into AI.
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {['ML / AI', 'Full Stack', 'Web Design'].map(t => (
                    <span key={t} className="font-mono text-[8px] uppercase tracking-widest border border-white/10 text-white/40 px-2 py-1 rounded">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 pb-6">
                  <a href="https://github.com/Neverfinished005" target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    <span className="font-mono text-[10px]">GitHub</span>
                  </a>
                  <a href="https://www.linkedin.com/in/rudra-vable/" target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-[#0a84ff] hover:border-[#0a84ff]/40 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span className="font-mono text-[10px]">LinkedIn</span>
                  </a>
                  <a href="https://www.instagram.com/rudr_a.25" target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-[#e1306c] hover:border-[#e1306c]/40 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <span className="font-mono text-[10px]">Instagram</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <section className="h-screen w-full flex items-center justify-center pointer-events-none relative z-10">
          {/* First page is kept completely empty of text */}
        </section>

        <section className="h-screen w-full pointer-events-none relative z-10" />
      </div>

      {/* Inside the Singularity Interior Dimension */}
      <AnimatePresence>
        {isInsideSingularity && (
          <SingularityCore onEscape={handleEscapeSingularity} />
        )}
      </AnimatePresence>

      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_2px,2px_100%]" />
    </main>
  );
}
