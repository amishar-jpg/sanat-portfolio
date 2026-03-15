"use client";

/**
 * Hero.tsx
 *
 * Layout:
 *  - Full-viewport hero, grey background
 *  - Centre: large portrait photo (replace src with your own)
 *  - Top-left: location pill (dark rounded pill + globe icon)
 *  - Top-right: diagonal arrow + role description
 *  - Bottom: infinitely scrolling name marquee that bleeds off both edges
 *
 * Dependencies: none beyond Next.js / React / Tailwind
 * Fonts: Barlow (loaded via <style> Google Fonts import)
 */

import Image from "next/image";
import { useEffect, useRef } from "react";

/* ─── marquee text — duplicate to fill the strip ───────────────────────── */
const MARQUEE_TEXT = "SANAT  JHA  .  SOFTWARE  DEVELOPER  .";
const COPIES = 6; // enough copies to fill even the widest screen

export default function Hero() {
  const track1Ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);

  /* pure-RAF marquee — no GSAP dependency, silky smooth */
  useEffect(() => {
    const track = track1Ref.current;
    if (!track) return;

    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      posRef.current -= dt * 0.055; // px per ms → ~55px/s

      // reset when we've scrolled one copy width
      const oneW = track.scrollWidth / COPIES;
      if (Math.abs(posRef.current) >= oneW) {
        posRef.current += oneW;
      }

      track.style.transform = `translateX(${posRef.current}px)`;
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800;900&display=swap');

        .hero-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          min-height: 600px;
          background: #000000ff;
          overflow: hidden;
          font-family: 'Barlow', sans-serif;
        }

        /* ── photo ─────────────────────────────────────────────────────── */
        .hero-photo-wrap {
          position: absolute;
          bottom: 50px;
          left: 53%;
          scale: 1.2;
          transform: translateX(-50%);
          width: clamp(380px, 48vw, 560px);
          height: clamp(480px, 72vh, 760px);
          z-index: 2;
        }

        .hero-photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }

        /* ── location pill ─────────────────────────────────────────────── */
        .hero-location {
          position: absolute;
          top: 50%;
          left: -10px;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0;
          background: #fcf6f6ff;
          border-radius: 0 40px 40px 0;
          padding: 14px 10px 14px 22px;
          max-width: 280px;
        }

        .hero-location-text {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.4;
          color: rgba(0, 0, 0, 0.85);
          letter-spacing: 0.01em;
          padding-right: 10px;
        }

        .hero-location-globe {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #282727ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-location-globe svg {
          width: 24px;
          height: 24px;
          stroke: rgba(255,255,255,0.7);
          fill: none;
          stroke-width: 1.5;
        }

        /* ── role (top-right) ──────────────────────────────────────────── */
        .hero-role {
          position: absolute;
          top: 50%;
          right: 72px;
          transform: translateY(-50%);
          z-index: 10;
          text-align: left;
        }

        .hero-arrow {
          display: block;
          font-size: 22px;
          color: rgba(255,255,255,0.9);
          margin-bottom: 18px;
          line-height: 1;
        }

        .hero-role-text {
          font-size: clamp(22px, 2.4vw, 34px);
          font-weight: 500;
          color: rgba(255,255,255,0.95);
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        /* ── marquee strip ─────────────────────────────────────────────── */
        .hero-marquee-outer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          overflow: hidden;
          z-index: 5;
          /* name sits above the photo bottom edge */
          padding-bottom: 10px;
          line-height: 1;
        }

        .hero-marquee-track {
          display: flex;
          align-items: baseline;
          will-change: transform;
          white-space: nowrap;
        }

        .hero-marquee-item {
          font-size: clamp(90px, 12vw, 180px);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 0.88;
          padding-right: clamp(40px, 4vw, 80px);
          flex-shrink: 0;
          /* subtle text shadow so name reads over photo */
          text-shadow: 0 2px 40px rgba(0,0,0,0.12);
        }

        /* separator dot between copies */
        .hero-marquee-sep {
          font-size: clamp(16px, 2vw, 28px);
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          padding-right: clamp(40px, 4vw, 80px);
          flex-shrink: 0;
          line-height: 0.88;
          align-self: center;
        }
      `}</style>

      <div className="hero-root">

        {/* ── photo ── */}
        <div className="hero-photo-wrap">
          <img
            src="/first.png"
            alt="Portrait"
          />
        </div>

        {/* ── location pill ── */}
        <div className="hero-location">
          <span className="hero-location-text">
            Located in the India
          </span>
          <div className="hero-location-globe">
            {/* globe SVG */}
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        </div>

        {/* ── role text ── */}
        <div className="hero-role">
          <span className="hero-arrow">↘</span>
          <p className="hero-role-text">
            Software Engineer<br />
            &amp; Developer
          </p>
        </div>

        {/* ── infinite marquee ── */}
        <div className="hero-marquee-outer">
          <div ref={track1Ref} className="hero-marquee-track">
            {Array.from({ length: COPIES }).map((_, i) => (
              <span key={i} className="hero-marquee-item">
                {MARQUEE_TEXT}
                {i < COPIES - 1 && (
                  <span className="hero-marquee-sep"> · </span>
                )}
              </span>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}