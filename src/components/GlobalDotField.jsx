import React, { useEffect, useRef } from 'react';

const GRID_SPACING = 36;
const IDLE_RADIUS = 0.9;
const MAX_RADIUS = 1.8;
const INFLUENCE_RADIUS = 140;
const SPRING_STIFFNESS = 0.08;
const DAMPING = 0.82;
const REPULSION_STRENGTH = 2.6;

export default function GlobalDotField() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isMobile = false;

    let particles = [];
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      isHovered: false,
    };

    const initGrid = (w, h) => {
      particles = [];
      const cols = Math.floor(w / GRID_SPACING);
      const rows = Math.floor(h / GRID_SPACING);
      const offsetX = (w - (cols - 1) * GRID_SPACING) / 2;
      const offsetY = (h - (rows - 1) * GRID_SPACING) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = offsetX + c * GRID_SPACING;
          const baseY = offsetY + r * GRID_SPACING;
          particles.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            vx: 0,
            vy: 0,
            radius: IDLE_RADIUS,
            colorFactor: 0,
          });
        }
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      initGrid(width, height);
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    // Mouse event handlers for desktop
    const handleMouseMove = (e) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (mouse.prevX !== -9999) {
        mouse.vx = clientX - mouse.prevX;
        mouse.vy = clientY - mouse.prevY;
      }
      mouse.prevX = clientX;
      mouse.prevY = clientY;
      mouse.x = clientX;
      mouse.y = clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    // Touch event handlers for mobile interaction
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;

        if (mouse.prevX !== -9999) {
          mouse.vx = clientX - mouse.prevX;
          mouse.vy = clientY - mouse.prevY;
        }
        mouse.prevX = clientX;
        mouse.prevY = clientY;
        mouse.x = clientX;
        mouse.y = clientY;
        mouse.isHovered = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.isHovered = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Base color parameters: subtle neutral dot -> AIDA Red (rgba(225, 29, 72, 0.9))
    const baseR = 120;
    const baseG = 120;
    const baseB = 120;
    const baseAlpha = 0.22;

    const targetR = 225;
    const targetG = 29;
    const targetB = 72;
    const targetAlpha = 0.9;

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();

      // Mobile continuous wave running from top to bottom
      const waveSpeed = 0.075;
      const currentWaveY = (now * waveSpeed) % (height + 200) - 100;
      const waveBandWidth = 130;

      const isHovered = mouse.isHovered && mouse.x !== -9999;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let targetRadius = IDLE_RADIUS;
        let targetColorFactor = 0;

        // Mobile continuous top-to-bottom wave effect
        if (isMobile && !isReducedMotion) {
          const distToWave = Math.abs(p.baseY - currentWaveY);
          if (distToWave < waveBandWidth) {
            const waveNorm = 1 - distToWave / waveBandWidth;
            const waveInfluence = waveNorm * waveNorm;
            targetRadius = Math.max(targetRadius, IDLE_RADIUS + waveInfluence * 0.65);
            targetColorFactor = Math.max(targetColorFactor, waveInfluence * 0.45);
          }
        }

        // Mouse or Touch interaction
        if (isHovered && !isReducedMotion) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = INFLUENCE_RADIUS * INFLUENCE_RADIUS;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const normDist = 1 - dist / INFLUENCE_RADIUS;
            const influence = normDist * normDist;

            const angle = Math.atan2(dy, dx);
            const push = influence * REPULSION_STRENGTH;
            p.vx += Math.cos(angle) * push + mouse.vx * influence * 0.08;
            p.vy += Math.sin(angle) * push + mouse.vy * influence * 0.08;

            targetRadius = Math.max(targetRadius, IDLE_RADIUS + normDist * (MAX_RADIUS - IDLE_RADIUS));
            targetColorFactor = Math.max(targetColorFactor, normDist);
          }
        }

        // Spring return force
        const springFx = (p.baseX - p.x) * SPRING_STIFFNESS;
        const springFy = (p.baseY - p.y) * SPRING_STIFFNESS;

        p.vx = (p.vx + springFx) * DAMPING;
        p.vy = (p.vy + springFy) * DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        p.radius += (targetRadius - p.radius) * 0.15;
        p.colorFactor += (targetColorFactor - p.colorFactor) * 0.15;

        const r = Math.round(baseR + (targetR - baseR) * p.colorFactor);
        const g = Math.round(baseG + (targetG - baseG) * p.colorFactor);
        const b = Math.round(baseB + (targetB - baseB) * p.colorFactor);
        const alpha = baseAlpha + (targetAlpha - baseAlpha) * p.colorFactor;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      mouse.vx *= 0.8;
      mouse.vy *= 0.8;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}
