'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * RoseCanvas — draws an animated rose bloom on HTML5 Canvas,
 * with scroll progress controlling the petal opening.
 *
 * If you supply a video at /videos/rose-bloom.mp4, swap this
 * component for the RoseVideo component below (see comments).
 */

interface PetalConfig {
  layer: number;
  angle: number;
  length: number;
  width: number;
  curl: number;
  hue: number;
}

export default function RoseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate petal configs
    const petals: PetalConfig[] = [];
    const LAYERS = 6;
    const PETALS_PER_LAYER = [5, 8, 10, 12, 14, 16];

    for (let layer = 0; layer < LAYERS; layer++) {
      const count = PETALS_PER_LAYER[layer];
      for (let p = 0; p < count; p++) {
        petals.push({
          layer,
          angle: (p / count) * Math.PI * 2 + (layer * Math.PI) / 5,
          length: 28 + layer * 22,
          width: 14 + layer * 8,
          curl: 0.3 + layer * 0.12,
          hue: 345 + (Math.random() - 0.5) * 20,
        });
      }
    }

    function drawRose(progress: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.22;

      // Soft glow beneath rose
      const glowRadius = maxRadius * (0.5 + progress * 0.6);
      const glow = ctx.createRadialGradient(cx, cy + maxRadius * 0.1, 0, cx, cy + maxRadius * 0.1, glowRadius);
      glow.addColorStop(0, `rgba(197,31,69,${0.25 * progress})`);
      glow.addColorStop(0.5, `rgba(143,16,43,${0.15 * progress})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw petals back to front
      for (let layer = LAYERS - 1; layer >= 0; layer--) {
        const layerProgress = Math.max(0, Math.min(1, (progress * LAYERS - layer + 0.5) / 1));
        if (layerProgress <= 0) continue;

        const layerPetals = petals.filter(p => p.layer === layer);

        for (const petal of layerPetals) {
          const openAngle = -Math.PI / 2 + (1 - layerProgress) * (Math.PI * 0.55);
          const radius = (petal.length / 140) * maxRadius * (0.35 + layer * 0.12);
          const petalLen = (petal.length / 140) * maxRadius;
          const petalW = (petal.width / 140) * maxRadius * 0.8;

          ctx.save();
          ctx.translate(cx, cy);

          // Rotate to petal position
          ctx.rotate(petal.angle);

          // Lift petals from centre outward
          ctx.translate(radius * 0.3, 0);
          ctx.rotate(openAngle);

          // Petal shape using bezier curves
          const lightness = 32 + layer * 5;
          const alpha = 0.85 + layer * 0.02;

          const grad = ctx.createLinearGradient(0, -petalLen, 0, 0);
          grad.addColorStop(0, `hsla(${petal.hue},75%,${lightness + 10}%,${alpha})`);
          grad.addColorStop(0.5, `hsla(${petal.hue},70%,${lightness}%,${alpha})`);
          grad.addColorStop(1, `hsla(${petal.hue},65%,${lightness - 8}%,${alpha})`);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            petalW, -petalLen * 0.3,
            petalW * petal.curl, -petalLen * 0.85,
            0, -petalLen
          );
          ctx.bezierCurveTo(
            -petalW * petal.curl, -petalLen * 0.85,
            -petalW, -petalLen * 0.3,
            0, 0
          );

          ctx.fillStyle = grad;
          ctx.shadowColor = `hsla(${petal.hue},80%,20%,0.4)`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        }
      }

      // Sepal / centre bud
      const budSize = maxRadius * 0.08 * (0.5 + progress * 0.5);
      const budGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, budSize);
      budGrad.addColorStop(0, '#ffd166');
      budGrad.addColorStop(0.4, '#C51F45');
      budGrad.addColorStop(1, '#8F102B');
      ctx.beginPath();
      ctx.arc(cx, cy, budSize, 0, Math.PI * 2);
      ctx.fillStyle = budGrad;
      ctx.fill();
    }

    // GSAP ScrollTrigger scrubs the progress value
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: '+=250%',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    // RAF draw loop
    const loop = () => {
      drawRose(progressRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      trigger.kill();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-label="An animated rose blooming"
      role="img"
    />
  );
}
