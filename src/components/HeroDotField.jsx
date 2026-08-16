import React, { useEffect, useRef } from 'react';

const GRID_SPACING = 36; // Crisp, evenly spaced grid
const IDLE_RADIUS = 1.25; // Clearly visible dot
const MAX_RADIUS = 3.6; // Expands dynamically on hover
const INFLUENCE_RADIUS = 160; // Engaged interaction field radius
const SPRING_STIFFNESS = 0.09;
const DAMPING = 0.82;
const REPULSION_STRENGTH = 3.2; // Distinct physical displacement wave

export default function HeroDotField({
  color = 'dark', // 'dark' (charcoal dots for light hero) or 'light' (white dots for dark footer)
  className = 'absolute inset-y-0 w-screen left-1/2 -translate-x-1/2 pointer-events-none z-0 overflow-hidden',
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

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
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
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

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (
        clientX >= 0 &&
        clientX <= rect.width &&
        clientY >= 0 &&
        clientY <= rect.height
      ) {
        if (mouse.prevX !== -9999) {
          mouse.vx = clientX - mouse.prevX;
          mouse.vy = clientY - mouse.prevY;
        }
        mouse.prevX = clientX;
        mouse.prevY = clientY;
        mouse.x = clientX;
        mouse.y = clientY;
        mouse.isHovered = true;
      } else {
        mouse.isHovered = false;
      }
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

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = container.getBoundingClientRect();
        const clientX = e.touches[0].clientX - rect.left;
        const clientY = e.touches[0].clientY - rect.top;

        if (
          clientX >= 0 &&
          clientX <= rect.width &&
          clientY >= 0 &&
          clientY <= rect.height
        ) {
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

    let waveStartTime = performance.now();
    const waveDuration = 3000; // 3 seconds wavy animation

    const startWavyAnimation = () => {
      waveStartTime = performance.now();
    };

    const handleImpactBounce = () => {
      startWavyAnimation();
      const centerX = width / 2;
      const centerY = height * 0.4;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.baseX - centerX;
        const dy = p.baseY - centerY;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 480) {
          const force = ((480 - dist) / 480) * 16;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
          p.colorFactor = 1;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('hero-impact-bounce', handleImpactBounce);
    window.addEventListener('intro-video-finished', startWavyAnimation);

    // Color definitions
    const baseR = color === 'light' ? 255 : 35;
    const baseG = color === 'light' ? 255 : 35;
    const baseB = color === 'light' ? 255 : 35;
    const baseAlpha = color === 'light' ? 0.35 : 0.38;

    const targetR = 225;
    const targetG = 29;
    const targetB = 72;
    const targetAlpha = 0.95;

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      const isHovered = mouse.isHovered && mouse.x !== -9999;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let targetRadius = IDLE_RADIUS;
        let targetColorFactor = 0;

        // 3-second wavy animation that slowly eases out
        if (waveStartTime !== null) {
          const waveElapsed = now - waveStartTime;
          if (waveElapsed < waveDuration) {
            const waveProgress = waveElapsed / waveDuration;
            const waveFadeOut = Math.sin((1 - waveProgress) * Math.PI * 0.5); // Smooth ease out fade over 3s
            const waveCenterX = width / 2;
            const waveCenterY = height * 0.35;
            const distToCenter = Math.hypot(p.baseX - waveCenterX, p.baseY - waveCenterY);

            const wavePhase = (distToCenter * 0.025) - (waveElapsed * 0.007);
            const waveSine = Math.sin(wavePhase);
            const waveForce = waveSine * waveFadeOut * 2.2;

            const angle = Math.atan2(p.baseY - waveCenterY, p.baseX - waveCenterX);
            p.vx += Math.cos(angle) * waveForce * 0.5;
            p.vy += Math.sin(angle) * waveForce * 0.5;
            targetRadius = IDLE_RADIUS + Math.abs(waveSine) * waveFadeOut * 1.6;
            targetColorFactor = Math.min(1, Math.abs(waveSine) * waveFadeOut * 0.7);
          }
        }

        if (isHovered) {
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
            p.vx += Math.cos(angle) * push + mouse.vx * influence * 0.12;
            p.vy += Math.sin(angle) * push + mouse.vy * influence * 0.12;

            targetRadius = Math.max(targetRadius, IDLE_RADIUS + normDist * (MAX_RADIUS - IDLE_RADIUS));
            targetColorFactor = Math.max(targetColorFactor, normDist);
          }
        }

        const springFx = (p.baseX - p.x) * SPRING_STIFFNESS;
        const springFy = (p.baseY - p.y) * SPRING_STIFFNESS;

        p.vx = (p.vx + springFx) * DAMPING;
        p.vy = (p.vy + springFy) * DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        p.radius += (targetRadius - p.radius) * 0.18;
        p.colorFactor += (targetColorFactor - p.colorFactor) * 0.18;

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
      window.removeEventListener('hero-impact-bounce', handleImpactBounce);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}

