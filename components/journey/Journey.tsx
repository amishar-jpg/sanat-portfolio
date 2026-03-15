"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
const EDUCATION = [
  {
    degree: "BTech — Indian Institute of Technology Roorkee",
    field: "Production & Industrial Engineering",
    year: "2023–27",
    rank: "AIR 5042",
    highlight: true,
  },
  {
    degree: "12th Boards — MPS School, Kota",
    field: "PCM · JEE Advanced Preparation",
    year: "2023",
    rank: null,
    highlight: false,
  },
  {
    degree: "10th Boards — Amity International School, Gurugram",
    field: "Secondary Education",
    year: "2021",
    rank: null,
    highlight: false,
  },
];

const STATS = [
  { value: "AIR 5042", label: "JEE Advanced" },
  { value: "IIT-R", label: "Campus" },
  { value: "4 Yrs", label: "Program" },
  { value: "PNI", label: "Branch" },
];

// ─── Strip Reveal ─────────────────────────────────────────────────────────────
const STRIP_COUNT = 10;

function StripReveal({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLDivElement>;
}) {
  const stripsRef = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strips = stripsRef.current.filter(Boolean) as HTMLDivElement[];
    const wrapper = wrapperRef.current;
    if (!strips.length || !sectionRef.current || !wrapper) return;

    gsap.set(strips, { yPercent: 0, borderColor: "#fff" });
    gsap.set(wrapper, { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });

    tl.to(strips, {
      yPercent: -101,
      duration: 0.72,
      ease: "power3.inOut",
      stagger: 0.07,
    }).to(wrapper, {
      opacity: 0,
      duration: 0.2,
      ease: "none",
      onComplete: () => {
        if (wrapper) wrapper.style.display = "none";
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [sectionRef]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 z-[10] pointer-events-none flex"
      aria-hidden="true"
    >
      {Array.from({ length: STRIP_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            stripsRef.current[i] = el;
          }}
          className="h-full bg-[#000] flex-1"
          style={{
            borderRight: i < STRIP_COUNT - 1 ? "1.5px solid #fff" : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const text = "Education";
    el.innerHTML = "";
    el.setAttribute("aria-label", text);
    const chars = text.split("").map((ch) => {
      const outer = document.createElement("span");
      outer.style.cssText =
        "display:inline-block;overflow:hidden;line-height:1.05;";
      const inner = document.createElement("span");
      inner.textContent = ch === " " ? "\u00A0" : ch;
      inner.style.display = "inline-block";
      outer.appendChild(inner);
      el.appendChild(outer);
      return inner;
    });

    gsap.fromTo(
      chars,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.028,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );

    const scatter = () =>
      gsap.to(chars, {
        yPercent: () => gsap.utils.random(-40, 40),
        opacity: 0.12,
        duration: 0.26,
        ease: "power2.out",
        stagger: { each: 0.01, from: "random" },
      });
    const reassemble = () =>
      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.55,
        ease: "elastic.out(1,0.55)",
        stagger: { each: 0.01, from: "random" },
      });
    el.addEventListener("mouseenter", scatter);
    el.addEventListener("mouseleave", reassemble);
    return () => {
      el.removeEventListener("mouseenter", scatter);
      el.removeEventListener("mouseleave", reassemble);
    };
  }, []);

  return (
    <h2
      ref={ref}
      className="m-0 cursor-default select-none font-extrabold leading-none tracking-[-0.04em] text-white"
      style={{ fontSize: "clamp(38px, 5.5vw, 80px)" }}
    />
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.07,
      }}
      className="flex flex-col gap-[6px] px-5 py-4 rounded-xl border border-white/[0.08] bg-white/[0.06]"
    >
      <span
        className="font-extrabold leading-none tracking-[-0.03em] text-white"
        style={{ fontSize: "clamp(16px,2vw,26px)" }}
      >
        {value}
      </span>
      <span className="text-[9px] tracking-[0.14em] uppercase text-white/40">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Edu Row ──────────────────────────────────────────────────────────────────
function EduRow({
  degree,
  field,
  year,
  rank,
  highlight,
  index,
}: {
  degree: string;
  field: string;
  year: string;
  rank: string | null;
  highlight: boolean;
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-40px" });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isInView || !rowRef.current) return;
    gsap.fromTo(
      rowRef.current,
      { x: -28, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        delay: index * 0.055,
      },
    );
  }, [isInView, index]);

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="relative cursor-default border-b border-white/10"
      style={{ opacity: 0 }}
    >
      <motion.div
        animate={{ scaleY: active ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 bg-white pointer-events-none z-0"
        style={{ transformOrigin: "bottom" }}
      />
      <div
        className="relative z-[1] flex items-start sm:items-center gap-3 sm:gap-5 py-5 sm:py-6 pr-0 transition-colors duration-300"
        style={{ color: active ? "#111" : "#fff" }}
      >
        <span className="text-[11px] opacity-30 tracking-[0.1em] min-w-[22px] sm:min-w-[28px] shrink-0 tabular-nums mt-[2px]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <div
            className="font-bold leading-tight tracking-[-0.02em] mb-[3px] transition-colors duration-300"
            style={{ fontSize: "clamp(14px, 2.2vw, 22px)" }}
          >
            {degree}
          </div>
          <div
            className="transition-colors duration-300"
            style={{
              fontSize: "clamp(10px, 1vw, 13px)",
              color: active ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.38)",
              letterSpacing: "0.04em",
            }}
          >
            {field}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-[5px]">
          {rank && (
            <span
              className="text-[9px] tracking-[0.12em] uppercase px-[8px] py-[2px] rounded-full font-semibold transition-all duration-300"
              style={{
                background: active
                  ? "rgba(0,0,0,0.15)"
                  : "rgba(255,255,255,0.06)",
                color: active ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.55)",
                border: `1px solid ${active ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {rank}
            </span>
          )}
          <span
            className="text-[10px] tracking-[0.12em] tabular-nums transition-colors duration-300"
            style={{
              color: active ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.3)",
            }}
          >
            {year}
          </span>
        </div>
        <motion.span
          animate={{ x: active ? 5 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-base shrink-0"
          style={{ opacity: active ? 1 : 0.25 }}
        >
          →
        </motion.span>
      </div>
    </div>
  );
}

// ─── Photo Panel ──────────────────────────────────────────────────────────────
function PhotoPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div className="sticky top-[100px] py-8 pl-8 sm:pl-[52px] border-l border-white/10">
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.34, 1.24, 0.64, 1] }}
          className="flex flex-col gap-6"
        >
          <div
            className="relative rounded-[10px] overflow-hidden border border-white/10"
            style={{
              aspectRatio: "3/4",
              width: "100%",
              maxWidth: 260,
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src="/with-college.jpg"
              alt="Sanat Jha at IIT Roorkee"
              className="w-full h-full object-cover object-top"
            />
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              }}
            >
              <p className="m-0 text-white text-[11px] tracking-[0.12em] uppercase font-medium">
                IIT Roorkee · 2023
              </p>
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.14em] uppercase text-white/40 mb-[6px]">
              Current Institute
            </div>
            <div
              className="font-extrabold tracking-[-0.035em] text-white leading-none"
              style={{ fontSize: "clamp(18px, 2.4vw, 28px)" }}
            >
              IIT Roorkee
            </div>
          </div>
          <div className="p-3 sm:p-[12px_16px] bg-white/[0.06] border border-white/[0.08] rounded-xl">
            <div className="text-[9px] tracking-[0.12em] uppercase text-white/40 mb-[5px]">
              Program
            </div>
            <div className="text-sm font-bold text-white">
              B.Tech in Production & Industrial Engineering
            </div>
          </div>
          <div>
            <div className="text-[9px] tracking-[0.12em] uppercase text-white/40 mb-[8px]">
              Years Completed
            </div>
            <div className="flex gap-[5px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="w-[6px] h-[6px] rounded-full"
                  style={{
                    background: i < 1 ? "#fff" : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── StringCurve — thick, dramatic, mouse-interactive bezier string ────────────
function StringCurve() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ghostRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGCircleElement>(null); // midpoint follower dot

  // Physics state — all normalised 0-1
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const ctrl = useRef({ x: 0.5, y: 0.5 }); // bezier control point
  const ctrlV = useRef({ x: 0, y: 0 }); // velocity
  const raf = useRef<number>(0);
  const inside = useRef(false);

  // ── Tuned for dramatic, string-like behaviour ──
  const STIFFNESS = 0.018; // lower = more lag, more stretch
  const DAMPING = 0.68; // lower = more oscillation / wobble
  const PULL_X = 1.0; // full horizontal tracking
  const PULL_Y = 1.1; // overshoot Y slightly for dramatic arc
  const REST_Y = 0.5; // resting vertical position (centre of container)

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const ghost = ghostRef.current;
    const dot = dotRef.current;
    if (!wrap || !svg || !path || !ghost) return;

    const buildD = (cx: number, cy: number) => {
      const W = svg.clientWidth || wrap.clientWidth || 1;
      const H = svg.clientHeight || wrap.clientHeight || 1;
      const y0 = H * REST_Y;
      return `M 0,${y0} Q ${cx * W},${cy * H} ${W},${y0}`;
    };

    // Update the midpoint follower dot position (midpoint of quadratic bezier at t=0.5)
    const updateDot = (cx: number, cy: number) => {
      if (!dot || !svg) return;
      const W = svg.clientWidth || wrap.clientWidth || 1;
      const H = svg.clientHeight || wrap.clientHeight || 1;
      const y0 = H * REST_Y;
      // Quadratic bezier midpoint formula: B(0.5) = 0.25*P0 + 0.5*CP + 0.25*P1
      const mx = 0.25 * 0 + 0.5 * (cx * W) + 0.25 * W;
      const my = 0.25 * y0 + 0.5 * (cy * H) + 0.25 * y0;
      dot.setAttribute("cx", String(mx));
      dot.setAttribute("cy", String(my));
    };

    const tick = () => {
      raf.current = requestAnimationFrame(tick);

      const tx = inside.current
        ? mouse.current.x * PULL_X + (1 - PULL_X) * 0.5
        : 0.5;
      const ty = inside.current
        ? mouse.current.y * PULL_Y + (1 - PULL_Y) * REST_Y
        : REST_Y;

      const fx = (tx - ctrl.current.x) * STIFFNESS;
      const fy = (ty - ctrl.current.y) * STIFFNESS;

      ctrlV.current.x = (ctrlV.current.x + fx) * DAMPING;
      ctrlV.current.y = (ctrlV.current.y + fy) * DAMPING;
      ctrl.current.x += ctrlV.current.x;
      ctrl.current.y += ctrlV.current.y;

      const d = buildD(ctrl.current.x, ctrl.current.y);
      path.setAttribute("d", d);
      ghost.setAttribute("d", d);
      updateDot(ctrl.current.x, ctrl.current.y);
    };

    raf.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.current.x = Math.max(
        0,
        Math.min(1, (e.clientX - r.left) / r.width),
      );
      mouse.current.y = Math.max(
        0,
        Math.min(1, (e.clientY - r.top) / r.height),
      );
    };
    const onEnter = () => {
      inside.current = true;
    };
    const onLeave = () => {
      inside.current = false;
      // snap-back impulse — more dramatic
      ctrlV.current.y += (REST_Y - ctrl.current.y) * 0.14;
      ctrlV.current.x += (0.5 - ctrl.current.x) * 0.06;
    };

    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const r = wrap.getBoundingClientRect();
      mouse.current.x = Math.max(
        0,
        Math.min(1, (e.touches[0].clientX - r.left) / r.width),
      );
      mouse.current.y = Math.max(
        0,
        Math.min(1, (e.touches[0].clientY - r.top) / r.height),
      );
      inside.current = true;
    };
    const onTouchEnd = () => {
      inside.current = false;
      ctrlV.current.y += (REST_Y - ctrl.current.y) * 0.14;
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    wrap.addEventListener("touchmove", onTouch, { passive: true });
    wrap.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(raf.current);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      wrap.removeEventListener("touchmove", onTouch);
      wrap.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none"
      style={{ height: 160, cursor: "crosshair" }}
    >
      {/* hint */}
      <span
        className="absolute left-1/2 -translate-x-1/2 top-3 pointer-events-none select-none uppercase tracking-[0.28em] text-white/18"
        style={{
          fontFamily: "'Helvetica Neue', sans-serif",
          fontSize: "0.46rem",
          letterSpacing: "0.28em",
          color: "rgba(255,255,255,0.18)",
        }}
      >
        pull the string
      </span>

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
        preserveAspectRatio="none"
      >
        <defs>
          {/* multi-layer glow: inner sharp + outer bloom */}
          <filter id="sg-glow" x="-30%" y="-300%" width="160%" height="700%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="2"
              result="blur1"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="8"
              result="blur2"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="18"
              result="blur3"
            />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="sg-dot-glow"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Layer 1: wide diffuse bloom ── */}
        <path
          ref={ghostRef}
          d="M 0,80 Q 50%,80 100%,80"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="28"
          strokeLinecap="round"
          filter="url(#sg-glow)"
          style={{ pointerEvents: "none" }}
        />

        {/* ── Layer 2: mid glow ── */}
        <path
          d="M 0,80 Q 50%,80 100%,80"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#sg-glow)"
          style={{ pointerEvents: "none" }}
          ref={(el) => {
            // mirror ghost path updates through React ref sharing trick
            if (el && ghostRef.current) {
              const origSet = ghostRef.current.setAttribute.bind(
                ghostRef.current,
              );
              (ghostRef.current as any).__mid = el;
              ghostRef.current.setAttribute = function (
                name: string,
                val: string,
              ) {
                origSet(name, val);
                if (name === "d") el.setAttribute("d", val);
              };
            }
          }}
        />

        {/* ── Layer 3: core string — thick & sharp ── */}
        <path
          ref={pathRef}
          d="M 0,80 Q 50%,80 100%,80"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#sg-glow)"
          style={{ pointerEvents: "none" }}
        />

        {/* ── Midpoint follower dot ── */}
        <circle
          ref={dotRef}
          cx="50%"
          cy="80"
          r="4"
          fill="white"
          opacity="0.7"
          filter="url(#sg-dot-glow)"
          style={{ pointerEvents: "none" }}
        />

        {/* ── Endpoint anchor dots ── */}
        <circle
          cx="0"
          cy="80"
          r="3.5"
          fill="rgba(255,255,255,0.5)"
          style={{ pointerEvents: "none" }}
        />
        <circle
          cx="100%"
          cy="80"
          r="3.5"
          fill="rgba(255,255,255,0.5)"
          style={{ pointerEvents: "none" }}
        />
      </svg>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Journey() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#000] text-white overflow-hidden box-border"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <StripReveal sectionRef={sectionRef} />

      <div className="relative z-[2] max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
        {/* HEADER */}
        <div className="mb-10 sm:mb-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-[7px] mb-[18px] px-3 py-[3px] rounded-full border border-white/15 text-[9px] tracking-[0.16em] uppercase text-white/50"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-white" />
            Background
          </motion.div>

          <div className="flex items-end justify-between flex-wrap gap-5">
            <SectionTitle />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[11px] text-white/40 tracking-[0.1em] uppercase m-0 max-w-[200px] text-right leading-[1.7]"
            >
              Academic
              <br />
              Qualifications
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="h-px mt-7 bg-white/[0.12]"
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 sm:mb-[52px]">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>

        {/* TWO COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_300px] gap-0 items-start">
          <div>
            {EDUCATION.map((item, i) => (
              <EduRow key={i} {...item} index={i} />
            ))}
          </div>
          <div className="hidden md:block">
            <PhotoPanel />
          </div>
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 sm:mt-[52px] flex justify-between border-t border-white/[0.08] pt-[22px] flex-wrap gap-3"
        >
          <p className="text-[10px] text-white/30 tracking-[0.12em] uppercase m-0">
            {EDUCATION.length} Institutions
          </p>
          <p className="text-[10px] text-white/30 tracking-[0.12em] uppercase m-0">
            [ N.003 ]
          </p>
        </motion.div>
      </div>

      {/* ── Bezier string ── */}
      <StringCurve />
    </section>
  );
}
