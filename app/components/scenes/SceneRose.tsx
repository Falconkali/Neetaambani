'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 150;
const FILENAME_PREFIX = '/videos/frame_';
const FILENAME_EXT = '.webp';
const FILENAME_PADDING = 4;

function framePath(n: number): string {
  return `${FILENAME_PREFIX}${String(n + 1).padStart(FILENAME_PADDING, '0')}${FILENAME_EXT}`;
}

export default function SceneRose() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const paintFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    currentFrameRef.current = index;
    const img = framesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Cover-fit to window
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.drawImage(img, x, y, w, h);
  }, []);

  // Preload all 150 frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        count++;
        setLoadPercent(Math.round((count / FRAME_COUNT) * 100));
        if (i === 0) {
          // Paint frame 0 as soon as it is downloaded
          paintFrame(0);
        }
        if (count === FRAME_COUNT) {
          setIsLoaded(true);
          paintFrame(currentFrameRef.current);
          ScrollTrigger.refresh();
        }
      };
      img.onerror = () => {
        count++;
        if (count === FRAME_COUNT) {
          setIsLoaded(true);
          ScrollTrigger.refresh();
        }
      };
      images[i] = img;
    }
    framesRef.current = images;
  }, [paintFrame]);

  // Main scroll-driven cinematic timeline — MOUNTED IMMEDIATELY so layout & pin spacer are set!
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const headline = headlineRef.current;
    const signature = signatureRef.current;
    const bg = bgRef.current;
    const overlay = overlayRef.current;
    if (!section || !canvas || !headline || !signature || !bg || !overlay) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      paintFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', resize);
    resize();

    const gCtx = gsap.context(() => {
      // Pin distance: +=500% = 5 screens of scrolling
      // This guarantees the user has plenty of scroll travel to see all 150 frames
      const frameObj = { frame: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=600%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          refreshPriority: 10,
        },
      });

      // Frame animation from 0 to 149 (all 150 images!)
      // Runs from 0% to 85% of the entire 600% scroll distance
      tl.to(
        frameObj,
        {
          frame: FRAME_COUNT - 1,
          duration: 0.85,
          ease: 'none',
          onUpdate: () => {
            const idx = Math.min(FRAME_COUNT - 1, Math.floor(frameObj.frame));
            paintFrame(idx);
          },
        },
        0
      );

      // Background lighting shift as the rose blooms
      tl.to(bg, { backgroundColor: '#250710', duration: 0.25 }, 0.25)
        .to(bg, { backgroundColor: '#5a0e1e', duration: 0.25 }, 0.5)
        .to(bg, { backgroundColor: '#8F102B', duration: 0.2 }, 0.75);

      // Headline reveal after rose has reached full bloom
      tl.fromTo(
        headline,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
        0.82
      );

      // Signature reveal
      tl.fromTo(
        signature,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
        0.88
      );

      // Overlay transition into Scene 2 only at the very end
      tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.08, ease: 'power1.inOut' },
        0.94
      );
    }, section);

    return () => {
      window.removeEventListener('resize', resize);
      gCtx.revert();
    };
  }, [paintFrame]);

  return (
    <section
      ref={sectionRef}
      id="scene-rose"
      className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden"
      aria-label="Scene 1: The Rose"
    >
      {/* Background color layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 transition-none"
        style={{ backgroundColor: '#080608' }}
      />

      {/* Loading progress bar while 150 frames cache */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-30"
          aria-live="polite"
        >
          <p
            className="font-cormorant text-sm sm:text-base tracking-[0.3em] uppercase"
            style={{ color: '#D7BE9B' }}
          >
            {loadPercent < 100 ? `Loading… ${loadPercent}%` : 'Preparing…'}
          </p>
          <div
            className="mt-4 h-0.5 rounded-full"
            style={{
              width: '120px',
              background: `linear-gradient(to right, #C51F45 ${loadPercent}%, rgba(215,190,155,0.2) ${loadPercent}%)`,
            }}
          />
        </div>
      )}

      {/* Rose Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
        aria-label="Cinematic animated rose blooming from frame 1 to 150"
        role="img"
      />

      {/* Text overlay layer */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none">
        {/* Cinematic headline */}
        <div
          ref={headlineRef}
          className="absolute bottom-[22%] sm:bottom-[28%] left-0 right-0 text-center px-4 sm:px-6"
          style={{ opacity: 0 }}
          aria-live="polite"
        >
          <p
            className="font-cormorant text-xl sm:text-3xl md:text-5xl font-light italic"
            style={{ color: '#F7EFE9', textShadow: '0 2px 30px rgba(8,6,8,0.95)' }}
          >
            &ldquo;For the girl who makes my world bloom.&rdquo;
          </p>
        </div>

        {/* Signature */}
        <div
          ref={signatureRef}
          className="absolute bottom-[14%] sm:bottom-[20%] left-0 right-0 text-center px-4 sm:px-6"
          style={{ opacity: 0 }}
        >
          <p
            className="font-cormorant text-xs sm:text-base md:text-lg tracking-[0.25em]"
            style={{ color: '#D7BE9B', textShadow: '0 2px 20px rgba(8,6,8,0.95)' }}
          >
            — Made with love, by Shiva
          </p>
        </div>
      </div>

      {/* Transition overlay into Scene 02 */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ backgroundColor: '#080608', opacity: 0 }}
        aria-hidden="true"
      />
    </section>
  );
}
