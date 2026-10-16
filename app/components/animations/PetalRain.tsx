'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  alpha: number;
  color: string;
}

const PETAL_COLORS = [
  '#C51F45', '#8F102B', '#D6A0AC', '#D7BE9B', '#F7EFE9',
  '#e8608a', '#b73558', '#c9849f',
];

export default function PetalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const petals: Petal[] = Array.from({ length: 55 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200 - i * 10,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.5 + 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      scale: Math.random() * 0.7 + 0.4,
      alpha: Math.random() * 0.6 + 0.4,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    }));

    function drawPetal(ctx: CanvasRenderingContext2D, color: string, alpha: number) {
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(6, -8, 10, -14, 0, -18);
      ctx.bezierCurveTo(-10, -14, -6, -8, 0, 0);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of petals) {
        p.x += p.vx + Math.sin(p.y * 0.02) * 0.5;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 30) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);
        drawPetal(ctx, p.color, p.alpha);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
      aria-hidden="true"
    />
  );
}
