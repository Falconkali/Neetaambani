'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * RoseImageSequence
 *
 * Drop your WebP frames into /public/videos/ named:
 *   rose-001.webp, rose-002.webp, ... rose-NNN.webp
 *
 * Set FRAME_COUNT to match how many frames you have.
 * Set FILENAME_PREFIX / FILENAME_EXT if your naming differs.
 *
 * The component preloads all frames, then paints the correct
 * frame on a canvas driven by GSAP ScrollTrigger scroll progress.
 * Scrolling backward reverses the animation naturally.
 */

const FRAME_COUNT = 150;                   // 150 frames: frame_0001 … frame_0150
const FILENAME_PREFIX = '/videos/frame_';  // public/videos/frame_XXXX.webp
const FILENAME_EXT = '.webp';
const FILENAME_PADDING = 4;                // 4-digit zero-pad: 0001, 0002 …

function framePath(n: number): string {
  return `${FILENAME_PREFIX}${String(n + 1).padStart(FILENAME_PADDING, '0')}${FILENAME_EXT}`;
}

export default function RoseImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    let failed = false;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = framePath(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT && !failed) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        failed = true;
        console.warn(`[RoseImageSequence] Could not load frame: ${framePath(i)}`);
      };
      images[i] = img;
    }
    framesRef.current = images;
  }, []);

  // Draw the correct frame on canvas based on scroll progress
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentFrameRef = { current: 0 };

    function paintFrame(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      img: HTMLImageElement
    ) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Cover-fit the image to the canvas (like CSS object-fit: cover)
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.drawImage(img, x, y, w, h);
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Redraw current frame after resize
      const frame = framesRef.current[currentFrameRef.current];
      if (frame) paintFrame(ctx, canvas, frame);
    };
    window.addEventListener('resize', resize);
    resize();

    // ScrollTrigger scrubs through frames
    const trigger = ScrollTrigger.create({
      trigger: document.getElementById('scene-rose') ?? document.body,
      start: 'top top',
      end: '+=250%',
      scrub: 1,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(self.progress * FRAME_COUNT)
        );
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          const frame = framesRef.current[frameIndex];
          if (frame?.complete) paintFrame(ctx, canvas, frame);
        }
      },
    });

    // Paint first frame immediately
    const firstFrame = framesRef.current[0];
    if (firstFrame?.complete) paintFrame(ctx, canvas, firstFrame);

    return () => {
      trigger.kill();
      window.removeEventListener('resize', resize);
    };
  }, [loaded]);

  return (
    <div className="absolute inset-0">
      {/* Loading indicator shown until all frames are ready */}
      {!loaded && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
          aria-live="polite"
          aria-label={`Loading rose animation: ${loadProgress}%`}
        >
          <div
            className="font-cormorant text-sm tracking-[0.3em] uppercase"
            style={{ color: 'rgba(215,190,155,0.5)' }}
          >
            {loadProgress < 100 ? `Loading… ${loadProgress}%` : 'Preparing…'}
          </div>
          <div
            className="mt-3 h-px"
            style={{
              width: '120px',
              background: `linear-gradient(to right, #C51F45 ${loadProgress}%, rgba(215,190,155,0.15) ${loadProgress}%)`,
              transition: 'background 0.1s ease',
            }}
          />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
        aria-label="An animated rose blooming"
        role="img"
      />
    </div>
  );
}
