import { useEffect, useRef } from "react";

const Globe3D = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let rotation = 0;

        const size = 280;
        canvas.width = size;
        canvas.height = size;

        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2 - 20;

        const drawGlobe = () => {
            ctx.clearRect(0, 0, size, size);

            // Outer glow
            const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.3);
            outerGlow.addColorStop(0, "hsla(24, 95%, 53%, 0.06)");
            outerGlow.addColorStop(1, "hsla(24, 95%, 53%, 0)");
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = outerGlow;
            ctx.fill();

            // Globe body
            const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
            grad.addColorStop(0, "hsla(24, 95%, 53%, 0.08)");
            grad.addColorStop(0.5, "hsla(24, 80%, 40%, 0.04)");
            grad.addColorStop(1, "hsla(0, 0%, 5%, 0.4)");
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Border ring
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = "hsla(24, 95%, 53%, 0.15)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw longitude lines (rotating)
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.clip();

            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI + rotation;
                const xOffset = Math.sin(angle) * radius;
                const squeeze = Math.abs(Math.cos(angle));

                ctx.beginPath();
                ctx.ellipse(cx + xOffset * 0.15, cy, Math.max(1, squeeze * radius * 0.08), radius * 0.95, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(24, 95%, 53%, ${0.04 + squeeze * 0.08})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }

            // Draw latitude lines
            for (let i = 1; i < 7; i++) {
                const y = cy + (i - 3.5) * (radius * 0.24);
                const latRadius = Math.sqrt(radius * radius - (y - cy) * (y - cy));

                ctx.beginPath();
                ctx.ellipse(cx, y, latRadius, latRadius * 0.15, 0, 0, Math.PI * 2);
                ctx.strokeStyle = "hsla(24, 95%, 53%, 0.06)";
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Highlight dot (India location ~20°N, 78°E)
            const indiaLat = 0.35; // normalized
            const indiaLon = rotation + 1.36; // ~78° + rotation
            const dotX = cx + Math.sin(indiaLon) * radius * 0.6;
            const dotY = cy - indiaLat * radius * 0.5;
            const dotVisible = Math.cos(indiaLon) > -0.2;

            if (dotVisible) {
                // Pulse ring
                const pulseSize = 4 + Math.sin(Date.now() / 300) * 2;
                const pulseGrad = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, pulseSize * 3);
                pulseGrad.addColorStop(0, "hsla(24, 95%, 53%, 0.3)");
                pulseGrad.addColorStop(1, "hsla(24, 95%, 53%, 0)");
                ctx.beginPath();
                ctx.arc(dotX, dotY, pulseSize * 3, 0, Math.PI * 2);
                ctx.fillStyle = pulseGrad;
                ctx.fill();

                // Dot
                ctx.beginPath();
                ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "hsl(24, 95%, 53%)";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
            }

            ctx.restore();

            // Specular highlight
            const specGrad = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, 0, cx, cy, radius);
            specGrad.addColorStop(0, "hsla(30, 40%, 80%, 0.04)");
            specGrad.addColorStop(0.5, "transparent");
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = specGrad;
            ctx.fill();

            rotation += 0.004;
            animationId = requestAnimationFrame(drawGlobe);
        };

        drawGlobe();
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="relative flex items-center justify-center">
            <canvas ref={canvasRef} className="w-56 h-56 md:w-72 md:h-72 lg:w-[280px] lg:h-[280px]" />
            {/* Label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground">Tamil Nadu, India</span>
            </div>
        </div>
    );
};

export default Globe3D;
