'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export default function AudioPlayer() {
  const [exists, setExists] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/audio/our-song.mp3', { method: 'HEAD' })
      .then(r => {
        if (r.ok) {
          setExists(true);
          setVisible(true);
          const audio = new Audio('/audio/our-song.mp3');
          audio.loop = true;
          audio.volume = 0.45;
          audioRef.current = audio;
        }
      })
      .catch(() => {});

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  if (!exists) return null;

  return (
    <div
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 sm:bottom-6 sm:right-6 z-[200]"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      <button
        onClick={toggle}
        className="btn-cinematic !p-3 !text-xs !tracking-widest rounded-full"
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause music' : 'Play our song'}
        style={{ borderRadius: '50px', gap: '0.4rem' }}
      >
        {playing ? (
          <>
            <PauseIcon />
            <span className="hidden sm:inline">Pause</span>
          </>
        ) : (
          <>
            <PlayIcon />
            <span className="hidden sm:inline">♪ Our song</span>
          </>
        )}
      </button>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
