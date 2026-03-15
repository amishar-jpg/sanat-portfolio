"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import HeroOrb from "./HeroOrb";
import HeroParallaxLayers from "./HeroParallaxLayers";
import HeroText from "./HeroText";

type CoreMode = "idle" | "scan" | "alert";

// ─── Spring configs ────────────────────────────────────────────────────────────
const SPRING_OUTER = { stiffness: 400, damping: 35, mass: 1 };
const SPRING_LAYER = { stiffness: 80, damping: 18, mass: 1 };
const SPRING_TEXT = { stiffness: 140, damping: 22, mass: 1 };
const SPRING_ORB = { stiffness: 60, damping: 15, mass: 1 };

// ─── Trail particle type ───────────────────────────────────────────────────────
interface TrailParticle {
  id: number;
  x: number;
  y: number;
  born: number;
}

// ─── Cursor Trail Canvas ───────────────────────────────────────────────────────
function CursorTrail({ particles }: { particles: TrailParticle[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();
      particles.forEach((p, i) => {
        const age = now - p.born;
        const life = 500; // ms
        const t = Math.max(0, 1 - age / life);
        const opacity = t * 0.45 * (1 - i / particles.length);
        const radius = Math.max(1, 4 * t);

        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          radius * 3,
        );
        grad.addColorStop(0, `rgba(152,255,152,${opacity})`);
        grad.addColorStop(1, `rgba(152,255,152,0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-9998 mix-blend-screen"
    />
  );
}

// ─── Custom Cursor ─────────────────────────────────────────────────────────────
function CustomCursor({
  rawX,
  rawY,
  isHovering,
  isIdle,
}: {
  rawX: number;
  rawY: number;
  isHovering: boolean;
  isIdle: boolean;
}) {
  const cx = useMotionValue(rawX);
  const cy = useMotionValue(rawY);
  const sx = useSpring(cx, SPRING_OUTER);
  const sy = useSpring(cy, SPRING_OUTER);
  const dx = useMotionValue(rawX);
  const dy = useMotionValue(rawY);

  useEffect(() => {
    cx.set(rawX);
    dx.set(rawX);
  }, [rawX, cx, dx]);
  useEffect(() => {
    cy.set(rawY);
    dy.set(rawY);
  }, [rawY, cy, dy]);

  const ringSize = isHovering ? 48 : 32;
  const ringAlpha = isIdle ? 0.4 : 1;

  return (
    <>
      {/* Outer glass ring */}
      <motion.div
        className="pointer-events-none fixed z-9999 rounded-full"
        style={{
          x: useTransform(sx, (v) => v - ringSize / 2),
          y: useTransform(sy, (v) => v - ringSize / 2),
          width: ringSize,
          height: ringSize,
          opacity: ringAlpha,
          border: "1px solid rgba(152,255,152,0.45)",
          background:
            "radial-gradient(circle at 30% 30%, rgba(152,255,152,0.12), rgba(152,255,152,0.03) 70%)",
          boxShadow: isHovering
            ? "0 0 20px rgba(152,255,152,0.25), inset 0 1px 0 rgba(255,255,255,0.10)"
            : "inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(1px)",
          transition: "width 200ms ease, height 200ms ease, opacity 200ms ease",
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed z-9999 rounded-full"
        style={{
          x: useTransform(dx, (v) => v - 3),
          y: useTransform(dy, (v) => v - 3),
          width: 6,
          height: 6,
          background: "#98FF98",
          boxShadow: "0 0 8px rgba(152,255,152,0.90)",
          opacity: isHovering ? 0 : ringAlpha,
          transition: "opacity 150ms ease",
        }}
      />
    </>
  );
}

// ─── Click Ripple ──────────────────────────────────────────────────────────────
interface Ripple {
  id: number;
  x: number;
  y: number;
}

function ClickRipples({ ripples }: { ripples: Ripple[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-9997">
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: r.x - 4,
            top: r.y - 4,
            width: 8,
            height: 8,
            border: "1px solid rgba(152,255,152,0.80)",
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 7, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── Scroll Indicator ──────────────────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.0, duration: 0.6 }}
    >
      <span className="text-[10px] tracking-[0.22em] uppercase text-[#555555]">
        scroll
      </span>

      {/* Skeuomorphic convex scroll pill */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        style={{
          width: 28,
          height: 44,
          borderRadius: 14,
          background: "linear-gradient(180deg, #1c1c1c 0%, #111 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottomColor: "rgba(0,0,0,0.80)",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.09)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 8,
        }}
      >
        <motion.div
          animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{
            width: 4,
            height: 8,
            borderRadius: 2,
            background: "#98FF98",
            boxShadow: "0 0 6px rgba(152,255,152,0.80)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Ambient Scan Line ─────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 h-px z-20"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(152,255,152,0.08) 30%, rgba(152,255,152,0.18) 50%, rgba(152,255,152,0.08) 70%, transparent 100%)",
        boxShadow: "0 0 12px rgba(152,255,152,0.10)",
      }}
      animate={{ top: ["-2%", "102%"] }}
      transition={{
        repeat: Infinity,
        duration: 7,
        ease: "linear",
        repeatDelay: 4,
      }}
    />
  );
}

// ─── Hero Component ─────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const orbWrapRef = useRef<HTMLDivElement>(null);
  const glowARef = useRef<HTMLDivElement>(null);
  const glowBRef = useRef<HTMLDivElement>(null);
  const gridShimmerRef = useRef<HTMLDivElement>(null);

  // ── Raw pixel mouse pos (for cursor + ripple) ──
  const [rawMouse, setRawMouse] = useState({ x: -200, y: -200 });

  // ── Normalised mouse pos -1..1 (for parallax layers, springs) ──
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const [norm, setNorm] = useState({ x: 0, y: 0 });

  const springNormX = useSpring(normX, SPRING_LAYER);
  const springNormY = useSpring(normY, SPRING_LAYER);
  const springTextX = useSpring(normX, SPRING_TEXT);
  const springTextY = useSpring(normY, SPRING_TEXT);
  const springOrbX = useSpring(normX, SPRING_ORB);
  const springOrbY = useSpring(normY, SPRING_ORB);

  // ── Cursor state ──
  const [isHovering, setIsHovering] = useState(false);
  const [isOrbHovering, setIsOrbHovering] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Trail ──
  const [trail, setTrail] = useState<TrailParticle[]>([]);
  const trailCounter = useRef(0);
  const lastTrailTime = useRef(0);

  // ── Click ripples ──
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleCounter = useRef(0);

  // ── Cursor hidden on touch ──
  const [isTouchDevice] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
  );
  const [scrollProgress, setScrollProgress] = useState(() =>
    typeof window !== "undefined"
      ? Math.min(1, window.scrollY / Math.max(window.innerHeight * 0.9, 1))
      : 0,
  );

  // ── Mouse move handler ──
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setRawMouse({ x, y });
      setIsIdle(false);

      // Idle timer reset
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), 2000);

      // Trail particle
      const now = performance.now();
      if (now - lastTrailTime.current > 16) {
        lastTrailTime.current = now;
        const id = ++trailCounter.current;
        setTrail((prev) => {
          const next = [...prev, { id, x, y, born: now }];
          // Prune dead particles
          return next.filter((p) => now - p.born < 500).slice(-30);
        });
      }

      // Normalise to section
      const section = document.getElementById("hero-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const nx = ((x - rect.left) / rect.width) * 2 - 1;
      const ny = ((y - rect.top) / rect.height) * 2 - 1;
      normX.set(nx);
      normY.set(ny);
      setNorm({ x: nx, y: ny });
    },
    [normX, normY],
  );

  // ── Click ripple ──
  const onMouseDown = useCallback((e: MouseEvent) => {
    const id = ++rippleCounter.current;
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== id)),
      600,
    );
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [onMouseMove, onMouseDown]);

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(
        1,
        window.scrollY / Math.max(window.innerHeight * 0.9, 1),
      );
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .fromTo(
          ".hero-bg-fade",
          { opacity: 0 },
          { opacity: 1, duration: 1.1 },
        )
        .fromTo(
          ".hero-reveal",
          { y: 28, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.14,
          },
          "<0.08",
        )
        .fromTo(
          ".hero-edge-fx",
          { scaleX: 0.65, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8 },
          "<0.12",
        );

      if (textWrapRef.current) {
        gsap.to(textWrapRef.current, {
          y: -6,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (orbWrapRef.current) {
        gsap.to(orbWrapRef.current, {
          y: 10,
          rotateZ: 0.75,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (glowARef.current) {
        gsap.to(glowARef.current, {
          scale: 1.18,
          opacity: 0.5,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (glowBRef.current) {
        gsap.to(glowBRef.current, {
          scale: 0.86,
          opacity: 0.34,
          duration: 4.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (gridShimmerRef.current) {
        gsap.fromTo(
          gridShimmerRef.current,
          { xPercent: -14, opacity: 0.22 },
          {
            xPercent: 14,
            opacity: 0.42,
            duration: 8.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );
      }
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  // ── Hover detection ──
  useEffect(() => {
    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);
    const interactives = document.querySelectorAll(
      "a, button, [data-magnetic]",
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => {
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // ── Derived motion values for text column (layer 4) ──
  const textX = useTransform(springTextX, (v) => v * 35);
  const textY = useTransform(springTextY, (v) => v * 22);

  // ── Derived motion values for orb (layer 5) ──
  const orbX = useTransform(springOrbX, (v) => v * 50);
  const orbY = useTransform(springOrbY, (v) => v * 32);
  const coreMode: CoreMode = isOrbHovering
    ? "alert"
    : scrollProgress > 0.16
      ? "scan"
      : "idle";

  return (
    <>
      {/* ── Global cursor & effects (outside section so they cover full viewport) ── */}
      {!isTouchDevice && (
        <>
          <CursorTrail particles={trail} />
          <ClickRipples ripples={ripples} />
          <CustomCursor
            rawX={rawMouse.x}
            rawY={rawMouse.y}
            isHovering={isHovering}
            isIdle={isIdle}
          />
        </>
      )}

      <section
        id="hero-section"
        ref={sectionRef}
        className="interactive-cursor relative min-h-screen overflow-hidden bg-[#000000] px-6 pb-16 pt-28 md:px-12"
      >
        {/* ── Scan line ambient effect ── */}
        <ScanLine />

        {/* ── Layered cinematic glow beds ── */}
        <div className="hero-bg-fade pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_70%_32%,rgba(152,255,152,0.09),transparent_48%),radial-gradient(ellipse_at_20%_75%,rgba(152,255,152,0.05),transparent_55%)]" />
        <div
          ref={glowARef}
          className="hero-bg-fade pointer-events-none absolute left-[8%] top-[18%] z-0 h-80 w-80 rounded-full bg-[#98FF98]/7 blur-3xl"
        />
        <div
          ref={glowBRef}
          className="hero-bg-fade pointer-events-none absolute bottom-[8%] right-[4%] z-0 h-96 w-96 rounded-full bg-[#98FF98]/8 blur-3xl"
        />

        {/* ── PCB mesh overlay with moving shimmer ── */}
        <div className="hero-bg-fade pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(rgba(152,255,152,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(152,255,152,0.12)_1px,transparent_1px)] bg-size-[88px_88px] opacity-30" />
        <div
          ref={gridShimmerRef}
          className="hero-bg-fade pointer-events-none absolute inset-y-0 left-0 z-2 w-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(152,255,152,0.18)_46%,transparent_100%)] opacity-30 blur-xl"
        />

        {/* ── Skeuomorphic vignette overlay ── */}
        <div className="hero-bg-fade pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

        {/* ── Top edge inner bevel highlight ── */}
        <div className="hero-edge-fx pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.07)_30%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.07)_70%,transparent)]" />

        {/* ── Bottom edge shadow ── */}
        <div className="hero-edge-fx pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.80))]" />

        {/* ── Mouse-reactive spotlight that follows cursor inside the section ── */}
        <motion.div
          className="pointer-events-none absolute z-0 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(152,255,152,0.04)_0%,transparent_70%)]"
          style={{
            x: useTransform(
              springNormX,
              (v) => `calc(${(v * 0.5 + 0.5) * 100}% - 300px)`,
            ),
            y: useTransform(
              springNormY,
              (v) => `calc(${(v * 0.5 + 0.5) * 100}% - 300px)`,
            ),
          }}
        />

        {/* ── PCB / parallax background ── */}
        <HeroParallaxLayers x={norm.x} y={norm.y} />

        {/* ── Main content grid ── */}
        <div className="relative z-10 mx-auto grid min-h-[82vh] w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ── Text column — layer 4 parallax ── */}
          <motion.div ref={textWrapRef} className="hero-reveal" style={{ x: textX, y: textY }}>
            <HeroText />
          </motion.div>

          {/* ── Orb column — layer 5 parallax (deepest foreground) ── */}
          <motion.div
            ref={orbWrapRef}
            className="hero-reveal flex justify-center lg:justify-end"
            style={{ x: orbX, y: orbY }}
            onMouseEnter={() => setIsOrbHovering(true)}
            onMouseLeave={() => setIsOrbHovering(false)}
          >
            <HeroOrb x={norm.x} y={norm.y} mode={coreMode} />
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <ScrollIndicator />

        {/* ── Skeuomorphic side rails — etched lines ── */}
        <div className="pointer-events-none absolute left-6 top-1/2 z-20 hidden h-[40%] w-px -translate-y-1/2 bg-white/4 shadow-[1px_0_0_rgba(0,0,0,0.80)] md:block" />
        <div className="pointer-events-none absolute right-6 top-1/2 z-20 hidden h-[40%] w-px -translate-y-1/2 bg-white/4 shadow-[-1px_0_0_rgba(0,0,0,0.80)] md:block" />

        {/* ── Corner embossed notches ── */}
        {[
          "top-6 left-6",
          "top-6 right-6",
          "bottom-6 left-6",
          "bottom-6 right-6",
        ].map((pos) => (
          <div
            key={pos}
            className={`pointer-events-none absolute z-20 h-3 w-3 rounded-xs border border-[rgba(152,255,152,0.15)] shadow-[inset_1px_1px_0_rgba(255,255,255,0.05),1px_1px_4px_rgba(0,0,0,0.80)] ${pos}`}
          />
        ))}
      </section>
    </>
  );
}
