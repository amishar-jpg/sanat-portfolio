

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   SKILL DATA  (icons rendered in black/grey for B&W theme)
───────────────────────────────────────────────────────────────── */
const SKILLS = [
  {
    name: "Python",
    level: 90,
    tag: "Language",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M63.9 0C44 0 45.3 8.5 45.3 8.5l.02 8.8h19v2.6H28.4S16 18.3 16 38.5s10.6 19.5 10.6 19.5h6.3v-9.4s-.3-10.6 10.4-10.6h18s10.1.2 10.1-9.7V10.2S73 0 63.9 0zm-10 5.8a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/><path fill="#555" d="M64.1 128c19.9 0 18.6-8.5 18.6-8.5l-.02-8.8h-19v-2.6h35.9s12.4 1.4 12.4-18.8-10.6-19.5-10.6-19.5h-6.3v9.4s.3 10.6-10.4 10.6h-18S57.5 89.6 57.5 99.5v19.3S55 128 64.1 128zm10-5.8a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>`,
  },
  {
    name: "Django",
    level: 82,
    tag: "Framework",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M59.5 0h18.4v86.4c-9.5 1.8-16.4 2.5-24 2.5-22.6 0-34.4-10.2-34.4-29.8 0-19 12.5-31.3 31.9-31.3 3 0 5.3.3 8.1 1V0zm0 43.8c-2.2-.7-4-1-6.3-1-9.4 0-14.8 5.8-14.8 15.9 0 9.9 5.1 15.3 14.5 15.3 2 0 3.7-.1 6.6-.5V43.8z"/><path fill="#1a1a1a" d="M99.3 27.7V73c0 15.6-1.1 23.1-4.5 29.6-3.1 6.2-7.2 10.1-15.7 14.4l-17-8.1c8.5-4 12.6-7.5 15.2-13 2.7-5.6 3.6-12 3.6-28.9V27.7h18.4zm-18.4-27.7h18.4v18.9H80.9V0z"/></svg>`,
  },
  {
    name: "Flutter",
    level: 75,
    tag: "Framework",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M12.3 64.2L76.3 0h39.4L27.9 88.4z"/><path fill="#333" d="M76.3 128h39.4L81.6 93.9l34.1-34.8H76.2l-34 34.9z"/><path fill="#666" d="M81.6 93.9l-20-20-15.7 16 15.8 15.8z"/></svg>`,
  },
  {
    name: "HTML & CSS",
    level: 95,
    tag: "Language",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M19.4 9.7L7.3 118.3 63.9 128l56.8-9.7L108.6 9.7H19.4zm87 100.8l-42.5 7.3-42.5-7.3-9.4-97.4h103.8l-9.4 97.4z"/><path fill="#1a1a1a" d="M64 109.4l34.7-5.9 5.9-64.8H64v70.7z"/><path fill="#555" d="M64 62.3H43.3l-1.4-14.7H64V33.1H26.4l.4 3.7 3.7 41.2H64V62.3z"/></svg>`,
  },
  {
    name: "C++",
    level: 78,
    tag: "Language",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm-4 100.8c-19.9 0-36-16.1-36-36s16.1-36 36-36c9.6 0 18.3 3.8 24.7 9.9l-10 10C71 44.3 65.7 42 60 42c-14.4 0-26 11.6-26 26s11.6 26 26 26c9.7 0 18.1-5.3 22.6-13.2H60v-13h36.2c.5 2.2.8 4.5.8 6.9C97 88.3 82 100.8 60 100.8z"/><path fill="#1a1a1a" d="M100 58h-6v-6h-6v6h-6v6h6v6h6v-6h6zm18 0h-6v-6h-6v6h-6v6h6v6h6v-6h6z"/></svg>`,
  },
  {
    name: "Git",
    level: 88,
    tag: "Tool",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M124.742 58.378L69.625 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.685 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993L87.42 55.529c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.667 9.667 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L67.769 47.125v34.922a9.708 9.708 0 012.543 1.833c3.78 3.777 3.78 9.9 0 13.679-3.78 3.775-9.91 3.775-13.683 0-3.78-3.778-3.78-9.9 0-13.679a9.658 9.658 0 013.167-2.11V46.405a9.658 9.658 0 01-3.167-2.11c-2.739-2.736-3.462-6.697-2.242-10.1L40.831 19.873 3.256 57.44c-3.172 3.172-3.172 8.32 0 11.494l55.117 55.117c3.174 3.174 8.32 3.174 11.499 0l54.87-54.869c3.175-3.176 3.175-8.322 0-11.804z"/></svg>`,
  },
  {
    name: "GitHub",
    level: 90,
    tag: "Platform",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M64 5.1C31.8 5.1 5.8 31.3 5.8 63.8c0 26 16.6 48.1 39.8 55.9 2.9.5 4-1.3 4-2.8v-10c-16.2 3.5-19.6-7.8-19.6-7.8-2.7-6.7-6.5-8.5-6.5-8.5-5.3-3.6.4-3.6.4-3.6 5.9.4 9 6.1 9 6.1 5.2 9 13.8 6.4 17.1 4.9.5-3.8 2-6.4 3.7-7.9-13-1.5-26.6-6.5-26.6-29 0-6.4 2.3-11.7 6-15.8-.6-1.5-2.6-7.5.6-15.6 0 0 4.9-1.6 16.1 6 4.7-1.3 9.7-1.9 14.7-1.9s10 .6 14.7 1.9c11.1-7.6 16-6 16-6 3.2 8.2 1.2 14.1.6 15.6 3.8 4.1 6 9.4 6 15.8 0 22.5-13.7 27.5-26.7 29 2.1 1.8 3.9 5.4 3.9 10.8v16.1c0 1.5 1 3.3 4 2.8 23.1-7.8 39.7-29.9 39.7-55.9C122.2 31.3 96.2 5.1 64 5.1z"/></svg>`,
  },
  {
    name: "VS Code",
    level: 92,
    tag: "Tool",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M90 1.6L50.6 40.2 21 18.4.1 35.3l26.5 28.6L.1 92.6 21 109.5l29.6-21.8L90 126.3l38-15.5V17L90 1.6zm8 99.2l-36-26.4v-21l36-26.4v73.8z"/></svg>`,
  },
  {
    name: "Arduino",
    level: 70,
    tag: "Platform",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#1a1a1a" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm-8.5 84.2c-11.1 0-20.2-9-20.2-20.2s9-20.2 20.2-20.2c6.7 0 12.6 3.3 16.3 8.3h-9.1c-2.4-2.8-5.9-4.5-9.8-4.5-7.1 0-12.9 5.8-12.9 12.9s5.8 12.9 12.9 12.9c4.2 0 8-2 10.4-5.1h9c-3.7 5.4-9.8 8.9-16.8 8.9zm26.3-11.9h-4.6v4.6h-4.7v-4.6h-4.6v-4.7h4.6v-4.6h4.7v4.6h4.6v4.7zm14.4 0h-4.6v4.6h-4.7v-4.6H82v-4.7h4.9v-4.6h4.7v4.6h4.6v4.7z"/></svg>`,
  },
];

/* ─────────────────────────────────────────────────────────────────
   THREE.JS — CHROME METALLIC TORUS KNOT  (lights kept as-is)
───────────────────────────────────────────────────────────────── */
function ChromeKnot({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;
    let cleanupFn: (() => void) | undefined;

    const init = async () => {
      const THREE = await import("three");
      const W = container.offsetWidth;
      const H = container.offsetHeight;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
      camera.position.set(0, 0, 7);

      // metallic chrome lighting — keep colours from original
      const ambLight = new THREE.AmbientLight(0x222244, 1.5);
      scene.add(ambLight);

      const light1 = new THREE.DirectionalLight(0x8888ff, 3.5);
      light1.position.set(5, 8, 5);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xff8844, 2.5);
      light2.position.set(-6, -4, 3);
      scene.add(light2);

      const light3 = new THREE.PointLight(0x4444ff, 5, 22);
      light3.position.set(0, 0, 6);
      scene.add(light3);

      const light4 = new THREE.DirectionalLight(0xffffff, 2);
      light4.position.set(0, -8, -4);
      scene.add(light4);

      const mat = new THREE.MeshStandardMaterial({
        color: 0xbbbbbb,
        metalness: 1.0,
        roughness: 0.04,
      });

      const geo = new THREE.TorusKnotGeometry(1.4, 0.42, 220, 32, 2, 3);
      const knot = new THREE.Mesh(geo, mat);
      scene.add(knot);

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        target.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      const onResize = () => {
        const w2 = container.offsetWidth;
        const h2 = container.offsetHeight;
        renderer.setSize(w2, h2);
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      let t = 0;
      const tick = () => {
        animId = requestAnimationFrame(tick);
        t += 0.004;
        mouse.current.x += (target.current.x - mouse.current.x) * 0.04;
        mouse.current.y += (target.current.y - mouse.current.y) * 0.04;

        knot.rotation.x = t * 0.22 + mouse.current.y * 0.35;
        knot.rotation.y = t * 0.35 + mouse.current.x * 0.35;

        light1.position.x = Math.sin(t * 0.5) * 7;
        light1.position.z = Math.cos(t * 0.5) * 7;
        light2.position.x = Math.sin(t * 0.3 + 2) * 6;
        light2.position.y = Math.cos(t * 0.4) * 5;

        renderer.render(scene, camera);
      };
      tick();

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
        geo.dispose();
        mat.dispose();
      };
    };

    init().then((fn) => {
      cleanupFn = fn;
    });
    return () => {
      cleanupFn?.();
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "62%",
        transform: "translate(-50%, -50%)",
        width: "55%",
        height: "85%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.22, // subtle on white bg
        mixBlendMode: "multiply",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   SCROLL-TRIGGERED PROGRESS BAR
───────────────────────────────────────────────────────────────── */
function ProgressBar({ level }: { level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const isInView = useInView(ref, { margin: "-20px" });

  useEffect(() => {
    if (!isInView || triggered.current || !fillRef.current) return;
    triggered.current = true;
    gsap.fromTo(
      fillRef.current,
      { scaleX: 0 },
      {
        scaleX: level / 100,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.05,
        transformOrigin: "left",
      },
    );
  }, [isInView, level]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        height: 2,
        background: "rgba(0,0,0,0.1)",
        borderRadius: 2,
      }}
    >
      <div
        ref={fillRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#111",
          borderRadius: 2,
          scaleX: 0,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SECTION TITLE — GSAP char split, B&W
───────────────────────────────────────────────────────────────── */
function SectionTitle() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const text = "Tech Arsenal";
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
      style={{
        fontSize: "clamp(30px, 4.2vw, 62px)",
        fontWeight: 800,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: "#111",
        margin: 0,
        cursor: "default",
        userSelect: "none",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   SKILL ROW  — the skill NAME is the marquee on hover
───────────────────────────────────────────────────────────────── */
function SkillRow({
  skill,
  index,
  isActive,
  onEnter,
  onLeave,
}: {
  skill: (typeof SKILLS)[0];
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null); // the scrolling strip
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-40px" });

  /* entrance */
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

  const nameStyle: React.CSSProperties = {
    fontSize: "clamp(17px, 2.4vw, 34px)",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    whiteSpace: "nowrap",
    lineHeight: 1,
  };

  // Static name ref — we hide/show it
  const staticRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    onEnter();
    const track = trackRef.current;
    const stat = staticRef.current;
    if (!track || !stat) return;

    // hide the static word
    gsap.set(stat, { opacity: 0 });

    // show track and start scrolling from x=0
    gsap.set(track, { opacity: 1, x: 0 });
    tweenRef.current?.kill();
    const oneW = track.scrollWidth / 8; // 8 copies
    tweenRef.current = gsap.to(track, {
      x: -oneW,
      duration: 6,
      ease: "none",
      repeat: -1,
    });
  };

  const handleLeave = () => {
    onLeave();
    tweenRef.current?.kill();
    tweenRef.current = null;

    const track = trackRef.current;
    const stat = staticRef.current;
    if (!track || !stat) return;

    // hide track, restore static word
    gsap.set(track, { opacity: 0, x: 0 });
    gsap.set(stat, { opacity: 1 });
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        opacity: 0,
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        position: "relative",
        cursor: "default",
      }}
    >
      {/* hover fill — slides up from bottom */}
      <motion.div
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: "#111",
          transformOrigin: "bottom",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 20px 12px 0",
          gap: 20,
          position: "relative",
          zIndex: 1,
          color: isActive ? "#fff" : "#111",
          transition: "color 0.3s",
          overflow: "hidden",
        }}
      >
        {/* row index */}
        <span
          style={{
            fontSize: 10,
            opacity: 0.3,
            letterSpacing: "0.1em",
            fontVariantNumeric: "tabular-nums",
            minWidth: 24,
            flexShrink: 0,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* NAME AREA — flex:1, clips overflow */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            minWidth: 0,
            position: "relative",
          }}
        >
          {/* STATIC — single word, shown at rest */}
          <span
            ref={staticRef}
            style={{ ...nameStyle, display: "inline-block" }}
          >
            {skill.name}
          </span>

          {/* SCROLL TRACK — hidden at rest, animates on hover */}
          <div
            ref={trackRef}
            style={{
              ...nameStyle,
              position: "absolute",
              top: 0,
              left: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 48,
              opacity: 0, // hidden by default
              willChange: "transform",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 48,
                }}
              >
                {skill.name}
                <span style={{ fontSize: "0.35em", opacity: 0.3 }}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* tag pill */}
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.4,
            flexShrink: 0,
            padding: "3px 10px",
            border: `1px solid ${isActive ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"}`,
            borderRadius: 100,
            transition: "border-color 0.3s",
          }}
        >
          {skill.tag}
        </span>

        {/* arrow */}
        <motion.span
          animate={{ x: isActive ? 5 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: 16, flexShrink: 0, opacity: isActive ? 1 : 0.25 }}
        >
          →
        </motion.span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   RIGHT DETAIL PANEL — B&W
───────────────────────────────────────────────────────────────── */
function DetailPanel({ skill }: { skill: (typeof SKILLS)[0] | null }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 72,
        padding: "16px 0 16px 36px",
        borderLeft: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <AnimatePresence mode="wait">
        {skill ? (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {/* icon box */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                width: 56,
                height: 56,
                background: "#f5f5f5",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              dangerouslySetInnerHTML={{ __html: skill.icon }}
            />

            {/* name + tag */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: 6,
                }}
              >
                {skill.tag}
              </div>
              <div
                style={{
                  fontSize: "clamp(24px, 2.8vw, 38px)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  color: "#111",
                  lineHeight: 1,
                }}
              >
                {skill.name}
              </div>
            </div>

            {/* proficiency */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#999",
                  }}
                >
                  Proficiency
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>
                  {skill.level}%
                </span>
              </div>
              <ProgressBar level={skill.level} />
            </div>

            {/* level label */}
            <div
              style={{
                padding: "12px 16px",
                background: "#f7f7f7",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#bbb",
                  marginBottom: 5,
                }}
              >
                Level
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
                {skill.level >= 90
                  ? "Expert"
                  : skill.level >= 80
                    ? "Advanced"
                    : skill.level >= 70
                      ? "Proficient"
                      : "Intermediate"}
              </div>
            </div>

            {/* dot indicators */}
            <div style={{ display: "flex", gap: 5 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      i < Math.round(skill.level / 10)
                        ? "#111"
                        : "rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────── */
export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const activeSkill = activeIdx !== null ? SKILLS[activeIdx] : null;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "#111",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Three.js chrome knot — multiply blend on white */}
      <ChromeKnot containerRef={sectionRef} />

      {/* very subtle top vignette to blend knot edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background:
            "radial-gradient(ellipse 50% 70% at 68% 50%, transparent 25%, #ffffff 78%)",
        }}
      />

      {/* ── CONTENT ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1240,
          margin: "0 auto",
          padding: "36px 64px 24px",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
              padding: "3px 12px",
              borderRadius: 100,
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 9,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#888",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#111",
              }}
            />
            Stack
          </motion.div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <SectionTitle />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 11,
                color: "#aaa",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
                maxWidth: 200,
                textAlign: "right",
                lineHeight: 1.7,
              }}
            >
              Tools &amp; tech
              <br />I use every day
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            style={{
              height: 1,
              marginTop: 12,
              transformOrigin: "left",
              background: "rgba(0,0,0,0.12)",
            }}
          />
        </div>

        {/* TWO COLUMNS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 0,
            alignItems: "start",
          }}
        >
          {/* LEFT — skill rows */}
          <div>
            {SKILLS.map((skill, i) => (
              <SkillRow
                key={skill.name}
                skill={skill}
                index={i}
                isActive={activeIdx === i}
                onEnter={() => setActiveIdx(i)}
                onLeave={() => setActiveIdx(null)}
              />
            ))}
          </div>

          {/* RIGHT — detail panel */}
          <DetailPanel skill={activeSkill} />
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            paddingTop: 12,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: "#ccc",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {SKILLS.length} Technologies
          </p>
          <p
            style={{
              fontSize: 10,
              color: "#ccc",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Hover rows to interact
          </p>
        </motion.div>
      </div>
    </section>
  );
}