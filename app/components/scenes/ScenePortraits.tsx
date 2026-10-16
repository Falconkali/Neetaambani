'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const PORTRAITS = [
  {
    src: '/images/neeta/neeta-1.jpg',
    alt: 'Neeta — The girl I fell for',
    caption: 'The girl I fell for.',
    treatment: 'emerge',
  },
  {
    src: '/images/neeta/neeta-2.jpg',
    alt: 'Neeta — My favourite person in this world',
    caption: 'My favourite person in this world.',
    treatment: 'push',
  },
  {
    src: '/images/neeta/neeta-3.jpg',
    alt: 'Neeta — The one behind so many of my smiles',
    caption: 'The one behind so many of my smiles.',
    treatment: 'warm',
  },
  {
    src: '/images/neeta/neeta-4.jpg',
    alt: 'Neeta — Someone who makes ordinary moments feel special',
    caption: 'And someone who makes ordinary moments feel special.',
    treatment: 'blur',
  },
];

export default function ScenePortraits() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=450%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          refreshPriority: 9,
        },
      });

      // Total timeline duration = 5 segments (4 portraits + closing dedicate)
      const segment = 1;

      PORTRAITS.forEach((portrait, i) => {
        const card = cardRefs.current[i];
        const caption = captionRefs.current[i];
        if (!card || !caption) return;

        const start = i * segment;
        const end = start + segment;

        if (portrait.treatment === 'emerge') {
          tl.fromTo(
            card,
            { opacity: 0, scale: 1.08, filter: 'brightness(0.3)' },
            { opacity: 1, scale: 1, filter: 'brightness(1)', duration: 0.4, ease: 'power2.out' },
            start
          )
            .fromTo(caption, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, start + 0.15)
            .to(card, { opacity: 0, scale: 0.95, duration: 0.35, ease: 'power2.in' }, end - 0.3)
            .to(caption, { opacity: 0, y: -15, duration: 0.25 }, end - 0.25);
        }

        if (portrait.treatment === 'push') {
          tl.fromTo(
            card,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1.04, duration: 0.5, ease: 'power1.out' },
            start
          )
            .fromTo(caption, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, start + 0.15)
            .to(card, { opacity: 0, scale: 1.08, duration: 0.35 }, end - 0.3)
            .to(caption, { opacity: 0, y: -15, duration: 0.25 }, end - 0.25);
        }

        if (portrait.treatment === 'warm') {
          tl.fromTo(
            card,
            { opacity: 0, filter: 'saturate(0.5) contrast(0.9)' },
            { opacity: 1, filter: 'saturate(1.2) contrast(1.05)', duration: 0.45 },
            start
          )
            .fromTo(caption, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, start + 0.15)
            .to(card, { opacity: 0, filter: 'brightness(0.2)', duration: 0.35 }, end - 0.3)
            .to(caption, { opacity: 0, y: -15, duration: 0.25 }, end - 0.25);
        }

        if (portrait.treatment === 'blur') {
          tl.fromTo(
            card,
            { opacity: 0, filter: 'blur(16px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' },
            start
          )
            .fromTo(caption, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, start + 0.15)
            .to(card, { opacity: 0, duration: 0.35 }, end - 0.3)
            .to(caption, { opacity: 0, y: -15, duration: 0.25 }, end - 0.25);
        }
      });

      // Closing dedicate after all 4 portraits
      const closingStart = PORTRAITS.length * segment;
      if (closingRef.current) {
        tl.fromTo(
          closingRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          closingStart
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-portraits"
      className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: '#080608' }}
      aria-label="Scene 2: The Girl I Love"
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(143,16,43,0.18) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Portrait cards */}
      {PORTRAITS.map((portrait, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12"
          style={{ opacity: 0, willChange: 'opacity, transform, filter' }}
        >
          {/* Ambient blurred backdrop for mood lighting */}
          <div
            className="absolute inset-0 -z-10 opacity-30 pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <Image
              src={portrait.src}
              alt=""
              fill
              className="object-cover scale-125 blur-3xl"
              sizes="100vw"
            />
          </div>

          {/* Sharp, framed cinematic portrait */}
          <div className="relative w-[68vw] sm:w-[72vw] max-w-[280px] sm:max-w-[360px] md:max-w-[440px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 mb-8 sm:mb-12">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 640px) 70vw, 440px"
            />
            {/* Subtle cinematic edge vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 65%, rgba(8,6,8,0.4) 100%)',
              }}
            />
          </div>
        </div>
      ))}

      {/* Caption overlays */}
      {PORTRAITS.map((portrait, i) => (
        <div
          key={`caption-${i}`}
          ref={(el) => {
            captionRefs.current[i] = el;
          }}
          className="absolute bottom-[7%] sm:bottom-[10%] left-0 right-0 text-center px-4 sm:px-6 z-20 pointer-events-none"
          style={{ opacity: 0, willChange: 'opacity, transform' }}
        >
          <p
            className="font-cormorant text-xl sm:text-3xl md:text-4xl font-light italic"
            style={{ color: '#F7EFE9', textShadow: '0 4px 30px rgba(0,0,0,0.95)' }}
          >
            &ldquo;{portrait.caption}&rdquo;
          </p>
        </div>
      ))}

      {/* Closing statement */}
      <div
        ref={closingRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        <div
          className="max-w-2xl text-center space-y-4 sm:space-y-6 p-4 sm:p-8 rounded-2xl sm:rounded-3xl"
          style={{ background: 'radial-gradient(ellipse at center, rgba(8,6,8,0.85) 0%, transparent 80%)' }}
        >
          <p
            className="font-cormorant text-xl sm:text-3xl md:text-4xl font-light"
            style={{ color: '#F7EFE9', lineHeight: 1.6 }}
          >
            Neeta, there are so many things I could say about you. But the simplest truth is that
            I&rsquo;m grateful you&rsquo;re part of my life.
          </p>
          <p
            className="font-cormorant text-base sm:text-xl tracking-[0.25em]"
            style={{ color: '#D7BE9B' }}
          >
            — Shiva
          </p>
        </div>
      </div>
    </section>
  );
}
