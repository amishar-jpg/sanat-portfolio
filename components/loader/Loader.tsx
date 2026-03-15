"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface OrbitDef {
  word: string;
  r: number;
  dir: 1 | -1;
  fontSize: number;
  opacity: number;
}

// Base orbits defined for a ~1440px wide viewport.
// We scale them down at runtime for smaller screens.
const ORBITS: OrbitDef[] = [
  { word: "INTERACTIVE", r: 320, dir: -1, fontSize: 16, opacity: 0.6 },
  { word: "FRONTEND", r: 268, dir: 1, fontSize: 17, opacity: 0.65 },
  { word: "CREATIVE", r: 220, dir: -1, fontSize: 17, opacity: 0.72 },
  { word: "MOTION", r: 175, dir: 1, fontSize: 18, opacity: 0.78 },
  { word: "DESIGN", r: 134, dir: -1, fontSize: 19, opacity: 0.85 },
  { word: "CODE", r: 96, dir: 1, fontSize: 20, opacity: 0.92 },
];

/** Scale factor so the outermost orbit always fits comfortably on screen */
function getOrbitScale(): number {
  const MIN_DIM = Math.min(window.innerWidth, window.innerHeight);
  const MAX_R = MIN_DIM * 0.42;
  return Math.min(1, MAX_R / 320);
}

function letterAngle(
  i: number,
  total: number,
  progress: number,
  dir: 1 | -1,
): number {
  const TAU = Math.PI * 2;
  const spread = progress * TAU * dir;
  const spacing = total > 1 ? spread / total : 0;
  return -Math.PI / 2 + i * spacing;
}

function letterTransform(angle: number, r: number, cx: number, cy: number) {
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r,
    rot: (angle * 180) / Math.PI + 90,
  };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface LoadingProps {
  onComplete?: () => void;
  duration?: number;
}

export default function Loading({ onComplete, duration = 3200 }: LoadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const CX = window.innerWidth / 2;
    const CY = window.innerHeight / 2;
    const scale = getOrbitScale();

    const map: { orbitIdx: number; letterIdx: number }[] = [];
    ORBITS.forEach((orb, oi) =>
      orb.word
        .split("")
        .forEach((_, li) => map.push({ orbitIdx: oi, letterIdx: li })),
    );

    const els = letterRefs.current;

    // Set initial position (all letters stacked at top of each orbit arc)
    map.forEach(({ orbitIdx }, i) => {
      const orb = ORBITS[orbitIdx];
      const { x, y, rot } = letterTransform(
        -Math.PI / 2,
        orb.r * scale,
        CX,
        CY,
      );
      const el = els[i];
      if (!el) return;
      gsap.set(el, { x, y, rotation: rot, opacity: 0 });
    });

    // Fade letters in with stagger
    gsap.to(els, {
      opacity: (_i, el) => {
        const idx = els.indexOf(el as HTMLSpanElement);
        const oi = map[idx]?.orbitIdx ?? 0;
        return ORBITS[oi].opacity;
      },
      duration: 0.8,
      stagger: 0.01,
      ease: "power2.out",
      delay: 0.1,
    });

    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const rawP = Math.min((now - start) / duration, 1);
      const eased = easeInOutCubic(rawP);

      if (pctRef.current)
        pctRef.current.textContent = Math.round(rawP * 100) + "%";

      map.forEach(({ orbitIdx, letterIdx }, i) => {
        const orb = ORBITS[orbitIdx];
        const el = els[i];
        if (!el) return;
        const angle = letterAngle(letterIdx, orb.word.length, eased, orb.dir);
        const { x, y, rot } = letterTransform(angle, orb.r * scale, CX, CY);
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg)`;
      });

      if (rawP < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Slide the overlay up, then notify Navbar (and any onComplete caller)
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 1.0,
          delay: 0.6,
          ease: "power3.inOut",
          onComplete: () => {
            // 1. Dispatch event so Navbar.tsx can start its entrance animation
            //    without any prop drilling or shared state.
            window.dispatchEvent(new Event("loader:done"));
            // 2. Still call the external onComplete if provided
            onComplete?.();
          },
        });
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Flatten all letters for rendering
  const allLetters: { char: string; oi: number; li: number }[] = [];
  ORBITS.forEach((orb, oi) =>
    orb.word.split("").forEach((char, li) => allLetters.push({ char, oi, li })),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,600&display=swap');

        .ld-root::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.055'/%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .ld-letter {
          font-family: 'Bebas Neue', sans-serif;
        }

        .ld-pct {
          font-family: 'Bebas Neue', sans-serif;
        }
      `}</style>

      <div
        ref={rootRef}
        className="ld-root fixed inset-0 z-[9999] overflow-hidden bg-[#f8fff6]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {allLetters.map(({ char, oi, li }, i) => (
          <span
            key={`${oi}-${li}`}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className={[
              "ld-letter",
              "fixed top-0 left-0",
              "font-normal tracking-[0.18em]",
              "text-[#0e0c0c]",
              "leading-none",
              "pointer-events-none select-none",
              "will-change-[transform,opacity]",
              "whitespace-nowrap",
              "-translate-x-1/2 -translate-y-1/2",
            ].join(" ")}
            style={{
              fontSize: `clamp(${ORBITS[oi].fontSize * 0.65}px, ${ORBITS[oi].fontSize * 0.9}px, ${ORBITS[oi].fontSize}px)`,
            }}
          >
            {char}
          </span>
        ))}

        <span
          ref={pctRef}
          className={[
            "ld-pct",
            "fixed top-1/2 left-1/2",
            "-translate-x-1/2 -translate-y-1/2",
            "font-normal tracking-[0.08em]",
            "text-[#0e0c0c] leading-none",
            "pointer-events-none select-none",
            "z-[10001]",
            "text-[26px] sm:text-[34px] md:text-[42px]",
          ].join(" ")}
        >
          0%
        </span>
      </div>
    </>
  );
}
