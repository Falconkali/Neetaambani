'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PetalRain from '../animations/PetalRain';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 150;
const FILENAME_PREFIX = '/images/cake-frames/frame_';
const FILENAME_EXT = '.webp';
const FILENAME_PADDING = 4;

function framePath(n: number): string {
  return `${FILENAME_PREFIX}${String(n + 1).padStart(FILENAME_PADDING, '0')}${FILENAME_EXT}`;
}

export default function SceneBirthday() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Text stage refs
  const stageARef = useRef<HTMLDivElement>(null);
  const stageBRef = useRef<HTMLDivElement>(null);
  const stageCRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  // Paint single frame onto canvas preserving 16:9 aspect ratio and mobile responsiveness
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

    // Desktop: cover-fit for immersive cinematic presentation
    // Mobile: contain-fit sized to middle region so knife, cake, and slice are fully visible without overlapping text
    const isMobile = canvas.width < 768;
    let scale: number;
    if (isMobile) {
      scale = Math.min(canvas.width / img.naturalWidth, (canvas.height * 0.52) / img.naturalHeight);
    } else {
      scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    }

    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.drawImage(img, x, y, w, h);
  }, []);

  // Preload all 150 frames with prioritized initial buffer
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);

      img.onload = () => {
        loadedCount++;
        setLoadPercent(Math.round((loadedCount / FRAME_COUNT) * 100));

        // Paint frame 1 (index 0) immediately upon arrival
        if (i === 0) {
          paintFrame(0);
        }

        // Ready state after initial critical frames are loaded
        if (loadedCount >= 25 && !isLoaded) {
          setIsLoaded(true);
        }

        if (loadedCount === FRAME_COUNT) {
          setIsLoaded(true);
          paintFrame(currentFrameRef.current);
          ScrollTrigger.refresh();
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= 25 && !isLoaded) {
          setIsLoaded(true);
        }
      };

      images[i] = img;
    }

    framesRef.current = images;
  }, [paintFrame, isLoaded]);

  // Main scroll-driven cinematic timeline
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const stageA = stageARef.current;
    const stageB = stageBRef.current;
    const stageC = stageCRef.current;
    const finale = finaleRef.current;

    if (!section || !canvas || !stageA || !stageB || !stageC || !finale) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      paintFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', resize);
    resize();

    const gCtx = gsap.context(() => {
      // Numerical frame scrubber: 0 to 149
      const frameObj = { frame: 0 };

      // Pin distance: +=600% provides generous, cinematic scrub runway
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=600%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          refreshPriority: 7,
          onUpdate: (self) => {
            // Activate celebration petals near finale
            if (self.progress > 0.88) {
              setShowPetals(true);
            }
          },
        },
      });

      // 1. Frame sequence animation (0 to 149) across entire scroll range
      tl.to(
        frameObj,
        {
          frame: FRAME_COUNT - 1,
          ease: 'none',
          duration: 1.0,
          onUpdate: () => {
            const idx = Math.min(FRAME_COUNT - 1, Math.floor(frameObj.frame));
            paintFrame(idx);
          },
        },
        0
      );

      // Initial visual states
      gsap.set(stageA, { autoAlpha: 1, y: 0 });
      gsap.set(stageB, { autoAlpha: 0, y: 20 });
      gsap.set(stageC, { autoAlpha: 0, y: 20 });
      gsap.set(finale, { autoAlpha: 0, y: 35 });

      // 2. Stage A (Frames 1–19, p: 0.00 to 0.12):
      // "Make a wish, my Neeta. ♡"
      // Fades out precisely as frame 19 completes
      tl.to(
        stageA,
        { autoAlpha: 0, y: -20, duration: 0.018, ease: 'power1.in' },
        0.11
      );

      // 3. Stage B (Frames 20–38, p: 0.127 to 0.248):
      // "Now make that wish come true. ❤️"
      // Enters exactly at frame 20 (p ~ 0.127), holds through frame 38
      tl.fromTo(
        stageB,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.018, ease: 'power1.out' },
        0.127
      ).to(
        stageB,
        { autoAlpha: 0, y: -20, duration: 0.018, ease: 'power1.in' },
        0.242
      );

      // 4. Stage C (Frames 39–135, p: 0.255 to 0.85):
      // "And now… let's cut your birthday cake. 🎂"
      // Enters exactly as cutting starts at frame 39 (p ~ 0.255)
      tl.fromTo(
        stageC,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.02, ease: 'power1.out' },
        0.255
      ).to(
        stageC,
        { autoAlpha: 0, y: -20, duration: 0.03, ease: 'power1.in' },
        0.84
      );

      // 5. Finale Celebration (Frames 135–150, p: 0.88 to 1.0):
      // "Happy Birthday, Neeta!" & "Made with all my love, by Shiva. ❤️"
      tl.fromTo(
        finale,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' },
        0.88
      );
    }, section);

    return () => {
      window.removeEventListener('resize', resize);
      gCtx.revert();
    };
  }, [paintFrame]);

  const handleReplay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-birthday"
      className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: '#0a0307' }}
      aria-label="Scene 4: Happy Birthday Neeta"
    >
      {/* Cinematic Deep Burgundy Ambient Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(143,16,43,0.22) 0%, rgba(13,4,8,0.85) 60%, #0a0307 100%)',
        }}
        aria-hidden="true"
      />

      {/* Loading Indicator while essential cake frames buffer */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
          aria-live="polite"
        >
          <p
            className="font-cormorant text-sm sm:text-base tracking-[0.3em] uppercase"
            style={{ color: '#D7BE9B' }}
          >
            {loadPercent < 100 ? `Preparing Cake… ${loadPercent}%` : 'Ready…'}
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

      {/* Canvas Rendering the WebP Image Sequence */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
        aria-label="Interactive birthday cake animation with lit candles, blowing out, and cake cutting"
        role="img"
      />

      {/* Subtle Cinematic Vignette Overlay */}
      <div
        className="absolute inset-0 z-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,3,7,0.7) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Petal Rain Celebration in Finale */}
      {showPetals && <PetalRain />}

      {/* ========================================================= */}
      {/* STAGE A (Frames 1–19): Lit Candles                        */}
      {/* ========================================================= */}
      <div
        ref={stageARef}
        className="absolute top-[6%] sm:top-[8%] left-0 right-0 z-20 text-center px-4 sm:px-6 pointer-events-none"
      >
        <span
          className="font-inter text-[10px] sm:text-xs tracking-[0.25em] uppercase block mb-1.5 sm:mb-2.5"
          style={{ color: '#D6A0AC' }}
        >
          October 17 • Today is Yours
        </span>
        <h2
          className="font-cormorant text-3xl sm:text-5xl md:text-6xl font-light"
          style={{ color: '#F7EFE9', textShadow: '0 4px 30px rgba(0,0,0,0.95)' }}
        >
          Make a wish, my Neeta. ♡
        </h2>
        <p
          className="mt-1.5 sm:mt-3 font-cormorant text-base sm:text-xl md:text-2xl font-light italic"
          style={{ color: '#D7BE9B', textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}
        >
          Close your eyes for a moment and make a little wish.
        </p>
      </div>

      {/* ========================================================= */}
      {/* STAGE B (Frames 20–38): Candles Extinguished              */}
      {/* ========================================================= */}
      <div
        ref={stageBRef}
        className="absolute top-[6%] sm:top-[8%] left-0 right-0 z-20 text-center px-4 sm:px-6 pointer-events-none"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <span
          className="font-inter text-[10px] sm:text-xs tracking-[0.25em] uppercase block mb-1.5 sm:mb-2.5"
          style={{ color: '#D6A0AC' }}
        >
          A Wish Whispered
        </span>
        <h2
          className="font-cormorant text-3xl sm:text-5xl md:text-6xl font-light"
          style={{ color: '#F7EFE9', textShadow: '0 4px 30px rgba(0,0,0,0.95)' }}
        >
          Now make that wish come true. ❤️
        </h2>
        <p
          className="mt-1.5 sm:mt-3 font-cormorant text-base sm:text-xl md:text-2xl font-light italic"
          style={{ color: '#D7BE9B', textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}
        >
          Every candle carries a prayer for your endless happiness.
        </p>
      </div>

      {/* ========================================================= */}
      {/* STAGE C (Frames 39–135): Cake Cutting Action              */}
      {/* ========================================================= */}
      <div
        ref={stageCRef}
        className="absolute top-[6%] sm:top-[8%] left-0 right-0 z-20 text-center px-4 sm:px-6 pointer-events-none"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <span
          className="font-inter text-[10px] sm:text-xs tracking-[0.25em] uppercase block mb-1.5 sm:mb-2.5"
          style={{ color: '#D6A0AC' }}
        >
          The Sweetest Celebration
        </span>
        <h2
          className="font-cormorant text-3xl sm:text-5xl md:text-6xl font-light"
          style={{ color: '#F7EFE9', textShadow: '0 4px 30px rgba(0,0,0,0.95)' }}
        >
          And now… let&rsquo;s cut your birthday cake. 🎂
        </h2>
        <p
          className="mt-1.5 sm:mt-3 font-cormorant text-base sm:text-xl font-light italic"
          style={{ color: '#D7BE9B', textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}
        >
          Scroll to slice your special cake together.
        </p>
      </div>

      {/* ========================================================= */}
      {/* FINALE (Frames 135–150): Birthday Dedication & Love       */}
      {/* ========================================================= */}
      <div
        ref={finaleRef}
        className="absolute inset-0 z-25 flex flex-col items-center justify-end pb-8 sm:pb-14 px-4 sm:px-6 text-center pointer-events-auto"
        style={{
          opacity: 0,
          visibility: 'hidden',
          background: 'linear-gradient(to top, rgba(10,3,7,0.96) 0%, rgba(10,3,7,0.8) 50%, transparent 85%)',
        }}
      >
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-5 max-h-[85dvh] overflow-y-auto">
          <h1
            className="font-cormorant text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide"
            style={{ color: '#F7EFE9', textShadow: '0 4px 40px rgba(0,0,0,0.95)' }}
          >
            Happy Birthday, Neeta!
          </h1>

          <p
            className="font-cormorant text-base sm:text-xl md:text-2xl tracking-wider font-light"
            style={{ color: '#D7BE9B' }}
          >
            Made with all my love, by Shiva. ❤️
          </p>

          <div className="space-y-2 sm:space-y-3 font-cormorant text-sm sm:text-base md:text-lg text-[#F7EFE9]/90 font-light italic leading-relaxed pt-1">
            <p>
              I hope this new chapter brings you happiness, peace, beautiful memories, and so many reasons to smile.
            </p>
            <p>
              You deserve to feel celebrated today and every single day.
            </p>
            <p className="text-lg sm:text-2xl font-light text-[#D6A0AC] not-italic pt-1">
              I love you, Neeta. ♡
            </p>
          </div>

          <div className="pt-3 sm:pt-5">
            <button
              onClick={handleReplay}
              className="btn-cinematic !py-2.5 !px-6 text-[11px] sm:text-xs tracking-[0.25em]"
              aria-label="Replay the birthday experience"
            >
              Experience it again ↺
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
