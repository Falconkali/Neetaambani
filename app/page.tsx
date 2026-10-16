'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import SceneRose from './components/scenes/SceneRose';
import ScenePortraits from './components/scenes/ScenePortraits';
import SceneMemories from './components/scenes/SceneMemories';
import SceneBirthday from './components/scenes/SceneBirthday';
import AudioPlayer from './components/ui/AudioPlayer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Init Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Ensure all pinned scenes are calculated in strict top-down order
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <main id="main-content">
      <SceneRose />
      <ScenePortraits />
      <SceneMemories />
      <SceneBirthday />
      <AudioPlayer />
    </main>
  );
}
