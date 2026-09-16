import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor trailing ring
  const springX = useSpring(mouseX, { damping: 25, stiffness: 250 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 250 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({
        x: Math.round((e.clientX / window.innerWidth) * 200 - 100),
        y: Math.round((e.clientY / window.innerHeight) * 200 - 100),
      });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer');
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Gravitational Lensing Ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-cyan-400/40 backdrop-invert-[0.1]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 48 : isClicked ? 24 : 32,
          height: isHovered ? 48 : isClicked ? 24 : 32,
          boxShadow: isHovered
            ? '0 0 16px rgba(6,182,212,0.4), inset 0 0 8px rgba(6,182,212,0.3)'
            : '0 0 8px rgba(255,255,255,0.2)',
          transition: 'width 0.2s, height 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Reticle tick marks */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-cyan-400/80" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-cyan-400/80" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-1 bg-cyan-400/80" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-1 bg-cyan-400/80" />
      </motion.div>

      {/* Central Laser Point */}
      <motion.div
        className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isClicked ? 0.6 : 1,
        }}
      />

      {/* Live Coordinate Badge */}
      <motion.div
        className="absolute top-0 left-0 ml-5 mt-5 font-mono text-[8px] tracking-widest text-cyan-400/70 select-none uppercase"
        style={{
          x: springX,
          y: springY,
        }}
      >
        <span>[{coords.x}, {coords.y}]</span>
      </motion.div>
    </div>
  );
}
