'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export interface MemoryItem {
  id: string;
  tag: string;
  timeBadge: string;
  title: string;
  image: string;
  alt: string;
  aspectClass: string;
  objectFit: 'cover' | 'contain';
  objectPosition: string;
  highlightQuote: string;
  paragraphs: string[];
}

const MEMORIES: MemoryItem[] = [
  {
    id: 'memory-1',
    tag: 'Memory 01',
    timeBadge: '2:20 AM • The Night Everything Changed',
    title: 'The 2 AM Conversation',
    image: '/images/memories/memory-1.jpg',
    alt: 'Late night 2:20 AM chat screenshot between Shiva and Neeta',
    aspectClass: 'aspect-[9/19]',
    objectFit: 'cover',
    objectPosition: 'object-top',
    highlightQuote: '“I think i like you :)”',
    paragraphs: [
      'Jab aapne pheli baar bola tha ki aap mujhe like karte ho kasam se main bhot khush tha 😭❤️ excited bhi tha aur thoda dar bhi lag raha tha kyuki aap mere liye itne special the aur main nhi chahta tha ki main aapke liye bas timepass rahu',
      'Isiliye jab aapne bola ki ur serious pata nhi kyu but mere face pe smile hi nhi rukh raha tha ❤️',
      'shayad aapke liye woh bas ek choti si baat thi but mere liye woh 2 AM wala conversation bhot special ban gaya mera ho aap aur mera Neeta bungye💗',
    ],
  },
  {
    id: 'memory-2',
    tag: 'Memory 02',
    timeBadge: '2:37 AM • He Knows I Like You',
    title: 'The Little Brother Secret',
    image: '/images/memories/memory-2.jpg',
    alt: 'Chat where Neeta tells Shiva her brother already knows she likes him',
    aspectClass: 'aspect-[9/19]',
    objectFit: 'cover',
    objectPosition: 'object-top',
    highlightQuote: '“If you were a stranger to me i\'d hv nvr told my broda abt u... He knows i like u”',
    paragraphs: [
      'main bhot dar gya tha ki aapke chote bhai ko yeh pata hain ki aap mujhe pasand karthe ho, i was afraid what if he tell to ur mom haha',
    ],
  },
  {
    id: 'memory-3',
    tag: 'Memory 03',
    timeBadge: 'My Name on Your Hand',
    title: '“Shiva ❤️” In Your Palm',
    image: '/images/memories/memory-3.jpg',
    alt: "Neeta's hand adorned with alta and Shiva's name written on her palm",
    aspectClass: 'aspect-[9/16]',
    objectFit: 'cover',
    objectPosition: 'object-center',
    highlightQuote: '“How on earth someone could not possibly melt here baby?”',
    paragraphs: [
      'How on earth someone could not possibly melt here baby? It really made me so special because no one ever did that for me hehe',
    ],
  },
  {
    id: 'memory-4',
    tag: 'Memory 04',
    timeBadge: 'Just For Me',
    title: 'The First Picture of You',
    image: '/images/memories/memory-4.jpg',
    alt: 'The first candid picture Neeta sent just for Shiva',
    aspectClass: 'aspect-[4/4.6]',
    objectFit: 'cover',
    objectPosition: 'object-center',
    highlightQuote: '“The first time u sent me a picture of yourself just for me...”',
    paragraphs: [
      "You'd sent me pictures before but this was the first time u sent me a picture of yourself just for me u probably had no idea how happy that little moment made me I was so excited n I wish u could've seen the smile on my face maybe it was just a picture to u but to me it became a memory I'll always hold close to my heart",
    ],
  },
  {
    id: 'memory-5',
    tag: 'Memory 05',
    timeBadge: 'A Sacred Wish',
    title: 'The Hanuman Mandir',
    image: '/images/memories/memory-5.jpg',
    alt: 'Hanuman Mandir where Neeta prayed for both of them to meet',
    aspectClass: 'aspect-[9/16]',
    objectFit: 'cover',
    objectPosition: 'object-center',
    highlightQuote: '“Aapne yeh bhi kaha ki aap hum dono milne ka Hanuman ji se mange ho...”',
    paragraphs: [
      'mujhe pata hain aap jab bhi sad aur low feel karthe ho aap hanuman mandhir jaathe ho aapke mun ko shanti miltha hain aur aapne yeh bhi kaha ki aap hum dono milneka hanuman ji se mange ho and i really wish that we coul meet sooner than later bbg n visit hanuman temple together hehe',
    ],
  },
  {
    id: 'memory-6',
    tag: 'Memory 06',
    timeBadge: 'Mmmwahh... ❤️',
    title: 'Aapka Kiss',
    image: '/images/memories/memory-6.jpg',
    alt: 'Lipstick kiss mark on letter with handwritten Mmmwahh and heart',
    aspectClass: 'aspect-square',
    objectFit: 'contain',
    objectPosition: 'object-center',
    highlightQuote: '“Mujhe pehli baar kisine kiss kiya hehe...”',
    paragraphs: [
      'aapka kiss, mujhe phele baar kisine kiss kiya hehe I just wanna kiss you a thousand times and keep you close to me 😭 I wanna hold u close forever and never leave u and give u plenty of kisses rn',
    ],
  },
];

export default function SceneMemories() {
  const sectionRef = useRef<HTMLElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const memoryCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const candleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const opening = openingRef.current;
    const closing = closingRef.current;
    const transition = transitionRef.current;
    const candle = candleRef.current;

    if (!section || !opening || !closing || !transition || !candle) return;

    const ctx = gsap.context(() => {
      // Pin distance: scales cleanly with memories count
      const scrollDistance = 350 + MEMORIES.length * 150;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${scrollDistance}%`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          refreshPriority: 8,
        },
      });

      // Initially ensure all memory items are strictly hidden
      memoryCardRefs.current.forEach((card) => {
        if (card) {
          gsap.set(card, { autoAlpha: 0, y: 35, scale: 0.97 });
        }
      });
      gsap.set(closing, { autoAlpha: 0, y: 30 });
      gsap.set(transition, { autoAlpha: 0 });
      gsap.set(candle, { autoAlpha: 0, scale: 0 });

      // 1. Opening Intro Text (0.0 to 1.0)
      tl.fromTo(opening, { autoAlpha: 0, y: 35 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.0)
        .to(opening, { autoAlpha: 0, y: -25, duration: 0.3, ease: 'power2.in' }, 0.65);

      // 2. Sequential Memories — Strictly isolated time windows with clean gaps
      // Enter (0.4s) -> Hold (1.3s) -> Exit (0.35s) -> 0.15s buffer gap before next memory!
      const memWindow = 2.2;
      const memBaseTime = 1.1;

      MEMORIES.forEach((_, i) => {
        const card = memoryCardRefs.current[i];
        if (!card) return;

        const start = memBaseTime + i * memWindow;

        // Card enters smoothly
        tl.fromTo(
          card,
          { autoAlpha: 0, y: 35, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' },
          start
        )
          // Card exits completely BEFORE next card begins
          .to(
            card,
            { autoAlpha: 0, y: -30, scale: 0.97, duration: 0.35, ease: 'power2.in' },
            start + 1.7
          );
      });

      // 3. Closing poetic thought
      const closingStart = memBaseTime + MEMORIES.length * memWindow + 0.1;
      tl.fromTo(closing, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, closingStart)
        .to(closing, { autoAlpha: 0, y: -15, duration: 0.3, ease: 'power2.in' }, closingStart + 0.9);

      // 4. Transition overlay fades to deep burgundy
      const transitionStart = closingStart + 1.0;
      tl.fromTo(transition, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, transitionStart);

      // 5. Warm flickering candle flame emerges in exact center
      tl.fromTo(
        candle,
        { autoAlpha: 0, scale: 0 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
        transitionStart + 0.2
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-memories"
      className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: '#080608' }}
      aria-label="Scene 3: Our Memories"
    >
      {/* Subtle ambient romantic lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(143,16,43,0.14) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Opening Intro Text */}
      <div
        ref={openingRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span
          className="font-inter text-[11px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4"
          style={{ color: '#D6A0AC' }}
        >
          Chapter Three
        </span>
        <h2
          className="font-cormorant text-3xl sm:text-5xl md:text-6xl font-light"
          style={{ color: '#F7EFE9' }}
        >
          Our Little Universe.
        </h2>
        <p
          className="mt-3 sm:mt-5 font-cormorant text-base sm:text-xl font-light italic max-w-xl"
          style={{ color: '#D7BE9B', lineHeight: 1.6 }}
        >
          Some moments may seem small to the rest of the world, but they became the reason my whole world changed.
        </p>
      </div>

      {/* Sequential Clean Memories (100% Mobile Friendly & Responsive) */}
      {MEMORIES.map((memory, i) => (
        <div
          key={memory.id}
          ref={(el) => {
            memoryCardRefs.current[i] = el;
          }}
          className="absolute inset-0 z-10 flex items-center justify-center p-3 sm:p-6 md:p-12 pointer-events-none"
          style={{ opacity: 0, visibility: 'hidden', willChange: 'opacity, transform' }}
        >
          <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-14 lg:gap-20 max-h-[92dvh]">
            {/* Left: Clean, Framed Photo — Compact & balanced on mobile, expansive on desktop */}
            <div className="relative flex-shrink-0 flex items-center justify-center pointer-events-auto">
              {/* Soft ambient picture glow */}
              <div
                className="absolute -inset-3 rounded-2xl opacity-35 blur-xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(197,31,69,0.45) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />

              {/* Pure Framed Photograph */}
              <div
                className={`relative ${memory.aspectClass} h-[24vh] sm:h-[30vh] md:h-[62vh] max-h-[190px] sm:max-h-[260px] md:max-h-[580px] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)] border border-white/10 bg-[#0d070b]`}
              >
                <Image
                  src={memory.image}
                  alt={memory.alt}
                  fill
                  className={`${
                    memory.objectFit === 'contain' ? 'object-contain p-1.5' : 'object-cover'
                  } ${memory.objectPosition}`}
                  sizes="(max-width: 768px) 70vw, 420px"
                  priority={i === 0}
                />
              </div>
            </div>

            {/* Right: Simple, Spacious Typography — Free from overflow on all mobile screens */}
            <div className="flex-1 max-w-xl text-left pointer-events-auto max-h-[55vh] sm:max-h-[58vh] md:max-h-none overflow-y-auto pr-1">
              {/* Title */}
              <h3 className="font-cormorant text-2xl sm:text-3xl md:text-5xl font-light text-[#F7EFE9] mb-1.5 sm:mb-3 leading-tight">
                {memory.title}
              </h3>

              {/* Highlight Quote */}
              <p className="font-cormorant text-base sm:text-xl md:text-2xl italic text-[#D7BE9B] mb-2 sm:mb-4">
                {memory.highlightQuote}
              </p>

              {/* Shiva's Words */}
              <div className="space-y-2 sm:space-y-4 font-cormorant text-sm sm:text-base md:text-xl text-[#F7EFE9]/95 leading-relaxed font-light italic">
                {memory.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Closing Statement */}
      <div
        ref={closingRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <p
          className="font-cormorant text-lg sm:text-2xl md:text-3xl font-light italic max-w-2xl"
          style={{ color: '#F7EFE9', textShadow: '0 2px 30px rgba(8,6,8,0.95)', lineHeight: 1.6 }}
        >
          &ldquo;If I could keep a few things from this world forever, some of my favourite moments would be the ones that remind me of us.&rdquo;
        </p>
        <p
          className="mt-4 sm:mt-6 font-cormorant text-sm sm:text-lg tracking-[0.2em]"
          style={{ color: '#D6A0AC' }}
        >
          And today, we celebrate the most special person in my life.
        </p>
      </div>

      {/* Transition overlay: deep burgundy */}
      <div
        ref={transitionRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ backgroundColor: '#250710', opacity: 0 }}
        aria-hidden="true"
      />

      {/* Tiny candle light appearing during transition */}
      <div
        ref={candleRef}
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <div className="relative flex flex-col items-center">
          {/* Glow halo */}
          <div
            className="absolute rounded-full"
            style={{
              width: '140px',
              height: '140px',
              background: 'radial-gradient(circle, rgba(255,200,80,0.4) 0%, transparent 70%)',
              top: '-35px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          {/* Flame SVG */}
          <svg width="22" height="32" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flame">
            <path d="M9 28C13.4 28 17 24.2 17 19.5C17 16.2 15.2 13.4 12.5 11.8C12.8 13.5 12.1 15.2 11 16.3C11 13.5 9.3 11.1 7 9.8C7.2 11.4 6.5 13 5.5 14C4.2 11.8 4 8.5 5 6C3.2 7.5 1 10.5 1 14C1 22 4.5 28 9 28Z" fill="#FF8C42"/>
            <path d="M9 24C11.2 24 13 22 13 19.5C13 17.8 12.1 16.4 10.8 15.5C10.8 17 10.1 18.2 9 18.8C7.9 17.5 7.5 15.8 7.8 14.2C6.8 15 6 16.5 6 18C6 21.3 7.3 24 9 24Z" fill="#FFD166"/>
            <path d="M9 20C9.8 20 10.5 19.3 10.5 18.5C10.5 17.9 10 17 9 16.5C8 17 7.5 17.9 7.5 18.5C7.5 19.3 8.2 20 9 20Z" fill="#FFF3B0"/>
          </svg>
          {/* Candle body */}
          <div
            className="w-3 rounded-t-sm"
            style={{ height: '50px', background: 'linear-gradient(to bottom, #F7EFE9 0%, #D7BE9B 100%)' }}
          />
        </div>
      </div>
    </section>
  );
}
