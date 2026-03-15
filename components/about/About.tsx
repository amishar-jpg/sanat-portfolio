"use client";

/**
 * About.tsx — Max Milkin style scroll-driven letter assembly
 *
 * Tech Stack:
 *  - Next.js 14  (App Router, "use client")
 *  - TypeScript
 *  - Tailwind CSS  (utility classes where sensible)
 *  - GSAP + ScrollTrigger  ← the core animation engine
 *
 * Install:
 *   npm install gsap
 *   (ScrollTrigger is bundled inside gsap — no extra package)
 *
 * ─── How the animation works ────────────────────────────────────────────────
 *  1. On mount, every letter span starts at a RANDOM scatter position
 *     (seeded so SSR and client match — no hydration mismatch).
 *  2. A GSAP timeline is pinned to the scroll container with scrub: 1.2
 *     so the animation tracks scroll 1-to-1 with a small lag.
 *  3. As the user scrolls, each letter tweens left/top from its scatter
 *     position → its final assembled position in the two giant words.
 *  4. Portrait photo scales in + bio text fades up at ~75% scroll progress.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LetterData {
  char: string;
  scatterX: number; // % of vw — initial random position
  scatterY: number; // % of vh — initial random position
  finalX: number; // % of vw — assembled position
  finalY: number; // % of vh — assembled position
  stagger: number; // 0–1, used to offset animation start within the timeline
  id: string;
}

// ─── Words to animate ─────────────────────────────────────────────────────────
const LINE_1 = "SOFTWARE";
const LINE_2 = "DEVELOPER";

// Seeded pseudo-random — same values on server and client
function seeded(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453;
  return x - Math.floor(x);
}

function buildLetters(): LetterData[] {
  const out: LetterData[] = [];

  // SOFTWARE — assembled across full width, top 20%
  LINE_1.split("").forEach((char, i) => {
    out.push({
      char,
      finalX: 2 + (i / (LINE_1.length - 1)) * 96,
      finalY: 20,
      scatterX: seeded(i * 7 + 1) * 82 + 5,
      scatterY: seeded(i * 7 + 2) * 72 + 8,
      stagger: seeded(i * 7 + 3),
      id: `L1-${i}`,
    });
  });

  // DEVELOPER — assembled across full width, bottom 62%
  LINE_2.split("").forEach((char, i) => {
    out.push({
      char,
      finalX: 6 + (i / (LINE_2.length - 1)) * 88,
      finalY: 62,
      scatterX: seeded(i * 11 + 50) * 82 + 5,
      scatterY: seeded(i * 11 + 51) * 72 + 10,
      stagger: seeded(i * 11 + 52),
      id: `L2-${i}`,
    });
  });

  return out;
}

const LETTERS: LetterData[] = buildLetters();

// ─── Component ────────────────────────────────────────────────────────────────
export default function About() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── Set bio initial y offset so GSAP can animate it up ────────────
      gsap.set(bioRef.current, { y: 28 });

      // ── Master scrubbed timeline ───────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      });

      // Phase 1 — letters fly from scatter → assembled (0 → 0.8 of tl)
      LETTERS.forEach((l, i) => {
        const el = letterRefs.current[i];
        if (!el) return;

        tl.to(
          el,
          {
            left: `${l.finalX}%`,
            top: `${l.finalY}%`,
            color: "rgba(255,255,255,0.06)",
            fontSize: "clamp(3.5rem, 9vw, 9.5rem)",
            duration: 0.7,
            ease: "power3.inOut",
          },
          // staggered start: each letter begins slightly after the previous
          l.stagger * 0.35,
        );
      });

      // Phase 2 — portrait + bio fade in (at ~70% through timeline)
      tl.to(
        photoRef.current,
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
        0.6,
      );
      tl.to(
        bioRef.current,
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.75,
      );

      // Bio text — words start exploded and assemble into place
      const bioWords =
        bioRef.current?.querySelectorAll<HTMLSpanElement>(".bio-word") ?? [];
      bioWords.forEach((el, i) => {
        const angle = seeded(i * 13 + 200) * Math.PI * 2;
        const radius = 180 + seeded(i * 13 + 201) * 220; // larger explosion radius
        const fromX = Math.cos(angle) * radius;
        const fromY = Math.sin(angle) * radius;

        tl.fromTo(
          el,
          {
            x: fromX,
            y: fromY,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          0.72 + (i / Math.max(bioWords.length, 1)) * 0.22,
        );
      });

      // Scroll hint fades out as soon as user starts scrolling
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "60px top",
          end: "250px top",
          scrub: true,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── Global styles + Google Fonts ─────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #080808; color: #fff; overflow-x: hidden; }

        .bio-word {
          display: inline-block;
          will-change: transform, opacity;
        }

        ::-webkit-scrollbar        { width: 2px; }
        ::-webkit-scrollbar-track  { background: transparent; }
        ::-webkit-scrollbar-thumb  { background: rgba(255,255,255,0.12); }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.25; transform: scaleY(1);    transform-origin: top; }
          55%       { opacity: 0.9;  transform: scaleY(1.12); transform-origin: top; }
        }
      `}</style>

      {/* ── Scroll wrapper — 3× viewport height drives the animation ─── */}
      <div ref={wrapperRef} style={{ height: "300vh", background: "#080808" }}>
        {/* ── Sticky scene ───────────────────────────────────────────── */}
        <div
          ref={stickyRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            background: "#080808",
          }}
        >
          

          {/* ── Corner labels ──────────────────────────────────────── */}
          <span style={{
            position: "absolute", top: 68, left: 32, zIndex: 40,
            fontFamily: "'Barlow', sans-serif",
            fontSize: "0.6rem", letterSpacing: "0.22em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.38)",
          }}>
            (ABOUT.)
          </span> 

          <span style={{
            position: "absolute", top: 68, right: 32, zIndex: 40,
            fontFamily: "'Barlow', sans-serif",
            fontSize: "0.6rem", letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.38)",
          }}>
            [ N.002 ]
          </span>

          {/* ── Right edge progress rail ────────────────────────────── */}
          <div style={{
            position: "absolute", right: 18, top: "10%", bottom: "10%",
            width: 1, background: "rgba(255,255,255,0.08)", zIndex: 40,
          }} />

        
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {LETTERS.map((l, i) => (
              <span
                key={l.id}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  left: `${l.scatterX}%`,
                  top: `${l.scatterY}%`,
                  transform: "translate(-50%, -50%)",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(1rem, 2.5vw, 2.2rem)", // small when scattered
                  lineHeight: 1,
                  color: "rgba(255,255,255,0.55)",
                  willChange: "left, top, font-size, color",
                  display: "block",
                }}
              >
                {l.char}
              </span>
            ))}
          </div>

          {/* ── Portrait photo ─────────────────────────────────────── */}
          <div
            ref={photoRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
              opacity: 0,
              scale: "1.25",
              width: "clamp(170px, 14vw, 225px)",
              aspectRatio: "3 / 4",
              overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.95)",
            }}
          >
            
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(155deg, #1c1c1c 0%, #2a2a2a 50%, #111 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/first.png"
                alt="Sanat Jha"
                style={{ width:"100%", height:"100%", objectFit:"cover", scale:"1.1" }}
              />
            </div>
          </div>

          {/* ── Bio text ───────────────────────────────────────────── */}
          <div
            ref={bioRef}
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              width: "min(560px, 86vw)",
              textAlign: "center",
              opacity: 0,
            }}
          >
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "clamp(0.52rem, 0.85vw, 0.7rem)",
                letterSpacing: "0.17em",
                lineHeight: 2.1,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <span className="bio-word">HI,</span>{" "}
              <span className="bio-word">I'M</span>{" "}
              <span className="bio-word">SANAT</span>{" "}
              <span className="bio-word">JHA</span>{" "}
              <span className="bio-word">A</span>{" "}
              <span className="bio-word">BTECH</span>{" "}
              <span className="bio-word">STUDENT</span>{" "}
              <span className="bio-word">AT</span>{" "}
              <span className="bio-word">IIT</span>{" "}
              <span className="bio-word">ROORKEE</span>
              <br />
              <span className="bio-word">MY</span>{" "}
              <span className="bio-word">FOCUS</span>{" "}
              <span className="bio-word">IS</span>{" "}
              <span className="bio-word">ON</span>{" "}
              <span className="bio-word">BUILDING</span>{" "}
              <span className="bio-word">MODERN</span>{" "}
              <span className="bio-word">EXCITING</span>{" "}
              <span className="bio-word">AND</span>{" "}
              <span className="bio-word">IMMERSIVE</span>{" "}
              <span className="bio-word">EXPERIENCES</span>
              <br />
              <span className="bio-word">THAT</span>{" "}
              <span className="bio-word">TRANSFORM</span>{" "}
              <span className="bio-word">SIMPLE</span>{" "}
              <span className="bio-word">WEBSITES</span>{" "}
              <span className="bio-word">INTO</span>{" "}
              <span className="bio-word">SOMETHING</span>{" "}
              <span className="bio-word">EXTRAORDINARY.</span>
            </p>
          </div>

          {/* ── Scroll hint ────────────────────────────────────────── */}
          <div
            ref={scrollHintRef}
            style={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.52rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
              }}
            >
              scroll
            </span>
            <div
              style={{
                width: 1,
                height: 42,
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
                animation: "scrollPulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
        {/* /sticky */}
      </div>
      {/* /wrapper */}
    </>
  );
}
