"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LetterData {
  char: string;
  scatterX: number;
  scatterY: number;
  finalX: number;
  finalY: number;
  stagger: number;
  id: string;
}

// ─── Words ────────────────────────────────────────────────────────────────────
const LINE_1 = "SOFTWARE";
const LINE_2 = "DEVELOPER";

// Seeded pseudo-random — identical on server + client (no hydration mismatch)
function seeded(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453;
  return x - Math.floor(x);
}

function buildLetters(): LetterData[] {
  const out: LetterData[] = [];

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

// Bio words — split manually for per-word animation
const BIO_WORDS = [
  [
    "HI,",
    "I'M",
    "SANAT",
    "JHA",
    "A",
    "BTECH",
    "STUDENT",
    "AT",
    "IIT",
    "ROORKEE",
  ],
  [
    "MY",
    "FOCUS",
    "IS",
    "ON",
    "BUILDING",
    "MODERN",
    "EXCITING",
    "AND",
    "IMMERSIVE",
    "EXPERIENCES",
  ],
  [
    "THAT",
    "TRANSFORM",
    "SIMPLE",
    "WEBSITES",
    "INTO",
    "SOMETHING",
    "EXTRAORDINARY.",
  ],
];

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
      gsap.set(bioRef.current, { y: 28 });

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

      // Phase 1 — letters fly from scatter → assembled
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
          l.stagger * 0.35,
        );
      });

      // Phase 2 — portrait + bio
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

      // Bio words assemble
      const bioWords =
        bioRef.current?.querySelectorAll<HTMLSpanElement>(".bio-word") ?? [];
      bioWords.forEach((el, i) => {
        const angle = seeded(i * 13 + 200) * Math.PI * 2;
        const radius = 180 + seeded(i * 13 + 201) * 220;
        tl.fromTo(
          el,
          {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            opacity: 0,
          },
          { x: 0, y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          0.72 + (i / Math.max(bioWords.length, 1)) * 0.22,
        );
      });

      // Scroll hint fade
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;1,300&display=swap');

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

      {/* ── Scroll wrapper — 3× vh drives animation ── */}
      <div
        ref={wrapperRef}
        className="bg-[#080808]"
        style={{ height: "300vh" }}
      >
        {/* ── Sticky scene ── */}
        <div
          ref={stickyRef}
          className="sticky top-0 w-full h-screen overflow-hidden bg-[#080808]"
        >
          {/* ── Corner labels ── */}
          <motion.span
            className="absolute top-[68px] left-4 sm:left-8 z-40 uppercase text-white/40 tracking-[0.22em] cursor-pointer"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.6rem" }}
            whileHover={{ color: "rgba(255,255,255,0.8)", x: 3 }}
            transition={{ duration: 0.3 }}
          >
            (ABOUT.)
          </motion.span>

          <motion.span
            className="absolute top-[68px] right-4 sm:right-8 z-40 text-white/40 tracking-[0.18em] cursor-pointer"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.6rem" }}
            whileHover={{ color: "rgba(255,255,255,0.8)", x: -3 }}
            transition={{ duration: 0.3 }}
          >
            [ N.002 ]
          </motion.span>

          {/* ── Right edge progress rail ── */}
          <div className="absolute right-[18px] top-[10%] bottom-[10%] w-px bg-white/[0.08] z-40" />

          {/* ── Scatter letters ── */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none"
          >
            {LETTERS.map((l, i) => (
              <span
                key={l.id}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className="absolute block leading-none will-change-[left,top,font-size,color]"
                style={{
                  left: `${l.scatterX}%`,
                  top: `${l.scatterY}%`,
                  transform: "translate(-50%, -50%)",
                  fontFamily: "'Bebas Neue', sans-serif",
                  // smaller on mobile so scatter fits viewport
                  fontSize: "clamp(0.7rem, 2.2vw, 2.2rem)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {l.char}
              </span>
            ))}
          </div>

          {/* ── Portrait photo ── */}
          <motion.div
            ref={photoRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden cursor-pointer group"
            style={{
              opacity: 0,
              scale: "1.25",
              // smaller on mobile
              width: "clamp(120px, 14vw, 225px)",
              aspectRatio: "3 / 4",
              boxShadow: "0 40px 100px rgba(0,0,0,0.95)",
            }}
            whileHover={{ 
              scale: "1.3",
              boxShadow: "0 50px 120px rgba(0,0,0,0.8)",
            }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.img
              src="/first.png"
              alt="Sanat Jha"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              style={{ scale: "1.1" }}
            />
            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </motion.div>

          {/* ── Bio text ── */}
          <div
            ref={bioRef}
            className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-30 text-center"
            style={{
              width: "min(560px, 86vw)",
              opacity: 0,
            }}
          >
            <p
              className="uppercase text-white/80"
              style={{
                fontFamily: "'Barlow', sans-serif",
                // slightly larger on mobile for legibility
                fontSize: "clamp(0.48rem, 1.2vw, 0.7rem)",
                letterSpacing: "0.17em",
                lineHeight: 2.1,
              }}
            >
              {BIO_WORDS.map((line, li) => (
                <span key={li}>
                  {line.map((word, wi) => (
                    <span key={wi}>
                      <span className="bio-word">{word}</span>
                      {wi < line.length - 1 && " "}
                    </span>
                  ))}
                  {li < BIO_WORDS.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* ── Scroll hint ── */}
          <div
            ref={scrollHintRef}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          >
            <span
              className="uppercase text-white/30 tracking-[0.3em]"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.52rem",
              }}
            >
              scroll
            </span>
            <div
              className="w-px h-[42px]"
              style={{
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
