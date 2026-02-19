import { useEffect, useRef } from "react";

const ParticleGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    interface Particle {
      x: number; y: number; baseX: number; baseY: number;
      vx: number; vy: number; size: number; opacity: number;
      pulse: number; pulseSpeed: number; drift: number;
    }

    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Create more particles for a richer background
    const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x, y, baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.3,
        opacity: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        drift: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      time += 0.008;

      particles.forEach((p, i) => {
        // Gentle organic drift
        p.x += p.vx + Math.sin(time + p.drift * 10) * 0.15;
        p.y += p.vy + Math.cos(time + p.drift * 8) * 0.12;

        // Wrap around edges smoothly
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Mouse interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 150;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 3;
          p.y += Math.sin(angle) * force * 3;
        }

        // Pulsing glow
        p.pulse += p.pulseSpeed;
        const pulseAmount = Math.sin(p.pulse) * 0.15 + 0.85;
        const glowFactor = dist < repelRadius ? (1 - dist / repelRadius) : 0;
        const drawOpacity = (p.opacity + glowFactor * 0.5) * pulseAmount;
        const drawSize = (p.size + glowFactor * 3) * pulseAmount;

        // Particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(24, 95%, 53%, ${drawOpacity})`;
        ctx.fill();

        // Ambient glow around particles near mouse
        if (glowFactor > 0.1) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize * 4);
          grd.addColorStop(0, `hsla(24, 95%, 53%, ${glowFactor * 0.12})`);
          grd.addColorStop(1, `hsla(24, 95%, 53%, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const cdx = p.x - particles[j].x;
          const cdy = p.y - particles[j].y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 140) {
            const lineAlpha = 0.03 * (1 - cdist / 140);
            const midX = (p.x + particles[j].x) / 2;
            const midY = (p.y + particles[j].y) / 2;
            const midDist = Math.sqrt((midX - mouse.x) ** 2 + (midY - mouse.y) ** 2);
            const lineBright = midDist < repelRadius ? (1 - midDist / repelRadius) * 0.12 : 0;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(24, 80%, 50%, ${lineAlpha + lineBright})`;
            ctx.lineWidth = 0.4 + lineBright * 2;
            ctx.stroke();
          }
        }
      });

      // Subtle ambient floating orbs (large, very faint)
      for (let k = 0; k < 3; k++) {
        const ox = canvas.width * (0.2 + k * 0.3) + Math.sin(time * 0.5 + k * 2) * 80;
        const oy = canvas.height * (0.3 + k * 0.15) + Math.cos(time * 0.4 + k * 1.5) * 60;
        const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, 120);
        orbGrad.addColorStop(0, `hsla(24, 95%, 53%, 0.02)`);
        orbGrad.addColorStop(0.5, `hsla(24, 95%, 53%, 0.008)`);
        orbGrad.addColorStop(1, `hsla(24, 95%, 53%, 0)`);
        ctx.beginPath();
        ctx.arc(ox, oy, 120, 0, Math.PI * 2);
        ctx.fillStyle = orbGrad;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

export default ParticleGrid;
