"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  accent:      "#5252f5",
  accentLight: "#8080ff",
  accentGlow:  "rgba(82,82,245,0.18)",
  white:       "#ffffff",
  offWhite:    "rgba(255,255,255,0.72)",
  muted:       "rgba(255,255,255,0.32)",
  faint:       "rgba(255,255,255,0.08)",
  bg:          "#000000",
  surface:     "#0a0a0a",
  border:      "rgba(255,255,255,0.09)",
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────
const EDUCATION = [
  { degree: "BTech from IIT Roorkee",                               year: "2023–27", highlight: true  },
  { degree: "12th Boards from MPS School, Kota",                    year: "2023",    highlight: false },
  { degree: "10th Boards from Amity International School, Gurugram",year: "2021",    highlight: false },
];

const YOUTUBE_ID    = "7y91isg0Bso";
const YOUTUBE_START = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** GSAP char-split entrance */
function useSplitEntrance(ref: React.RefObject<HTMLElement | null>, inView: boolean, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const text  = el.getAttribute("data-text") ?? (el.textContent ?? "");
    const chars = text.split("").map((ch) => {
      const o = document.createElement("span");
      o.style.cssText = "display:inline-block;overflow:hidden;line-height:1.1;";
      const i = document.createElement("span");
      i.textContent  = ch === " " ? "\u00A0" : ch;
      i.style.display = "inline-block";
      o.appendChild(i);
      return i;
    });
    // re-inject
    el.innerHTML = "";
    el.setAttribute("aria-label", text);
    chars.forEach(c => el.appendChild(c.parentElement!));
    gsap.fromTo(
      chars,
      { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.022, delay },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
}

// ─── SectionLabel (eyebrow) ───────────────────────────────────────────────────
function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 mb-5"
    >
      <span
        className="inline-block w-[18px] h-px"
        style={{ background: C.accent }}
      />
      <span
        className="uppercase tracking-[0.18em]"
        style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.6rem", color: C.accent, letterSpacing: "0.22em" }}
      >
        {children}
      </span>
    </motion.div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref      = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  useSplitEntrance(ref, isInView, delay);

  return (
    <h2
      ref={ref}
      data-text={text}
      className="m-0 font-bold leading-[1.04] tracking-[-0.03em] text-white cursor-default select-none"
      style={{ fontFamily: "'Barlow',sans-serif", fontSize: "clamp(26px,4.2vw,58px)" }}
    >
      {text}
    </h2>
  );
}

// ─── Divider line (violet glow) ───────────────────────────────────────────────
function GlowLine() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView || !ref.current) return;
    gsap.fromTo(ref.current, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut", transformOrigin: "left" });
  }, [isInView]);
  return (
    <div ref={ref} className="mt-4 mb-8 sm:mb-10 h-px w-full origin-left"
      style={{ background: `linear-gradient(90deg, ${C.accent} 0%, rgba(82,82,245,0.06) 100%)`, transform: "scaleX(0)" }} />
  );
}

// ─── Education row ────────────────────────────────────────────────────────────
function EduRow({ degree, year, highlight, index }: { degree: string; year: string; highlight: boolean; index: number }) {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -32 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      className="relative group py-5 sm:py-6 cursor-default"
    >
      {/* hover bg fill */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 rounded-[3px] pointer-events-none"
        style={{ background: C.faint, transformOrigin: "bottom" }}
      />

      <div className="relative flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          {/* violet dot for highlight row */}
          <span
            className="shrink-0 rounded-full transition-all duration-300"
            style={{
              width: 6, height: 6,
              background: highlight ? C.accent : C.muted,
              boxShadow: highlight ? `0 0 8px ${C.accent}` : "none",
            }}
          />
          <span
            className="transition-colors duration-300"
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontSize: "clamp(13px,1.5vw,18px)",
              fontWeight: highlight ? 500 : 400,
              color: highlight ? C.white : C.offWhite,
              letterSpacing: "0.01em",
            }}
          >
            {degree}
          </span>
        </div>
        <span
          className="shrink-0 font-mono transition-colors duration-300 group-hover:text-[#5252f5]"
          style={{ fontSize: "clamp(9px,0.85vw,12px)", color: C.muted, letterSpacing: "0.14em" }}
        >
          {year}
        </span>
      </div>

      {/* bottom border wipe */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 + 0.2 }}
        className="absolute bottom-0 left-2 right-2 h-px origin-left"
        style={{ background: C.border }}
      />
    </motion.div>
  );
}

// ─── Photo card ───────────────────────────────────────────────────────────────
function PhotoCard() {
  const ref        = useRef<HTMLDivElement>(null);
  const isInView   = useInView(ref, { once: true, margin: "-40px" });
  const { scrollY }= useScroll();
  // subtle parallax on scroll
  const y = useTransform(scrollY, [0, 1200], [0, -30]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.34, 1.24, 0.64, 1] }}
      className="relative rounded-[6px] overflow-hidden"
      style={{
        width: "clamp(180px,34vw,320px)",
        aspectRatio: "3/4",
        border: `1.5px solid ${C.accent}`,
        boxShadow: `0 0 32px ${C.accentGlow}, 0 24px 80px rgba(0,0,0,0.7)`,
      }}
    >
      <motion.img
        src="/with-college.jpg"
        alt="Sanat Jha at IIT Roorkee"
        className="w-full h-full object-cover object-top"
        style={{ y }}
      />
      {/* violet bottom vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(10,5,30,0.75) 100%)" }} />
      {/* badge */}
      <div
        className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-[4px] px-3 py-2"
        style={{ background: "rgba(0,0,0,0.72)", border: `1px solid ${C.accent}44`, backdropFilter: "blur(8px)" }}
      >
        <span className="w-[6px] h-[6px] rounded-full shrink-0"
          style={{ background: C.accent, boxShadow: `0 0 6px ${C.accent}` }} />
        <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.offWhite }}>
          IIT Roorkee · 2023
        </span>
      </div>
    </motion.div>
  );
}

// ─── YouTube card ─────────────────────────────────────────────────────────────
function YoutubeCard() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      className="relative w-full rounded-[8px] overflow-hidden"
      style={{
        aspectRatio: "16/9",
        border: `1px solid ${C.accent}33`,
        boxShadow: `0 0 40px ${C.accentGlow}, 0 16px 64px rgba(0,0,0,0.75)`,
      }}
    >
      {/* violet corner glow */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: `radial-gradient(ellipse 60% 40% at 0% 100%, ${C.accentGlow} 0%, transparent 60%)` }} />
      <iframe
        src={`https://www.youtube.com/embed/${YOUTUBE_ID}?start=${YOUTUBE_START}&rel=0&modestbranding=1`}
        title="Sanat's JEE Journey"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        style={{ border: "none" }}
      />
    </motion.div>
  );
}

// ─── Journey body text ────────────────────────────────────────────────────────
function JourneyText() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const WORDS    = "Cracking JEE Advanced and securing admission to IIT Roorkee wasn't just an achievement—it was the culmination of two years of relentless dedication, countless sleepless nights, and unwavering determination. From solving complex problems at 2 AM to facing one of the world's most challenging exams, this journey transformed not just my academic path, but my entire perspective on perseverance and dreams.".split(" ");

  return (
    <div ref={ref}>
      <p className="m-0 leading-[1.9]" style={{ fontFamily: "'Barlow',sans-serif", fontSize: "clamp(13px,1.25vw,17px)", fontWeight: 300, color: C.offWhite }}>
        {WORDS.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.38, delay: i * 0.011, ease: "easeOut" }}
            className="inline-block mr-[0.28em]"
          >
            {w}
          </motion.span>
        ))}
      </p>
    </div>
  );
}

// ─── Stat badge ───────────────────────────────────────────────────────────────
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.34, 1.36, 0.64, 1] }}
      whileHover={{ y: -2 }}
      className="flex flex-col items-center gap-1 px-5 py-4 rounded-[6px]"
      style={{ background: C.faint, border: C.border, borderWidth: 1, borderStyle: "solid" }}
    >
      <span className="font-bold tabular-nums leading-none" style={{ fontFamily: "'Barlow',sans-serif", fontSize: "clamp(18px,2.2vw,28px)", color: C.accent }}>
        {value}
      </span>
      <span className="uppercase tracking-[0.14em] text-center" style={{ fontFamily: "'Barlow',sans-serif", fontSize: "0.54rem", color: C.muted }}>
        {label}
      </span>
    </motion.div>
  );
}

// ─── Background grid ──────────────────────────────────────────────────────────
function GridBg() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.025] z-0" aria-hidden="true">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax BG tint on scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.8 },
    });
    tl.fromTo(section, { backgroundPositionY: "0%" }, { backgroundPositionY: "25%" });
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden bg-black"
        style={{
          padding: "clamp(64px,8vw,128px) clamp(20px,6vw,80px)",
          fontFamily: "'Barlow',sans-serif",
        }}
      >
        {/* BG grid */}
        <GridBg />

        {/* Violet ambient glows */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-[10%] left-[10%] w-[50%] h-[50%] blur-[140px]"
            style={{ background: "radial-gradient(ellipse, rgba(82,82,245,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-[5%] w-[40%] h-[40%] blur-[120px]"
            style={{ background: "radial-gradient(ellipse, rgba(82,82,245,0.08) 0%, transparent 70%)" }} />
        </div>

        {/* Floating violet dots */}
        {[
          { s:4,  x:"6%",  y:"18%", d:2.8 },
          { s:3,  x:"52%", y:"8%",  d:3.5 },
          { s:5,  x:"94%", y:"32%", d:4.1 },
          { s:3,  x:"78%", y:"72%", d:2.4 },
          { s:4,  x:"22%", y:"88%", d:3.2 },
        ].map((dot, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full pointer-events-none z-0"
            style={{ width: dot.s, height: dot.s, left: dot.x, top: dot.y, background: C.accent, boxShadow: `0 0 8px ${C.accent}` }}
            animate={{ opacity: [0.5, 0.12, 0.5], scale: [1, 1.3, 1] }}
            transition={{ duration: dot.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* ── Grid layout ── */}
        <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 max-w-[1380px] mx-auto">

          {/* ════ LEFT — Education ════ */}
          <div className="flex flex-col">
            <EyebrowLabel>Academic background</EyebrowLabel>
            <SectionHeading text="Education Qualification" />
            <GlowLine />

            {/* rows */}
            <div className="mb-10">
              {EDUCATION.map((item, i) => <EduRow key={i} {...item} index={i} />)}
            </div>

            {/* stats row */}
            <div className="flex gap-3 mb-10">
              <StatBadge value="AIR 5042" label="JEE Advanced" />
              <StatBadge value="IIT-R"    label="Campus"        />
              <StatBadge value="4 Yrs"    label="Program"       />
            </div>

            {/* photo */}
            <div className="flex justify-start">
              <PhotoCard />
            </div>
          </div>

          {/* ════ RIGHT — Journey ════ */}
          <div className="flex flex-col">
            <EyebrowLabel>Personal story</EyebrowLabel>
            <div className="flex items-start gap-3">
              <SectionHeading text="The Journey to Dreams" delay={0.05} />
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring", bounce: 0.5 }}
                className="text-[1.6rem] mt-1 shrink-0"
                role="img" aria-label="target"
              >
                🎯
              </motion.span>
            </div>
            <GlowLine />

            {/* body */}
            <div className="mb-8">
              <JourneyText />
            </div>

            {/* YouTube */}
            <YoutubeCard />

            {/* caption */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-5 text-center italic"
              style={{ fontFamily: "'Barlow',sans-serif", fontSize: "clamp(10px,0.9vw,13px)", color: C.muted, letterSpacing: "0.04em" }}
            >
              Watch my complete journey from preparation struggles to IIT success{" "}
              <span role="img" aria-label="point">👆</span>
            </motion.p>

            {/* horizontal rule with violet glow */}
            <div className="mt-10 h-px w-full"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${C.accent} 50%, transparent 100%)`, opacity: 0.25 }} />
          </div>

        </div>
      </section>
    </>
  );
}