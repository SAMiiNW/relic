'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated guilloche spirograph line-work, the security-print signature motif.
 * Draws nested hypotrochoid/epitrochoid curves whose phase drifts over time,
 * tinted with an iridescent teal-to-magenta foil. dpr-aware, paused when hidden,
 * and respects prefers-reduced-motion.
 */
export function GuillocheCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let t = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Each rosette is a guilloche curve: x = (R-r)cos + d cos((R-r)/r * th)
    const rosettes = [
      { R: 0.34, r: 0.072, d: 0.13, hue: 'rgba(159,231,214,0.42)', speed: 0.00022, steps: 1100 },
      { R: 0.27, r: 0.05, d: 0.1, hue: 'rgba(229,143,199,0.3)', speed: -0.00031, steps: 950 },
      { R: 0.19, r: 0.041, d: 0.075, hue: 'rgba(217,195,138,0.28)', speed: 0.00041, steps: 820 },
    ];

    const drawRosette = (
      cx: number,
      cy: number,
      scale: number,
      phase: number,
      ros: (typeof rosettes)[number],
    ) => {
      const R = ros.R * scale;
      const r = ros.r * scale;
      const d = ros.d * scale;
      const k = (R - r) / r;
      ctx.beginPath();
      for (let i = 0; i <= ros.steps; i++) {
        const th = (i / ros.steps) * Math.PI * 2 * 7;
        const x = cx + (R - r) * Math.cos(th) + d * Math.cos(k * th + phase);
        const y = cy + (R - r) * Math.sin(th) - d * Math.sin(k * th + phase);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ros.hue;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.72;
      const cy = h * 0.46;
      const scale = Math.min(w, h);
      for (const ros of rosettes) {
        drawRosette(cx, cy, scale, t * ros.speed, ros);
      }
      // a second faint rosette cluster lower-left for balance
      for (const ros of rosettes) {
        drawRosette(w * 0.16, h * 0.82, scale * 0.6, -t * ros.speed * 1.3, ros);
      }
      t += 16;
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    };

    resize();
    if (!reduce) raf = requestAnimationFrame(draw);
    else draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
