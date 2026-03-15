"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const MARQUEE_TEXT = "SANAT  JHA  .  SOFTWARE  DEVELOPER  .";
const COPIES = 6;

// ─────────────────────────────────────────────
// Reusable GSAP char-shuffle hook
// ─────────────────────────────────────────────
function useCharShuffle(text: string) {
  const topRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const onEnter = () => {
    if (busy.current) return;
    busy.current = true;
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
        },
      })
      .to(topRef.current!.querySelectorAll(".sh-char"), {
        yPercent: -130,
        opacity: 0,
        duration: 0.22,
        stagger: 0.022,
        ease: "power2.in",
      })
      .fromTo(
        botRef.current!.querySelectorAll(".sh-char"),
        { yPercent: 130, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.22,
          stagger: 0.022,
          ease: "power2.out",
        },
        "<0.04",
      );
  };

  const onLeave = () => {
    if (busy.current) return;
    busy.current = true;
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
        },
      })
      .to(botRef.current!.querySelectorAll(".sh-char"), {
        yPercent: 130,
        opacity: 0,
        duration: 0.2,
        stagger: 0.018,
        ease: "power2.in",
      })
      .fromTo(
        topRef.current!.querySelectorAll(".sh-char"),
        { yPercent: -130, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.2,
          stagger: 0.018,
          ease: "power2.out",
        },
        "<0.04",
      );
  };

  return { topRef, botRef, onEnter, onLeave };
}

// ─────────────────────────────────────────────
// Shuffling text element
// ─────────────────────────────────────────────
function ShuffleText({
  text,
  topClass,
  botClass,
  wrapClass = "",
}: {
  text: string;
  topClass: string;
  botClass: string;
  wrapClass?: string;
}) {
  const { topRef, botRef, onEnter, onLeave } = useCharShuffle(text);
  const chars = text.split("");

  return (
    <span
      className={`relative inline-flex cursor-default select-none ${wrapClass}`}
      style={{ overflow: "hidden", display: "inline-flex", height: "1.25em" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span ref={topRef} className="flex items-center">
        {chars.map((ch, i) =>
          ch === " " ? (
            <span key={i} className="sh-char inline-block">
              &nbsp;
            </span>
          ) : (
            <span key={i} className={`sh-char inline-block ${topClass}`}>
              {ch}
            </span>
          ),
        )}
      </span>
      <span
        ref={botRef}
        className="flex items-center absolute top-0 left-0 pointer-events-none"
        aria-hidden="true"
      >
        {chars.map((ch, i) =>
          ch === " " ? (
            <span key={i} className="sh-char inline-block opacity-0">
              &nbsp;
            </span>
          ) : (
            <span
              key={i}
              className={`sh-char inline-block opacity-0 ${botClass}`}
            >
              {ch}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────
export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      posRef.current -= dt * 0.055;

      const oneW = track.scrollWidth / COPIES;
      if (Math.abs(posRef.current) >= oneW) posRef.current += oneW;

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
      `}</style>

      <div
        className="relative w-screen min-h-screen overflow-hidden bg-black flex flex-col"
        style={{ fontFamily: "'Barlow', sans-serif", minHeight: 600 }}
      >
        {/* ── Portrait photo ── */}
        <div
          className={[
            "absolute bottom-[50px]",
            "left-1/2 -translate-x-1/2",
            "sm:left-[50%]",
            "w-[min(92vw,340px)] h-[min(68vw,440px)]",
            "sm:w-[min(48vw,560px)] sm:h-[min(72vh,760px)]",
            "sm:scale-[1.2]",
            "z-[2]",
          ].join(" ")}
        >
          <img
            src="/first.png"
            alt="Portrait"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* ── Location pill ── */}
        <div
          className={[
            "absolute z-10 flex items-center gap-0",
            "bg-[#fcf6f6] rounded-r-[40px]",
            "pl-4 sm:pl-[22px] pr-2 py-3 sm:py-[14px]",
            "top-[18%] sm:top-1/2 sm:-translate-y-1/2",
            "-left-[10px]",
            "max-w-[220px] sm:max-w-[280px]",
          ].join(" ")}
        >
          <span className="text-[13px] sm:text-[16px] font-medium leading-snug text-black/85 tracking-[0.01em] pr-2 sm:pr-[10px]">
            Located in
            <br />
            India
          </span>
          <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full bg-[#282727] flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 sm:w-6 sm:h-6 stroke-white/70 fill-none"
              strokeWidth={1.5}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        </div>

        {/* ── Role text (top-right) ── */}
        <div
          className={[
            "absolute z-10 text-left",
            "top-[18%] sm:top-1/2 sm:-translate-y-1/2",
            "right-4 sm:right-[72px]",
          ].join(" ")}
        >
          {/* Static diagonal arrow — no animation */}
          <span className="block text-[22px] text-white/90 leading-none select-none">
            ↘
          </span>

          <p className="mt-3 sm:mt-[18px] leading-[1.25]">
            <ShuffleText
              text="Software Developer"
              topClass="text-white/95"
              botClass="text-white"
              wrapClass="text-[clamp(16px,2.4vw,34px)] font-medium tracking-[-0.01em] block"
            />
          </p>
        </div>

        {/* ── Infinite marquee ── */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-[5] pb-[10px] leading-none">
          <div
            ref={trackRef}
            className="flex items-baseline will-change-transform whitespace-nowrap"
          >
            {Array.from({ length: COPIES }).map((_, i) => (
              <span
                key={i}
                className={[
                  "text-white font-bold flex-shrink-0",
                  "text-[clamp(56px,12vw,180px)]",
                  "tracking-[-0.03em] leading-[0.88]",
                  "pr-[clamp(24px,4vw,80px)]",
                  "[text-shadow:0_2px_40px_rgba(0,0,0,0.12)]",
                ].join(" ")}
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                {MARQUEE_TEXT}
                {i < COPIES - 1 && (
                  <span
                    className={[
                      "text-white/45 font-normal",
                      "text-[clamp(12px,2vw,28px)]",
                      "pr-[clamp(24px,4vw,80px)]",
                      "leading-[0.88] align-middle",
                    ].join(" ")}
                  >
                    {" · "}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
