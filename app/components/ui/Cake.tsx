'use client';

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

interface CakeProps {
  state: 'wish' | 'cut' | 'cut-done';
  candlesLit: boolean;
  onWishMade?: () => void;
  onCakeCut?: () => void;
}

const CANDLE_COLORS = ['#C51F45', '#8F102B', '#D7BE9B', '#D6A0AC', '#F7EFE9'];
const CANDLE_COUNT = 5;

export default function Cake({ state, candlesLit, onWishMade, onCakeCut }: CakeProps) {
  const cakeRef = useRef<SVGSVGElement>(null);
  const flamesRef = useRef<SVGGElement[]>([]);
  const smokesRef = useRef<SVGGElement[]>([]);
  const sliceRef = useRef<SVGGElement>(null);
  const knifeRef = useRef<SVGGElement>(null);

  // Blow-out animation
  useEffect(() => {
    if (!candlesLit && state === 'wish') {
      flamesRef.current.forEach((flame, i) => {
        gsap.to(flame, {
          opacity: 0,
          scaleY: 0,
          duration: 0.3,
          delay: i * 0.08,
          ease: 'power2.in',
          transformOrigin: 'center bottom',
        });
      });

      smokesRef.current.forEach((smoke, i) => {
        gsap.fromTo(
          smoke,
          { opacity: 0.7, y: 0, scaleX: 1 },
          { opacity: 0, y: -25, scaleX: 2.5, duration: 1.4, delay: 0.2 + i * 0.08, ease: 'power1.out' }
        );
      });
    }

    if (candlesLit) {
      flamesRef.current.forEach((flame) => {
        gsap.set(flame, { opacity: 1, scaleY: 1 });
      });
      smokesRef.current.forEach((smoke) => {
        gsap.set(smoke, { opacity: 0 });
      });
    }
  }, [candlesLit, state]);

  // Cake-cut animation
  const handleCutClick = useCallback(() => {
    if (state !== 'cut' || !onCakeCut) return;

    const knife = knifeRef.current;
    const slice = sliceRef.current;
    if (!knife || !slice) return;

    const tl = gsap.timeline({ onComplete: onCakeCut });
    tl.fromTo(knife, { x: 60, y: -30, rotation: -30, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
      .to(knife, { y: 15, duration: 0.3, ease: 'power2.in' }, '+=0.1')
      .to(knife, { y: -40, opacity: 0, duration: 0.3, ease: 'power1.in' }, '+=0.15')
      .fromTo(slice, { x: 0 }, { x: 18, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.1');
  }, [state, onCakeCut]);

  const candles = Array.from({ length: CANDLE_COUNT }, (_, i) => {
    const spacing = 40;
    const startX = 100 - ((CANDLE_COUNT - 1) / 2) * spacing;
    return { x: startX + i * spacing, color: CANDLE_COLORS[i % CANDLE_COLORS.length] };
  });

  return (
    <div className="relative flex items-center justify-center" style={{ width: '280px', height: '260px' }}>
      {/* Warm glow under cake */}
      {candlesLit && (
        <div
          className="absolute"
          style={{
            width: '180px',
            height: '60px',
            background: 'radial-gradient(ellipse, rgba(255,180,60,0.3) 0%, transparent 70%)',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'blur(10px)',
          }}
          aria-hidden="true"
        />
      )}

      <svg
        ref={cakeRef}
        viewBox="0 0 200 200"
        width="280"
        height="260"
        xmlns="http://www.w3.org/2000/svg"
        role={state === 'cut' ? 'button' : 'img'}
        aria-label={state === 'cut' ? 'Tap to cut the birthday cake' : 'Birthday cake for Neeta'}
        onClick={state === 'cut' ? handleCutClick : undefined}
        style={{ cursor: state === 'cut' ? 'pointer' : 'default', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="cakeTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7EFE9" />
            <stop offset="100%" stopColor="#e8d8cc" />
          </linearGradient>
          <linearGradient id="cakeLayer1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C51F45" />
            <stop offset="100%" stopColor="#8F102B" />
          </linearGradient>
          <linearGradient id="cakeLayer2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#250710" />
            <stop offset="100%" stopColor="#1a050c" />
          </linearGradient>
          <linearGradient id="frosting" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7EFE9" />
            <stop offset="100%" stopColor="#D7BE9B" />
          </linearGradient>
        </defs>

        {/* Plate */}
        <ellipse cx="100" cy="182" rx="80" ry="8" fill="rgba(215,190,155,0.15)" />

        {/* === Cake Body === */}
        {/* Bottom layer */}
        <rect x="25" y="145" width="150" height="35" rx="4" fill="url(#cakeLayer2)" />
        {/* Middle layer */}
        <rect x="30" y="110" width="140" height="38" rx="3" fill="url(#cakeLayer1)" />
        {/* Top layer */}
        <rect x="38" y="80" width="124" height="33" rx="3" fill="url(#cakeTop)" />

        {/* Frosting drips on middle */}
        {[40, 60, 80, 100, 120, 140, 155].map((x, i) => (
          <path key={i} d={`M${x},110 Q${x + 4},120 ${x},125`} stroke="#F7EFE9" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity={0.7} />
        ))}

        {/* "NEETA" text on cake */}
        <text
          x="100"
          y="102"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="13"
          fontStyle="italic"
          fill="#C51F45"
          fontWeight="500"
        >
          NEETA
        </text>

        {/* Decorative dots */}
        {[45, 100, 155].map((x, i) => (
          <circle key={i} cx={x} cy="130" r="3" fill="#D7BE9B" opacity={0.8} />
        ))}

        {/* Rosette decorations */}
        {[50, 150].map((x, i) => (
          <g key={i} transform={`translate(${x}, 162)`}>
            {[
              { deg: 0, cx: 4, cy: 0 },
              { deg: 60, cx: 2, cy: 3.46 },
              { deg: 120, cx: -2, cy: 3.46 },
              { deg: 180, cx: -4, cy: 0 },
              { deg: 240, cx: -2, cy: -3.46 },
              { deg: 300, cx: 2, cy: -3.46 },
            ].map(({ deg, cx, cy }) => (
              <ellipse
                key={deg}
                cx={cx}
                cy={cy}
                rx="3"
                ry="2"
                fill="#C51F45"
                transform={`rotate(${deg})`}
                opacity={0.8}
              />
            ))}
            <circle cx="0" cy="0" r="2" fill="#D7BE9B" />
          </g>
        ))}

        {/* Candles */}
        {candles.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, 0)`}>
            {/* Candle body */}
            <rect x="-4" y="55" width="8" height="26" rx="2" fill={c.color} />

            {/* Flame */}
            <g
              ref={(el) => { if (el) flamesRef.current[i] = el; }}
              style={{ transformOrigin: `${c.x}px 55px` }}
            >
              <ellipse cx="0" cy="44" rx="4" ry="8" fill="#FF8C42" />
              <ellipse cx="0" cy="42" rx="2.5" ry="5" fill="#FFD166" />
              <ellipse cx="0" cy="41" rx="1" ry="2" fill="#FFF3B0" />
            </g>

            {/* Smoke */}
            <g
              ref={(el) => { if (el) smokesRef.current[i] = el; }}
              style={{ opacity: 0 }}
            >
              <path
                d={`M0,55 Q3,48 0,40`}
                stroke="rgba(247,239,233,0.5)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </g>
        ))}

        {/* === Cut State — knife + separate slice === */}
        {state !== 'wish' && (
          <>
            {/* Slice (shifts right when cut) */}
            <g ref={sliceRef}>
              <path
                d="M100,80 L122,80 L122,180 L100,180 Z"
                fill="url(#cakeLayer1)"
                opacity={state === 'cut-done' ? 0.9 : 0}
              />
              {state === 'cut-done' && (
                <text
                  x="112"
                  y="135"
                  textAnchor="middle"
                  fontFamily="Cormorant Garamond, Georgia, serif"
                  fontSize="7"
                  fill="#F7EFE9"
                  opacity={0.7}
                  transform="rotate(90, 112, 135)"
                >
                  ♡
                </text>
              )}
            </g>

            {/* Knife */}
            <g ref={knifeRef} style={{ opacity: 0 }}>
              <rect x="96" y="20" width="3" height="55" rx="1.5" fill="#D7BE9B" />
              <path d="M94,68 L103,68 L101,78 L96,78 Z" fill="#B8A07C" />
              <rect x="95" y="15" width="5" height="10" rx="2" fill="#8a7a5c" />
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
