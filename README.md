# Happy Birthday, Neeta ♡

**A cinematic, scroll-driven birthday experience — made by Shiva.**

---

## 🚀 Getting Started

```bash
# From the project root (d:\Neeta\neeta-birthday)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview.

---

## 📁 Project Structure

```
neeta-birthday/
├── app/
│   ├── components/
│   │   ├── scenes/
│   │   │   ├── SceneRose.tsx      — Scene 01: The rose blooms
│   │   │   ├── ScenePortraits.tsx — Scene 02: Four portraits
│   │   │   ├── SceneMemories.tsx  — Scene 03: Our memories
│   │   │   └── SceneBirthday.tsx  — Scene 04: Birthday cake
│   │   ├── animations/
│   │   │   ├── RoseCanvas.tsx     — Canvas rose bloom animation
│   │   │   ├── Particles.tsx      — Atmospheric particles
│   │   │   └── PetalRain.tsx      — Falling rose petals
│   │   └── ui/
│   │       ├── Cake.tsx           — Interactive SVG cake
│   │       └── AudioPlayer.tsx    — Optional music control
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── public/
    ├── images/
    │   ├── neeta/
    │   │   ├── neeta-1.jpg   ← Scene 02, photo 1
    │   │   ├── neeta-2.jpg   ← Scene 02, photo 2
    │   │   ├── neeta-3.jpg   ← Scene 02, photo 3
    │   │   └── neeta-4.jpg   ← Scene 02, photo 4
    │   └── memories/
    │       ├── memory-1.jpg  ← Scene 03, memory 1
    │       ├── memory-2.jpg  ← Scene 03, memory 2
    │       ├── memory-3.jpg  ← Scene 03, memory 3
    │       ├── memory-4.jpg  ← Scene 03, memory 4
    │       └── memory-5.jpg  ← Scene 03, memory 5
    ├── videos/
    │   └── rose-bloom.mp4    ← Optional: replaces canvas rose
    └── audio/
        └── our-song.mp3      ← Optional: background music
```

---

## 🌹 Adding Photos

### Scene 02 — Portrait photos of Neeta (4 required)

Place **4 photos** of Neeta in:
```
public/images/neeta/neeta-1.jpg
public/images/neeta/neeta-2.jpg
public/images/neeta/neeta-3.jpg
public/images/neeta/neeta-4.jpg
```

- **Recommended:** Portrait-oriented JPGs, minimum 1200×1600px
- Each photo gets a different cinematic treatment automatically
- Captions are pre-written but editable in `ScenePortraits.tsx` → `PORTRAITS` array

### Scene 03 — Memory photos (5 default, adjustable)

Place memory photos in `public/images/memories/memory-1.jpg` through `memory-5.jpg`.

To **add more photos**, edit the `MEMORIES` array in `SceneMemories.tsx`:
```ts
const MEMORIES = [
  { src: '/images/memories/memory-1.jpg', alt: 'Description', caption: 'Optional caption' },
  // Add as many as you like
];
```

To **add captions**, fill in the `caption` field for any entry.

---

## 🎵 Adding Music

Place your MP3 at:
```
public/audio/our-song.mp3
```

A music button will automatically appear in the bottom-right corner. Music never autoplays — it requires Neeta to tap the button. The experience works fully without music.

---

## 🌹 Rose Video (Optional Upgrade)

The rose is currently rendered via `RoseCanvas.tsx` (canvas + Bézier curves).

For a more photorealistic rose, record or source a macro rose-blooming video and place it at:
```
public/videos/rose-bloom.mp4
```

Then in `SceneRose.tsx`, replace `<RoseCanvas />` with a `<video>` element and control its `currentTime` via GSAP ScrollTrigger's `onUpdate` callback.

---

## ✏️ Personalizing Text

All copy is editable directly in the component files:

| File | What to edit |
|------|-------------|
| `SceneRose.tsx` | Opening quote and signature |
| `ScenePortraits.tsx` | `PORTRAITS` array captions + closing statement |
| `SceneMemories.tsx` | `MEMORIES` array, opening/closing text |
| `SceneBirthday.tsx` | Birthday dedication message |

---

## 🚀 Deploy to Vercel

```bash
npm run build   # Test production build locally
```

Then connect the `neeta-birthday` folder to [vercel.com](https://vercel.com) and deploy. No additional configuration needed.

> **Tip:** Set the Vercel project name to something personal like `neeta-birthday-shiva` so the URL feels intentional.

---

## 🎂 Birthday Details

- **Recipient:** Neeta
- **Creator:** Shiva
- **Birthday:** October 17
- **Experience:** Four cinematic scenes — Rose → Portraits → Memories → Birthday

*Made with all my love. ♡*
