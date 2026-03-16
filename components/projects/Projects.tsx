"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  image: string;
  liveUsers: string;
  stars: string;
  buildStatus: "active" | "stable";
  role: string;
  year: string;
  corner: "tl" | "tr" | "bl" | "br";
  accent: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: "mic-camera-stories",
    name: "MIC CAMERA STORIES",
    description:
      "A platform for sharing personal stories with media-rich storytelling flows.",
    tags: ["React", "TypeScript", "Content Platform"],
    image: "/miccamerastories.png",
    liveUsers: "2.4K",
    stars: "128",
    buildStatus: "active",
    role: "React · TypeScript",
    year: "2024",
    corner: "tl",
    accent: "#c8b89a",
  },
  {
    id: "consumer-compass",
    name: "CONSUMER COMPASS",
    description:
      "A technology gadget review platform focused on trust, comparison, and clarity.",
    tags: ["Web", "Product Reviews", "UX"],
    image: "/consumercompass.png",
    liveUsers: "1.6K",
    stars: "94",
    buildStatus: "stable",
    role: "Web · UX",
    year: "2024",
    corner: "tr",
    accent: "#a0b8c8",
  },
  {
    id: "cerebral-enigma",
    name: "CEREBRAL ENIGMA",
    description:
      "A long-form blog exploring technology, social issues, and psychology.",
    tags: ["Blog", "Editorial", "Insights"],
    image: "/celebralenigma.png",
    liveUsers: "900",
    stars: "67",
    buildStatus: "active",
    role: "Editorial · Blog",
    year: "2023",
    corner: "br",
    accent: "#b8c8a0",
  },
  {
    id: "wordle",
    name: "WORDLE",
    description:
      "A simple word-guessing game where players guess a 5-letter word in 6 attempts.",
    tags: ["React", "JavaScript", "HTML/CSS"],
    image: "/wordle.png",
    liveUsers: "1.1K",
    stars: "86",
    buildStatus: "active",
    role: "JavaScript · Game UI",
    year: "2025",
    corner: "bl",
    accent: "#68d8ab",
  },
  {
    id: "qcg-site",
    name: "QUANTUM COMPUTING GROUP",
    description:
      "Landing Page for QCG Club IIT Roorkee, showcasing the club and its activities.",
    tags: ["JavaScript", "HTML/CSS", "Tailwind CSS"],
    image: "/QCG-site.png",
    liveUsers: "780",
    stars: "59",
    buildStatus: "stable",
    role: "Landing Page · Tailwind",
    year: "2025",
    corner: "tl",
    accent: "#8bb6ff",
  },
];

const CORNER_CLASSES: Record<string, string> = {
  tl: "top-[20%] left-[8%]  sm:left-[16%] text-left",
  tr: "top-[20%] right-[8%] sm:right-[16%] text-right",
  bl: "top-[52%] left-[8%]  sm:left-[16%] text-left",
  br: "top-[52%] right-[8%] sm:right-[16%] text-right",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
const HOVER_SCALE = 0.005;
const LABEL_Z = 0.01;

function tesseractEdges(): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < 16; i++)
    for (let j = i + 1; j < 16; j++) {
      const xor = i ^ j;
      if (xor && (xor & (xor - 1)) === 0) edges.push([i, j]);
    }
  return edges;
}

function project4Dto3D(
  w4: [number, number, number, number][],
  a1: number,
  a2: number,
): THREE.Vector3[] {
  const [c1, s1, c2, s2] = [
    Math.cos(a1),
    Math.sin(a1),
    Math.cos(a2),
    Math.sin(a2),
  ];
  const wDist = 2.5;
  return w4.map(([x, y, z, w]) => {
    const x1 = x * c1 - w * s1,
      w1 = x * s1 + w * c1;
    const y1 = y * c2 - w1 * s2,
      w2 = y * s2 + w1 * c2;
    const s = 1 / (wDist - w2);
    return new THREE.Vector3(x1 * s, y1 * s, z * s);
  });
}

const VERTS_4D: [number, number, number, number][] = Array.from(
  { length: 16 },
  (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1],
);
const EDGES_4D = tesseractEdges();
function isInnerEdge(a: number, b: number) {
  return !!(a & 8) === !!(b & 8);
}

// ─── SlideText ────────────────────────────────────────────────────────────────
function SlideText({
  text,
  visible,
  className = "",
  delay = 0,
}: {
  text: string;
  visible: boolean;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLSpanElement>(".st-char");
    if (visible) {
      gsap.fromTo(
        chars,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.38,
          stagger: 0.018,
          ease: "power3.out",
          delay,
        },
      );
    } else {
      gsap.to(chars, {
        yPercent: -110,
        opacity: 0,
        duration: 0.22,
        stagger: 0.012,
        ease: "power2.in",
      });
    }
  }, [visible, delay]);
  return (
    <span
      ref={ref}
      className={`inline-flex overflow-hidden ${className}`}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span key={i} className="st-char inline-block" style={{ opacity: 0 }}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

// ─── ShuffleLabel ─────────────────────────────────────────────────────────────
function ShuffleLabel({
  name,
  onEnter,
  onLeave,
  delay = 0.3,
}: {
  name: string;
  onEnter?: () => void;
  onLeave?: () => void;
  delay?: number;
}) {
  const topRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const chars = name.split("");

  useEffect(() => {
    const top = topRef.current?.querySelectorAll<HTMLSpanElement>(".ch");
    if (!top) return;
    gsap.fromTo(
      top,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "power3.out",
        delay,
      },
    );
  }, [delay]);

  const hEnter = () => {
    onEnter?.();
    if (busy.current) return;
    busy.current = true;
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
        },
      })
      .to(topRef.current!.querySelectorAll(".ch"), {
        yPercent: -120,
        opacity: 0,
        duration: 0.22,
        stagger: 0.018,
        ease: "power2.in",
      })
      .fromTo(
        botRef.current!.querySelectorAll(".ch"),
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.22,
          stagger: 0.018,
          ease: "power2.out",
        },
        "<0.04",
      );
  };

  const hLeave = () => {
    onLeave?.();
    if (busy.current) return;
    busy.current = true;
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
        },
      })
      .to(botRef.current!.querySelectorAll(".ch"), {
        yPercent: 120,
        opacity: 0,
        duration: 0.2,
        stagger: 0.014,
        ease: "power2.in",
      })
      .fromTo(
        topRef.current!.querySelectorAll(".ch"),
        { yPercent: -120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.2,
          stagger: 0.014,
          ease: "power2.out",
        },
        "<0.04",
      );
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Barlow', sans-serif",
    fontSize: "clamp(0.62rem, 1.1vw, 0.92rem)",
    fontWeight: 300,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  };

  return (
    <div className="cursor-pointer" onMouseEnter={hEnter} onMouseLeave={hLeave}>
      <div
        className="relative"
        style={{ height: "1.35em", overflow: "hidden" }}
      >
        <span
          ref={topRef}
          className="flex items-center"
          style={{ ...labelStyle, color: "rgba(255,255,255,0.7)" }}
        >
          {chars.map((ch, i) => (
            <span key={i} className="ch inline-block" style={{ opacity: 0 }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
        <span
          ref={botRef}
          className="flex items-center absolute top-0 left-0 pointer-events-none"
          aria-hidden="true"
          style={{ ...labelStyle, letterSpacing: "0.24em", color: "#fff" }}
        >
          {chars.map((ch, i) => (
            <span key={i} className="ch inline-block opacity-0">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </div>
      <div
        className="mt-[7px] h-px w-full"
        style={{ background: "rgba(255,255,255,0.18)" }}
      />
    </div>
  );
}

// ─── ProjectLabel ─────────────────────────────────────────────────────────────
function ProjectLabel({
  project,
  onEnter,
  onLeave,
  labelRef,
}: {
  project: Project;
  onEnter: () => void;
  onLeave: () => void;
  labelRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={labelRef}
      className={`absolute z-10 ${CORNER_CLASSES[project.corner]}`}
    >
      <ShuffleLabel
        name={project.name}
        onEnter={onEnter}
        onLeave={onLeave}
        delay={0.3}
      />
    </div>
  );
}

// ─── Preview Card ─────────────────────────────────────────────────────────────
function PreviewCard({ project }: { project: Project }) {
  return (
    <div
      className="w-full h-full relative flex flex-col overflow-hidden"
      style={{
        background: "#080909",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 6,
      }}
    >
      {/* ── Image zone ── */}
      <div className="relative flex-shrink-0" style={{ height: "48%" }}>
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover object-top"
          style={{ display: "block" }}
        />
        {/* top-left corner accent */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: 18,
            height: 18,
            borderTop: `1.5px solid ${project.accent}`,
            borderLeft: `1.5px solid ${project.accent}`,
            borderRadius: "2px 0 0 0",
          }}
        />
        {/* top-right corner accent */}
        <div
          className="absolute top-0 right-0"
          style={{
            width: 18,
            height: 18,
            borderTop: `1.5px solid ${project.accent}`,
            borderRight: `1.5px solid ${project.accent}`,
            borderRadius: "0 2px 0 0",
          }}
        />
        {/* bottom fade into card body */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "60%",
            background:
              "linear-gradient(to bottom, transparent 0%, #080909 100%)",
          }}
        />
        {/* status pill */}
        <div className="absolute top-3 right-3">
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "0.38rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "3px 9px",
              borderRadius: 2,
              background:
                project.buildStatus === "active"
                  ? "rgba(80,220,120,0.12)"
                  : "rgba(140,170,255,0.12)",
              color:
                project.buildStatus === "active"
                  ? "rgba(100,230,140,0.95)"
                  : "rgba(160,185,255,0.95)",
              border: `1px solid ${
                project.buildStatus === "active"
                  ? "rgba(80,220,120,0.28)"
                  : "rgba(140,170,255,0.28)"
              }`,
              backdropFilter: "blur(6px)",
            }}
          >
            ● {project.buildStatus}
          </span>
        </div>
      </div>

      {/* ── Content zone ── */}
      <div
        className="flex flex-col flex-1 relative"
        style={{ padding: "14px 18px 16px" }}
      >
        {/* left accent bar */}
        <div
          className="absolute left-0 top-[18px]"
          style={{
            width: 2,
            height: 28,
            background: project.accent,
            opacity: 0.7,
            borderRadius: 1,
          }}
        />

        {/* year + role row */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 8 }}
        >
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "0.38rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            {project.year}
          </span>
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "0.38rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: project.accent,
              opacity: 0.7,
            }}
          >
            {project.role}
          </span>
        </div>

        {/* name */}
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: "clamp(0.82rem, 1.5vw, 1.05rem)",
            fontWeight: 500,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: 7,
          }}
        >
          {project.name}
        </div>

        {/* description */}
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: "0.58rem",
            fontWeight: 300,
            letterSpacing: "0.03em",
            color: "rgba(255,255,255,0.42)",
            lineHeight: 1.6,
            margin: 0,
            marginBottom: 12,
          }}
        >
          {project.description}
        </p>

        {/* tags */}
        <div className="flex flex-wrap" style={{ gap: 4, marginBottom: 14 }}>
          {project.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.37rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: project.accent,
                background: `${project.accent}0f`,
                border: `1px solid ${project.accent}30`,
                borderRadius: 2,
                padding: "2px 7px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* divider with centre dot */}
        <div
          className="relative flex items-center"
          style={{ marginBottom: 12 }}
        >
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }}
          />
          <div
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: project.accent,
              opacity: 0.5,
              margin: "0 6px",
            }}
          />
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }}
          />
        </div>

        {/* stats row */}
        <div className="flex items-center">
          <div className="flex items-baseline" style={{ gap: 4 }}>
            <span
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "0.01em",
              }}
            >
              {project.liveUsers}
            </span>
            <span
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.38rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              users
            </span>
          </div>

          <div
            style={{
              width: 1,
              height: 14,
              background: "rgba(255,255,255,0.1)",
              margin: "0 14px",
            }}
          />

          <div className="flex items-baseline" style={{ gap: 4 }}>
            <span
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "0.01em",
              }}
            >
              {project.stars}
            </span>
            <span
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "0.38rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              stars
            </span>
          </div>

          {/* double accent dash — far right */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 3,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 12,
                height: 1,
                background: project.accent,
                opacity: 0.3,
              }}
            />
            <div
              style={{
                width: 20,
                height: 1,
                background: project.accent,
                opacity: 0.7,
              }}
            />
          </div>
        </div>

        {/* bottom-right corner accent */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: 14,
            height: 14,
            borderBottom: `1.5px solid ${project.accent}`,
            borderRight: `1.5px solid ${project.accent}`,
            borderRadius: "0 0 4px 0",
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Works() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const asteroidRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const targetMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0.2, y: 0.4 });
  const cardRef = useRef<HTMLDivElement>(null);
  const hudTopRef = useRef<HTMLDivElement>(null);
  const hudNumRef = useRef<HTMLDivElement>(null);
  const subLabelRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const activeRef = useRef<Project | null>(null);
  const animating = useRef(false);
  const edgeLinesRef = useRef<THREE.LineSegments[]>([]);
  const angle1Ref = useRef(0);
  const angle2Ref = useRef(0);

  // ── Scroll entrance ────────────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    gsap.set([hudTopRef.current, hudNumRef.current, subLabelRef.current], {
      opacity: 0,
      y: 16,
    });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrapper, start: "top 75%", once: true },
    });
    tl.to([hudTopRef.current, hudNumRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: "power3.out",
    }).to(
      subLabelRef.current,
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      "-=0.2",
    );
    return () => {
      tl.scrollTrigger?.kill();
    };
  }, []);

  // ── Three.js ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!;
    const W = canvas.offsetWidth,
      H = canvas.offsetHeight;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const tg = new THREE.Group();
    scene.add(tg);
    asteroidRef.current = tg;

    const lines: THREE.LineSegments[] = [];
    EDGES_4D.forEach(([a, b]) => {
      const inner = isInnerEdge(a, b);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3),
      );
      const mat = new THREE.LineBasicMaterial({
        color: inner ? 0xaaddff : 0xffffff,
        transparent: true,
        opacity: inner ? 0.3 : 0.85,
      });
      const line = new THREE.LineSegments(geo, mat);
      line.renderOrder = inner ? 1 : 2;
      tg.add(line);
      lines.push(line);
    });
    edgeLinesRef.current = lines;

    tg.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 32, 32),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.18, 0.42, 0.85),
          transparent: true,
          opacity: 0.055,
          side: THREE.BackSide,
          depthWrite: false,
        }),
      ),
    );
    tg.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.5, 0.85, 1.0),
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
        }),
      ),
    );

    const dotGeo = new THREE.SphereGeometry(0.018, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    const dots: THREE.Mesh[] = Array.from({ length: 16 }, () => {
      const d = new THREE.Mesh(dotGeo, dotMat);
      tg.add(d);
      return d;
    });

    tg.rotation.set(0.25, 0.4, 0.08);

    const container = containerRef.current ?? document.body;
    const onMouse = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      targetMouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetMouse.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    container.addEventListener("mousemove", onMouse);

    let t = 0,
      last = performance.now();
    const tick = (now: number) => {
      frameRef.current = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      t += 0.004;
      angle1Ref.current += 0.007;
      angle2Ref.current += 0.011;
      const projected = project4Dto3D(
        VERTS_4D,
        angle1Ref.current,
        angle2Ref.current,
      );
      edgeLinesRef.current.forEach((line, i) => {
        const [a, b] = EDGES_4D[i];
        const arr = line.geometry.attributes.position.array as Float32Array;
        arr[0] = projected[a].x;
        arr[1] = projected[a].y;
        arr[2] = projected[a].z;
        arr[3] = projected[b].x;
        arr[4] = projected[b].y;
        arr[5] = projected[b].z;
        line.geometry.attributes.position.needsUpdate = true;
      });
      dots.forEach((d, i) => d.position.copy(projected[i]));
      const m = asteroidRef.current;
      if (m) {
        const k = 1 - Math.exp(-10 * dt);
        smoothMouse.current.x = lerp(
          smoothMouse.current.x,
          targetMouse.current.x,
          k,
        );
        smoothMouse.current.y = lerp(
          smoothMouse.current.y,
          targetMouse.current.y,
          k,
        );
        if (!activeRef.current && !animating.current) {
          m.rotation.y = t * 0.08 + smoothMouse.current.x * 0.5;
          m.rotation.x =
            0.4 + Math.sin(t * 0.5) * 0.03 + smoothMouse.current.y * 0.45;
          const rk = 1 - Math.exp(-4 * dt);
          m.position.x = lerp(m.position.x, smoothMouse.current.x * 0.28, rk);
          m.position.y = lerp(
            m.position.y,
            Math.sin(t) * 0.05 + smoothMouse.current.y * 0.22,
            rk,
          );
          m.position.z = lerp(m.position.z, 0, rk);
        } else {
          m.rotation.y += 0.002;
          m.rotation.x += 0.001;
        }
      }
      renderer.render(scene, camera);
    };
    tick(performance.now());

    const onResize = () => {
      const w2 = canvas.offsetWidth,
        h2 = canvas.offsetHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // ── Hover handlers ─────────────────────────────────────────────────────────
  const labelStartWorld = (
    el: HTMLElement,
    corner: Project["corner"],
  ): THREE.Vector3 => {
    const camera = cameraRef.current!,
      container = containerRef.current!;
    const cr = container.getBoundingClientRect(),
      er = el.getBoundingClientRect();
    const isRight = corner === "tr" || corner === "br";
    const vec = new THREE.Vector3(
      (((isRight ? er.right + 6 : er.left - 6) - cr.left) / cr.width) * 2 - 1,
      -(((er.top + er.height / 2 - cr.top) / cr.height) * 2 - 1),
      LABEL_Z,
    );
    vec.unproject(camera);
    return vec;
  };

  const handleEnter = (project: Project) => {
    if (activeRef.current?.id === project.id) return;
    activeRef.current = project;
    animating.current = true;
    setActiveProject(project);
    const asteroid = asteroidRef.current;
    if (!asteroid) return;
    gsap.killTweensOf(asteroid.scale);
    gsap.killTweensOf(asteroid.position);
    const labelEl = labelRefs.current[project.id];
    const tp = labelEl
      ? labelStartWorld(labelEl, project.corner)
      : { x: 0, y: 0, z: 0 };
    gsap
      .timeline({
        onComplete: () => {
          animating.current = false;
        },
      })
      .to(
        asteroid.scale,
        {
          x: HOVER_SCALE,
          y: HOVER_SCALE,
          z: HOVER_SCALE,
          duration: 0.38,
          ease: "power3.in",
        },
        0,
      )
      .to(
        asteroid.position,
        { x: tp.x, y: tp.y, z: tp.z, duration: 0.48, ease: "power3.out" },
        0.28,
      );
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.25,
      },
    );
  };

  const handleLeave = () => {
    if (!activeRef.current) return;
    activeRef.current = null;
    animating.current = true;
    const asteroid = asteroidRef.current;
    if (!asteroid) return;
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 10,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setActiveProject(null),
    });
    gsap.killTweensOf(asteroid.scale);
    gsap.killTweensOf(asteroid.position);
    gsap
      .timeline({
        onComplete: () => {
          animating.current = false;
        },
      })
      .to(
        asteroid.position,
        { x: 0, y: 0, z: 0, duration: 1.25, ease: "power2.inOut" },
        0,
      )
      .to(
        asteroid.scale,
        { x: 1, y: 1, z: 1, duration: 1.1, ease: "power2.inOut" },
        0.15,
      );
  };

  const mainProjects = PROJECTS.slice(0, 4);
  const extraProjects = PROJECTS.slice(4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400&display=swap');
        @keyframes grain {
          0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 30%{transform:translate(3%,2%)}
          50%{transform:translate(-1%,3%)}  70%{transform:translate(2%,-2%)}  90%{transform:translate(-3%,1%)}
        }
      `}</style>

      <div ref={wrapperRef} className="w-full">
        <div
          ref={containerRef}
          className="relative w-screen h-screen overflow-hidden bg-[#060606]"
        >
          {/* Smoky BG */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div
              className="absolute -left-[10%] top-[30%] w-[55%] h-[45%] blur-[40px]"
              style={{
                background:
                  "radial-gradient(ellipse,rgba(28,35,18,0.9) 0%,transparent 70%)",
              }}
            />
            <div
              className="absolute -right-[5%] top-[25%] w-[50%] h-[50%] blur-[50px]"
              style={{
                background:
                  "radial-gradient(ellipse,rgba(22,30,15,0.75) 0%,transparent 70%)",
              }}
            />
            <div
              className="absolute left-[20%] top-[15%] w-[60%] h-[70%] blur-[60px]"
              style={{
                background:
                  "radial-gradient(ellipse,rgba(18,24,12,0.65) 0%,transparent 65%)",
              }}
            />
            <div
              className="absolute opacity-35 mix-blend-overlay"
              style={{
                inset: "-50%",
                width: "200%",
                height: "200%",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                animation: "grain 0.5s steps(1) infinite",
              }}
            />
          </div>

          {/* HUD */}
          <div
            ref={hudTopRef}
            className="absolute top-5 left-1/2 -translate-x-1/2 z-10"
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            ( WORKS. )
          </div>
          <div
            ref={hudNumRef}
            className="absolute top-5 right-7 z-10"
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.35)",
            }}
          >{`[ N.${String(PROJECTS.length).padStart(3, "0")} ]`}</div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-[2]"
          />

          {/* Corner labels */}
          {mainProjects.map((project) => (
            <ProjectLabel
              key={project.id}
              project={project}
              onEnter={() => handleEnter(project)}
              onLeave={handleLeave}
              labelRef={(el) => {
                labelRefs.current[project.id] = el;
              }}
            />
          ))}

          {/* Extra projects — bottom strip */}
          {extraProjects.length > 0 && (
            <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2 z-10 flex items-center gap-8">
              {extraProjects.map((project) => (
                <div
                  key={project.id}
                  ref={(el) => {
                    labelRefs.current[project.id] = el;
                  }}
                  onMouseEnter={() => handleEnter(project)}
                  onMouseLeave={handleLeave}
                >
                  <ShuffleLabel name={project.name} delay={0.4} />
                </div>
              ))}
            </div>
          )}

          {/* Sub-label */}
          <div
            ref={subLabelRef}
            className="absolute bottom-[22%] left-[55%] z-10 leading-[1.7]"
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            SOME OF THE LATEST
            <br />
            PROJECTS
          </div>

          {/* Preview card */}
          <div
            ref={cardRef}
            className="pointer-events-none will-change-transform absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 opacity-0"
            style={{
              width: "clamp(240px,26vw,360px)",
              aspectRatio: "3/4",
              borderRadius: 6,
              overflow: "hidden",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.92), 0 8px 24px rgba(0,0,0,0.6)",
            }}
          >
            {activeProject && <PreviewCard project={activeProject} />}
          </div>
        </div>
      </div>
    </>
  );
}
