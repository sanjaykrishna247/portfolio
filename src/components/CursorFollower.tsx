import { useEffect, useRef, useState, useCallback } from "react";

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

const CursorFollower = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const [isInside, setIsInside] = useState(false);
  const insideRef = useRef(false);
  const rafRef = useRef<number>(0);

  const handleMouseEnter = useCallback(() => {
    setIsInside(true);
    insideRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsInside(false);
    insideRef.current = false;
    mouseRef.current = { x: -100, y: -100 };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (!insideRef.current) {
      insideRef.current = true;
      setIsInside(true);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const trail = trailRef.current;

      if (insideRef.current && mouse.x > 0 && mouse.y > 0) {
        trail.push({ x: mouse.x, y: mouse.y, opacity: 0.9, scale: 1 });
      }

      while (trail.length > 20) trail.shift();

      for (let i = 0; i < trail.length; i++) {
        const dot = trail[i];
        const progress = i / trail.length;

        dot.opacity *= 0.9;
        dot.scale *= 0.95;

        if (dot.opacity < 0.01) continue;

        const size = 3 + progress * 10;
        const alpha = dot.opacity * progress;

        // Outer warm glow
        const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, size * 2.5);
        gradient.addColorStop(0, `hsla(24, 95%, 53%, ${alpha * 0.5})`);
        gradient.addColorStop(0.4, `hsla(16, 90%, 48%, ${alpha * 0.2})`);
        gradient.addColorStop(1, `hsla(16, 80%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size * 0.35 * dot.scale, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(35, 100%, 70%, ${alpha})`;
        ctx.fill();
      }

      // Main cursor dot
      if (insideRef.current && mouse.x > 0 && mouse.y > 0) {
        // Soft ambient glow
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 35);
        glow.addColorStop(0, `hsla(24, 95%, 55%, 0.12)`);
        glow.addColorStop(1, `hsla(24, 95%, 55%, 0)`);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 35, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(35, 100%, 75%, 0.9)`;
        ctx.shadowColor = `hsla(24, 95%, 53%, 0.7)`;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity: isInside ? 1 : 0, transition: "opacity 0.3s ease" }}
    />
  );
};

export default CursorFollower;
