"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   SKILL DATA  — SVG fill colors kept exactly as original
───────────────────────────────────────────────────────────────── */
const SKILLS = [
  {
    name: "Python",
    level: 90,
    tag: "Language",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><linearGradient id="py1" x1="70.252" y1="1237.476" x2="170.659" y2="1237.476" gradientTransform="matrix(.563 0 0 -.568 -29.215 737.046)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5A9FD4"/><stop offset="1" stop-color="#306998"/></linearGradient><linearGradient id="py2" x1="209.474" y1="1098.811" x2="152.718" y2="1168.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 737.046)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFD43B"/><stop offset="1" stop-color="#FFE873"/></linearGradient><path fill="url(#py1)" d="M63.9 0C44 0 45.3 8.5 45.3 8.5l.02 8.8h19v2.6H28.4S16 18.3 16 38.5s10.6 19.5 10.6 19.5h6.3v-9.4s-.3-10.6 10.4-10.6h18s10.1.2 10.1-9.7V10.2S73 0 63.9 0zm-10 5.8a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/><path fill="url(#py2)" d="M64.1 128c19.9 0 18.6-8.5 18.6-8.5l-.02-8.8h-19v-2.6h35.9s12.4 1.4 12.4-18.8-10.6-19.5-10.6-19.5h-6.3v9.4s.3 10.6-10.4 10.6h-18S57.5 89.6 57.5 99.5v19.3S55 128 64.1 128zm10-5.8a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>`,
  },
  {
    name: "Django",
    level: 82,
    tag: "Framework",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#092E20" d="M59.5 0h18.4v86.4c-9.5 1.8-16.4 2.5-24 2.5-22.6 0-34.4-10.2-34.4-29.8 0-19 12.5-31.3 31.9-31.3 3 0 5.3.3 8.1 1V0zm0 43.8c-2.2-.7-4-1-6.3-1-9.4 0-14.8 5.8-14.8 15.9 0 9.9 5.1 15.3 14.5 15.3 2 0 3.7-.1 6.6-.5V43.8z"/><path fill="#092E20" d="M99.3 27.7V73c0 15.6-1.1 23.1-4.5 29.6-3.1 6.2-7.2 10.1-15.7 14.4l-17-8.1c8.5-4 12.6-7.5 15.2-13 2.7-5.6 3.6-12 3.6-28.9V27.7h18.4zm-18.4-27.7h18.4v18.9H80.9V0z"/></svg>`,
  },
  {
    name: "Flutter",
    level: 75,
    tag: "Framework",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#54C5F8" d="M12.3 64.2L76.3 0h39.4L27.9 88.4z"/><path fill="#01579B" d="M76.3 128h39.4L81.6 93.9l34.1-34.8H76.2l-34 34.9z"/><path fill="#29B6F6" d="M81.6 93.9l-20-20-15.7 16 15.8 15.8z"/></svg>`,
  },
  {
    name: "HTML & CSS",
    level: 95,
    tag: "Language",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#E44D26" d="M19.4 9.7L7.3 118.3 63.9 128l56.8-9.7L108.6 9.7H19.4zm87 100.8l-42.5 7.3-42.5-7.3-9.4-97.4h103.8l-9.4 97.4z"/><path fill="#F16529" d="M64 109.4l34.7-5.9 5.9-64.8H64v70.7z"/><path fill="#EBEBEB" d="M64 62.3H43.3l-1.4-14.7H64V33.1H26.4l.4 3.7 3.7 41.2H64V62.3z"/><path fill="#fff" d="M64 78.2v14.5l-.1.1-17.2-4.6-1.1-12.4H31.9l2.2 24.6L64 109v-30.8z"/></svg>`,
  },
  {
    name: "C++",
    level: 78,
    tag: "Language",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#00599C" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm-4 100.8c-19.9 0-36-16.1-36-36s16.1-36 36-36c9.6 0 18.3 3.8 24.7 9.9l-10 10C71 44.3 65.7 42 60 42c-14.4 0-26 11.6-26 26s11.6 26 26 26c9.7 0 18.1-5.3 22.6-13.2H60v-13h36.2c.5 2.2.8 4.5.8 6.9C97 88.3 82 100.8 60 100.8z"/><path fill="#00599C" d="M100 58h-6v-6h-6v6h-6v6h6v6h6v-6h6zm18 0h-6v-6h-6v6h-6v6h6v6h6v-6h6z"/></svg>`,
  },
  {
    name: "Git",
    level: 88,
    tag: "Tool",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#F34F29" d="M124.742 58.378L69.625 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.685 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993L87.42 55.529c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.667 9.667 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L67.769 47.125v34.922a9.708 9.708 0 012.543 1.833c3.78 3.777 3.78 9.9 0 13.679-3.78 3.775-9.91 3.775-13.683 0-3.78-3.778-3.78-9.9 0-13.679a9.658 9.658 0 013.167-2.11V46.405a9.658 9.658 0 01-3.167-2.11c-2.739-2.736-3.462-6.697-2.242-10.1L40.831 19.873 3.256 57.44c-3.172 3.172-3.172 8.32 0 11.494l55.117 55.117c3.174 3.174 8.32 3.174 11.499 0l54.87-54.869c3.175-3.176 3.175-8.322 0-11.804z"/></svg>`,
  },
  {
    name: "GitHub",
    level: 90,
    tag: "Platform",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#181717" d="M64 5.1C31.8 5.1 5.8 31.3 5.8 63.8c0 26 16.6 48.1 39.8 55.9 2.9.5 4-1.3 4-2.8v-10c-16.2 3.5-19.6-7.8-19.6-7.8-2.7-6.7-6.5-8.5-6.5-8.5-5.3-3.6.4-3.6.4-3.6 5.9.4 9 6.1 9 6.1 5.2 9 13.8 6.4 17.1 4.9.5-3.8 2-6.4 3.7-7.9-13-1.5-26.6-6.5-26.6-29 0-6.4 2.3-11.7 6-15.8-.6-1.5-2.6-7.5.6-15.6 0 0 4.9-1.6 16.1 6 4.7-1.3 9.7-1.9 14.7-1.9s10 .6 14.7 1.9c11.1-7.6 16-6 16-6 3.2 8.2 1.2 14.1.6 15.6 3.8 4.1 6 9.4 6 15.8 0 22.5-13.7 27.5-26.7 29 2.1 1.8 3.9 5.4 3.9 10.8v16.1c0 1.5 1 3.3 4 2.8 23.1-7.8 39.7-29.9 39.7-55.9C122.2 31.3 96.2 5.1 64 5.1z"/></svg>`,
  },
  {
    name: "VS Code",
    level: 92,
    tag: "Tool",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#0065A9" d="M90 1.6L50.6 40.2 21 18.4.1 35.3l26.5 28.6L.1 92.6 21 109.5l29.6-21.8L90 126.3l38-15.5V17L90 1.6zm8 99.2l-36-26.4v-21l36-26.4v73.8z"/></svg>`,
  },
  {
    name: "Arduino",
    level: 70,
    tag: "Platform",
    icon: `<svg viewBox="0 0 128 128" width="36" height="36"><path fill="#00979D" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm-8.5 84.2c-11.1 0-20.2-9-20.2-20.2s9-20.2 20.2-20.2c6.7 0 12.6 3.3 16.3 8.3h-9.1c-2.4-2.8-5.9-4.5-9.8-4.5-7.1 0-12.9 5.8-12.9 12.9s5.8 12.9 12.9 12.9c4.2 0 8-2 10.4-5.1h9c-3.7 5.4-9.8 8.9-16.8 8.9zm26.3-11.9h-4.6v4.6h-4.7v-4.6h-4.6v-4.7h4.6v-4.6h4.7v4.6h4.6v4.7zm14.4 0h-4.6v4.6h-4.7v-4.6H82v-4.7h4.9v-4.6h4.7v4.6h4.6v4.7z"/></svg>`,
  },
];

/* ─────────────────────────────────────────────────────────────────
   THREE.JS — CHROME METALLIC TORUS KNOT
───────────────────────────────────────────────────────────────── */
function ChromeKnot({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: 0, y: 0 });
  const target    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;
    let cleanupFn: (() => void) | undefined;

    const init = async () => {
      const THREE = await import("three");
      const W = container.offsetWidth;
      const H = container.offsetHeight;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
      camera.position.set(0, 0, 7);

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

      const mat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 1.0, roughness: 0.04 });
      const geo  = new THREE.TorusKnotGeometry(1.4, 0.42, 220, 32, 2, 3);
      const knot = new THREE.Mesh(geo, mat);
      scene.add(knot);

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        target.current.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        target.current.y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
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

    init().then((fn) => { cleanupFn = fn; });
    return () => { cleanupFn?.(); };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none z-0 opacity-[0.22] mix-blend-multiply"
      style={{ top: "50%", left: "62%", transform: "translate(-50%,-50%)", width: "55%", height: "85%" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────────────────────────── */
function ProgressBar({ level }: { level: number }) {
  const ref       = useRef<HTMLDivElement>(null);
  const fillRef   = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const isInView  = useInView(ref, { margin: "-20px" });

  useEffect(() => {
    if (!isInView || triggered.current || !fillRef.current) return;
    triggered.current = true;
    gsap.fromTo(fillRef.current,
      { scaleX: 0 },
      { scaleX: level / 100, duration: 1.1, ease: "power3.out", delay: 0.05, transformOrigin: "left" },
    );
  }, [isInView, level]);

  return (
    <div ref={ref} className="relative h-[2px] rounded-sm bg-black/10">
      <div
        ref={fillRef}
        className="absolute inset-0 bg-[#111] rounded-sm"
        style={{ scaleX: 0, transformOrigin: "left" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SECTION TITLE
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
      outer.style.cssText = "display:inline-block;overflow:hidden;line-height:1.05;";
      const inner = document.createElement("span");
      inner.textContent = ch === " " ? "\u00A0" : ch;
      inner.style.display = "inline-block";
      outer.appendChild(inner);
      el.appendChild(outer);
      return inner;
    });

    gsap.fromTo(chars,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.028,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } },
    );

    const scatter    = () => gsap.to(chars, { yPercent: () => gsap.utils.random(-40, 40), opacity: 0.12, duration: 0.26, ease: "power2.out",    stagger: { each: 0.01, from: "random" } });
    const reassemble = () => gsap.to(chars, { yPercent: 0, opacity: 1,                   duration: 0.55, ease: "elastic.out(1,0.55)", stagger: { each: 0.01, from: "random" } });
    el.addEventListener("mouseenter", scatter);
    el.addEventListener("mouseleave", reassemble);
    return () => { el.removeEventListener("mouseenter", scatter); el.removeEventListener("mouseleave", reassemble); };
  }, []);

  return (
    <h2
      ref={ref}
      className="m-0 cursor-default select-none font-extrabold leading-none tracking-[-0.04em] text-[#111]"
      style={{ fontSize: "clamp(38px, 5.5vw, 80px)" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   SKILL ROW
───────────────────────────────────────────────────────────────── */
function SkillRow({
  skill, index, isActive, onEnter, onLeave,
}: {
  skill: (typeof SKILLS)[0];
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const rowRef    = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLSpanElement>(null);
  const tweenRef  = useRef<gsap.core.Tween | null>(null);
  const isInView  = useInView(rowRef, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView || !rowRef.current) return;
    gsap.fromTo(rowRef.current,
      { x: -28, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: index * 0.055 },
    );
  }, [isInView, index]);

  const nameStyle: React.CSSProperties = {
    fontSize: "clamp(18px, 3vw, 46px)",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    whiteSpace: "nowrap",
    lineHeight: 1,
  };

  const handleEnter = () => {
    onEnter();
    const track = trackRef.current;
    const stat  = staticRef.current;
    if (!track || !stat) return;
    gsap.set(stat,  { opacity: 0 });
    gsap.set(track, { opacity: 1, x: 0 });
    tweenRef.current?.kill();
    const oneW = track.scrollWidth / 8;
    tweenRef.current = gsap.to(track, { x: -oneW, duration: 6, ease: "none", repeat: -1 });
  };

  const handleLeave = () => {
    onLeave();
    tweenRef.current?.kill();
    tweenRef.current = null;
    const track = trackRef.current;
    const stat  = staticRef.current;
    if (!track || !stat) return;
    gsap.set(track, { opacity: 0, x: 0 });
    gsap.set(stat,  { opacity: 1 });
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative cursor-default border-b border-black/10"
      style={{ opacity: 0 }}
    >
      {/* hover fill */}
      <motion.div
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 bg-[#111] pointer-events-none z-0"
        style={{ transformOrigin: "bottom" }}
      />

      <div
        className="relative z-[1] flex items-center gap-3 sm:gap-5 py-4 sm:py-5 pr-0 overflow-hidden transition-colors duration-300"
        style={{ color: isActive ? "#fff" : "#111" }}
      >
        {/* index */}
        <span className="text-[11px] opacity-30 tracking-[0.1em] min-w-[22px] sm:min-w-[28px] shrink-0 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* name */}
        <div className="flex-1 overflow-hidden min-w-0 relative">
          <span ref={staticRef} style={{ ...nameStyle, display: "inline-block" }}>
            {skill.name}
          </span>
          <div
            ref={trackRef}
            className="absolute top-0 left-0 inline-flex items-center will-change-transform"
            style={{ ...nameStyle, gap: 48, opacity: 0 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="inline-flex items-center" style={{ gap: 48 }}>
                {skill.name}
                <span className="text-[0.35em] opacity-30">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* tag pill */}
        <span
          className="hidden sm:inline-block text-[10px] tracking-[0.12em] uppercase opacity-40 shrink-0 px-[10px] py-[3px] rounded-full border transition-[border-color] duration-300"
          style={{ borderColor: isActive ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)" }}
        >
          {skill.tag}
        </span>

        {/* arrow */}
        <motion.span
          animate={{ x: isActive ? 5 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-base shrink-0"
          style={{ opacity: isActive ? 1 : 0.25 }}
        >
          →
        </motion.span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────────────────────────────────── */
function DetailPanel({ skill }: { skill: (typeof SKILLS)[0] | null }) {
  return (
    <div className="sticky top-[100px] py-8 pl-8 sm:pl-[52px] border-l border-black/10">
      <AnimatePresence mode="wait">
        {skill && (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-7"
          >
            {/* icon — dangerouslySetInnerHTML preserves original SVG fill colors */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-[72px] h-[72px] bg-white border border-black/10 rounded-[18px] flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: skill.icon }}
            />

            {/* name + tag */}
            <div>
              <div className="text-[10px] tracking-[0.14em] uppercase text-[#888] mb-[6px]">
                {skill.tag}
              </div>
              <div
                className="font-extrabold tracking-[-0.035em] text-[#111] leading-none"
                style={{ fontSize: "clamp(24px, 2.8vw, 38px)" }}
              >
                {skill.name}
              </div>
            </div>

            {/* proficiency */}
            <div>
              <div className="flex justify-between mb-[10px]">
                <span className="text-[10px] tracking-[0.12em] uppercase text-[#999]">Proficiency</span>
                <span className="text-xs font-bold text-[#111]">{skill.level}%</span>
              </div>
              <ProgressBar level={skill.level} />
            </div>

            {/* level label */}
            <div className="p-3 sm:p-[12px_16px] bg-[#f7f7f7] border border-black/[0.08] rounded-xl">
              <div className="text-[9px] tracking-[0.12em] uppercase text-[#bbb] mb-[5px]">Level</div>
              <div className="text-sm font-bold text-[#111]">
                {skill.level >= 90 ? "Expert" : skill.level >= 80 ? "Advanced" : skill.level >= 70 ? "Proficient" : "Intermediate"}
              </div>
            </div>

            {/* dot indicators */}
            <div className="flex gap-[5px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-[6px] h-[6px] rounded-full"
                  style={{ background: i < Math.round(skill.level / 10) ? "#111" : "rgba(0,0,0,0.1)" }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────
   STRIP REVEAL OVERLAY
   10 equal-width vertical strips covering the section.
   On scroll-enter each strip slides up (translateY 0 → -100%)
   from left to right with a stagger.
───────────────────────────────────────────────────────────────── */
const STRIP_COUNT = 10;

function StripReveal({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement> }) {
  const stripsRef  = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strips  = stripsRef.current.filter(Boolean) as HTMLDivElement[];
    const wrapper = wrapperRef.current;
    if (!strips.length || !sectionRef.current || !wrapper) return;

    // Start: strips fully cover the section, borders visible
    gsap.set(strips,  { yPercent: 0, borderColor: "#000" });
    gsap.set(wrapper, { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });

    // 1 — strips slide up one by one, left → right
    tl.to(strips, {
      yPercent: -101,
      duration: 0.72,
      ease: "power3.inOut",
      stagger: 0.07,
    })
    // 2 — once all strips have exited, fade borders + wrapper to nothing
    .to(wrapper, {
      opacity: 0,
      duration: 0.2,
      ease: "none",
      onComplete: () => {
        // remove from paint entirely so it never blocks interactions
        if (wrapper) wrapper.style.display = "none";
      },
    });

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
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
          ref={(el) => { stripsRef.current[i] = el; }}
          className="h-full bg-white flex-1"
          style={{
            borderRight: i < STRIP_COUNT - 1 ? "1.5px solid #000" : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────── */
export default function Skills() {
  const sectionRef                      = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx]       = useState<number | null>(null);
  const activeSkill                     = activeIdx !== null ? SKILLS[activeIdx] : null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-white text-[#111] overflow-hidden box-border"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* ── Strip reveal overlay ── */}
      <StripReveal sectionRef={sectionRef} />

      {/* Three.js chrome knot */}
      <ChromeKnot containerRef={sectionRef} />

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse 50% 70% at 68% 50%, transparent 25%, #ffffff 78%)" }}
      />

      {/* ── CONTENT ── */}
      <div className="relative z-[2] max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">

        {/* HEADER */}
        <div className="mb-10 sm:mb-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-[7px] mb-[18px] px-3 py-[3px] rounded-full border border-black/15 text-[9px] tracking-[0.16em] uppercase text-[#888]"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-[#111]" />
            Stack
          </motion.div>

          <div className="flex items-end justify-between flex-wrap gap-5">
            <SectionTitle />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[11px] text-[#aaa] tracking-[0.1em] uppercase m-0 max-w-[200px] text-right leading-[1.7]"
            >
              Tools &amp; tech<br />I use every day
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="h-px mt-7 bg-black/[0.12]"
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* TWO COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_300px] gap-0 items-start">
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

          {/* RIGHT — detail panel (md+ only) */}
          <div className="hidden md:block">
            <DetailPanel skill={activeSkill} />
          </div>
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 sm:mt-[52px] flex justify-between border-t border-black/[0.08] pt-[22px] flex-wrap gap-3"
        >
          <p className="text-[10px] text-[#ccc] tracking-[0.12em] uppercase m-0">
            {SKILLS.length} Technologies
          </p>
        </motion.div>

      </div>
    </section>
  );
}