"use client";

/**
 * Works.tsx — Max Milkin style Works section
 *
 * Changes from previous version:
 *  1. Asteroid is smaller (baseRadius 1.08 → 0.82) and olive-green tinted
 *  2. On hover: asteroid FIRST shrinks, THEN moves to the START of the hovered
 *     project name label (left edge for left-aligned, right edge for right-aligned)
 *  3. On leave: asteroid moves back to center, THEN scales back to full size
 *
 * Tech Stack:
 *  - Next.js 14 (App Router, "use client")
 *  - TypeScript
 *  - Tailwind CSS
 *  - Three.js  — 3D asteroid
 *  - GSAP      — sequenced hover transitions
 *
 * Install:  npm install three gsap @types/three
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  name: string;
  role: string;
  year: string;
  corner: "tl" | "tr" | "bl" | "br";
  accent: string;
  previewLabel: string;
  previewSub: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: "olha",
    name: "OLHA LAZARIEVA",
    role: "Frontend · Design",
    year: "2024",
    corner: "tl",
    accent: "#c8b89a",
    previewLabel: "VISUAL IDENTITY",
    previewSub: "PERSONAL PORTFOLIO",
  },
  {
    id: "max",
    name: "MAX MILKIN",
    role: "Full-stack · Creative",
    year: "2024",
    corner: "tr",
    accent: "#a0b8c8",
    previewLabel: "CREATIVE DEV",
    previewSub: "PORTFOLIO SITE",
  },
  {
    id: "two",
    name: "TWO CAPITALS STUDIO",
    role: "Frontend · Motion",
    year: "2023",
    corner: "bl",
    accent: "#b8c8a0",
    previewLabel: "STUDIO WEBSITE",
    previewSub: "MOTION & IDENTITY",
  },
  {
    id: "raine",
    name: "RAINE ARCHITECTS",
    role: "Frontend · 3D",
    year: "2023",
    corner: "br",
    accent: "#c8c8c8",
    previewLabel: "INNOVATIVE DESIGN",
    previewSub: "TIMELESS ARCHITECTURE",
  },
  {
    id: "mosaic",
    name: "MOSAIC OF CULTURES",
    role: "Frontend · Interactive",
    year: "2023",
    corner: "bl",
    accent: "#c8a8b8",
    previewLabel: "CULTURAL MOSAIC",
    previewSub: "INTERACTIVE EXPERIENCE",
  },
];

// ─── Corner CSS positions ─────────────────────────────────────────────────────
const CORNER_STYLE: Record<string, React.CSSProperties> = {
  tl: { top: "20%", left: "16%", textAlign: "left" },
  tr: { top: "20%", right: "16%", textAlign: "right" },
  bl: { top: "48%", left: "16%", textAlign: "left" },
  br: { top: "48%", right: "16%", textAlign: "right" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function fbm(x: number, y: number, z: number): number {
  let v = 0,
    a = 0.5;
  for (let i = 0; i < 5; i++) {
    v += a * (Math.sin(x * 1.7 + y * 2.3 + z * 1.1) * 0.5 + 0.5);
    x *= 2.1;
    y *= 2.1;
    z *= 2.1;
    a *= 0.5;
  }
  return v;
}

// Asteroid size when hovering — extremely small (text-sized) in front of label
const HOVER_SCALE = 0.005;
// NDC depth so asteroid sits in front of the label on screen
const LABEL_Z = 0.01;

// ─── Component ────────────────────────────────────────────────────────────────
export default function Works() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const asteroidRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  // label element refs — keyed by project id
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const targetMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0.2, y: 0.4 });

  const cardRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const activeRef = useRef<Project | null>(null);

  // Is a hover sequence currently running? Guard against race conditions.
  const animating = useRef(false);

  // ── Three.js setup ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

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

    // ── Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const key = new THREE.DirectionalLight(0xfff3cc, 2.2);
    key.position.set(4, 5, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x88aa66, 0.55); // olive-tinted fill
    fill.position.set(-3, -2, 2);
    scene.add(fill);

    const rim = new THREE.PointLight(0xaaccaa, 1.1, 14); // greenish rim
    rim.position.set(0, -3, -2);
    scene.add(rim);

    const back = new THREE.PointLight(0x446633, 0.4, 20);
    back.position.set(-2, 1, -4);
    scene.add(back);

    // ── Geometry — smaller base radius ────────────────────────────────────
    const baseRadius = 0.82; // was 1.08 — noticeably smaller
    const geo = new THREE.IcosahedronGeometry(baseRadius, 6);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        y = pos.getY(i),
        z = pos.getZ(i);
      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len,
        ny = y / len,
        nz = z / len;
      const d =
        0.38 * fbm(nx * 2.8, ny * 2.8, nz * 2.8) +
        0.18 * fbm(nx * 6.1, ny * 6.1, nz * 6.1) +
        0.08 * Math.sin(ny * 8) -
        0.04;
      const r = baseRadius + d;
      pos.setXYZ(i, nx * r, ny * r, nz * r);
    }
    geo.computeVertexNormals();

    // ── Material — olive-green colour scheme ──────────────────────────────
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x3a4a28), // olive green base
      roughness: 0.82,
      metalness: 0.18,
      vertexColors: true,
    });

    // Vertex colours: olive / moss / dark-khaki variation
    const cols: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        y = pos.getY(i),
        z = pos.getZ(i);
      const v1 = fbm(x * 3, y * 3, z * 3);
      const v2 = fbm(x * 7 + 10, y * 7, z * 7);
      // R channel: olive (0.22–0.38)
      const r = 0.22 + v1 * 0.14 + v2 * 0.02;
      // G channel: slightly higher (0.28–0.46) — the green in olive
      const g = 0.28 + v1 * 0.16 + v2 * 0.02;
      // B channel: low (0.08–0.16)
      const b = 0.08 + v1 * 0.07 + v2 * 0.01;
      cols.push(r, g, b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));

    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.set(0.4, 0.2, 0.1);
    scene.add(mesh);
    asteroidRef.current = mesh;

    // ── Mouse tracking ─────────────────────────────────────────────────────
    const container = containerRef.current ?? document.body;
    const onMouse = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      targetMouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetMouse.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    container.addEventListener("mousemove", onMouse);

    // ── Render loop ────────────────────────────────────────────────────────
    let t = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frameRef.current = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      t += 0.004;

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

        const idle = !activeRef.current && !animating.current;

        if (idle) {
          // Mouse-interactive rotation: asteroid tilts toward cursor
          const rotY = t * 0.08 + smoothMouse.current.x * 0.5;
          const rotX =
            0.4 + Math.sin(t * 0.5) * 0.03 + smoothMouse.current.y * 0.45;
          m.rotation.y = rotY;
          m.rotation.x = rotX;

          // Mouse-interactive position: subtle drift toward cursor (parallax)
          const driftX = smoothMouse.current.x * 0.28;
          const driftY = Math.sin(t) * 0.05 + smoothMouse.current.y * 0.22;
          const rk = 1 - Math.exp(-4 * dt);
          m.position.x = lerp(m.position.x, driftX, rk);
          m.position.y = lerp(m.position.y, driftY, rk);
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
      const W2 = canvas.offsetWidth,
        H2 = canvas.offsetHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // ── Start of project name (left edge for left-aligned, right for right-aligned) → world pos ─
  const labelStartWorld = (
    el: HTMLElement,
    corner: Project["corner"],
  ): THREE.Vector3 => {
    const camera = cameraRef.current!;
    const container = containerRef.current!;
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();

    const isRight = corner === "tr" || corner === "br";
    const startX = isRight ? er.right + 6 : er.left - 6;
    const centerY = er.top + er.height / 2;

    const ndcX = ((startX - cr.left) / cr.width) * 2 - 1;
    const ndcY = -(((centerY - cr.top) / cr.height) * 2 - 1);

    const vec = new THREE.Vector3(ndcX, ndcY, LABEL_Z);
    vec.unproject(camera);
    return vec;
  };

  // ── Hover enter: shrink FIRST, then move ──────────────────────────────
  const handleEnter = (project: Project, e: React.MouseEvent) => {
    if (activeRef.current?.id === project.id) return;
    activeRef.current = project;
    animating.current = true;
    setActiveProject(project);

    const asteroid = asteroidRef.current;
    if (!asteroid) return;

    // Stop any ongoing tweens
    gsap.killTweensOf(asteroid.scale);
    gsap.killTweensOf(asteroid.position);

    const labelEl = labelRefs.current[project.id];
    const targetPos = labelEl
      ? labelStartWorld(labelEl, project.corner)
      : { x: 0, y: 0, z: 0 };

    // ── Phase 1: shrink in place (0 → 0.35s) ──────────────────────────
    // ── Phase 2: move to label start (starts at 0.28s, slight overlap) ─
    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
      },
    });

    tl.to(
      asteroid.scale,
      {
        x: HOVER_SCALE,
        y: HOVER_SCALE,
        z: HOVER_SCALE,
        duration: 0.38,
        ease: "power3.in",
      },
      0,
    );

    tl.to(
      asteroid.position,
      {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 0.48,
        ease: "power3.out",
      },
      0.28,
    ); // starts slightly before shrink finishes → feels snappy

    // Card: fade in
    gsap.killTweensOf(cardRef.current);
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

  // ── Hover leave: slowly move back to center, then grow back ────────────────
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

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
      },
    });

    // Slow return to center
    tl.to(
      asteroid.position,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.25,
        ease: "power2.inOut",
      },
      0,
    );

    tl.to(
      asteroid.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.1,
        ease: "power2.inOut",
      },
      0.15,
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────
  const mainProjects = PROJECTS.filter((p) => p.id !== "mosaic");
  const mosaicProject = PROJECTS.find((p) => p.id === "mosaic")!;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #060606; color: #fff; overflow-x: hidden; }

        .proj-label {
          font-family: 'Barlow', sans-serif;
          font-size: clamp(0.7rem, 1.1vw, 0.92rem);
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: color 0.25s, letter-spacing 0.3s;
          white-space: nowrap;
          position: relative;
          display: inline-block;
        }
        .proj-label::after {
          content: '';
          position: absolute;
          bottom: -7px; left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.2);
          transition: background 0.3s, transform 0.4s;
          transform-origin: left;
        }
        .proj-label:hover { color: #fff; letter-spacing: 0.24em; }
        .proj-label:hover::after { background: rgba(255,255,255,0.65); }

        .preview-card { pointer-events: none; will-change: transform, opacity; }

        @keyframes grain {
          0%,100% { transform:translate(0,0)    }
          10%      { transform:translate(-2%,-3%) }
          30%      { transform:translate(3%,2%)   }
          50%      { transform:translate(-1%,3%)  }
          70%      { transform:translate(2%,-2%)  }
          90%      { transform:translate(-3%,1%)  }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          background: "#060606",
          overflow: "hidden",
        }}
      >
        {/* ── Smoky background ──────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-10%",
              top: "30%",
              width: "55%",
              height: "45%",
              background:
                "radial-gradient(ellipse,rgba(28,35,18,0.9) 0%,transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "-5%",
              top: "25%",
              width: "50%",
              height: "50%",
              background:
                "radial-gradient(ellipse,rgba(22,30,15,0.75) 0%,transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "20%",
              top: "15%",
              width: "60%",
              height: "70%",
              background:
                "radial-gradient(ellipse,rgba(18,24,12,0.65) 0%,transparent 65%)",
              filter: "blur(60px)",
            }}
          />
          {/* film grain */}
          <div
            style={{
              position: "absolute",
              inset: "-50%",
              width: "200%",
              height: "200%",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
              animation: "grain 0.5s steps(1) infinite",
              opacity: 0.35,
              mixBlendMode: "overlay",
            }}
          />
        </div>

        {/* ── HUD labels ────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Barlow',sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            zIndex: 10,
          }}
        >
          ( WORKS. )
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 28,
            fontFamily: "'Barlow',sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.35)",
            zIndex: 10,
          }}
        >
          [ N.004 ]
        </div>

        {/* ── Three.js canvas ───────────────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        />

        {/* ── 4 corner project labels ───────────────────────────────────── */}
        {mainProjects.map((project) => (
          <div
            key={project.id}
            ref={(el) => {
              labelRefs.current[project.id] = el;
            }}
            style={{
              position: "absolute",
              zIndex: 10,
              ...CORNER_STYLE[project.corner],
            }}
            onMouseEnter={(e) => handleEnter(project, e)}
            onMouseLeave={handleLeave}
          >
            <span className="proj-label">{project.name}</span>
          </div>
        ))}

        {/* ── Mosaic — bottom center ─────────────────────────────────────── */}
        <div
          ref={(el) => {
            labelRefs.current[mosaicProject.id] = el;
          }}
          style={{
            position: "absolute",
            bottom: "12%",
            left: "50%",
            transform: "translateX(-30%)",
            zIndex: 10,
          }}
          onMouseEnter={(e) => handleEnter(mosaicProject, e)}
          onMouseLeave={handleLeave}
        >
          <span className="proj-label">{mosaicProject.name}</span>
        </div>

        {/* ── Sub-label ─────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: "22%",
            left: "55%",
            zIndex: 10,
            fontFamily: "'Barlow',sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            lineHeight: 1.7,
          }}
        >
          SOME OF THE LATEST
          <br />
          PROJECTS
        </div>

        {/* ── Preview card ──────────────────────────────────────────────── */}
        <div
          ref={cardRef}
          className="preview-card"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 20,
            opacity: 0,
            width: "clamp(250px,21vw,310px)",
            aspectRatio: "4/3",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.88)",
          }}
        >
          {activeProject && (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg,#191c14 0%,#22271a 50%,#191c14 100%)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
              }}
            >
              {/* noise */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                  opacity: 0.55,
                  mixBlendMode: "overlay",
                }}
              />
              {/* bottom gradient */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "45%",
                  background:
                    "linear-gradient(to top,rgba(0,0,0,0.65),transparent)",
                }}
              />
              {/* architectural bars */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8%",
                  left: "5%",
                  right: "5%",
                  display: "grid",
                  gridTemplateColumns: "repeat(8,1fr)",
                  gap: "3px",
                  height: "35%",
                }}
              >
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: `rgba(180,200,140,${0.025 + (i % 4) * 0.018})`,
                      borderRadius: "1px",
                      transform: `scaleY(${0.3 + Math.sin(i * 0.7) * 0.5 + 0.5})`,
                      transformOrigin: "bottom",
                    }}
                  />
                ))}
              </div>
              {/* nav dots */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  right: 12,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === 0 ? 20 : 6,
                      height: 1,
                      background: `rgba(255,255,255,${i === 0 ? 0.65 : 0.2})`,
                    }}
                  />
                ))}
              </div>
              {/* text */}
              <div
                style={{ position: "relative", zIndex: 2, textAlign: "center" }}
              >
                <div
                  style={{
                    fontFamily: "'Barlow',sans-serif",
                    fontSize: "clamp(0.88rem,1.9vw,1.12rem)",
                    fontWeight: 400,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: 5,
                  }}
                >
                  {activeProject.previewLabel}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow',sans-serif",
                    fontSize: "clamp(0.62rem,1.1vw,0.78rem)",
                    fontWeight: 300,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: `${activeProject.accent}cc`,
                  }}
                >
                  {activeProject.previewSub}
                </div>
              </div>
              {/* meta */}
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 16,
                  right: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Barlow',sans-serif",
                    fontSize: "0.5rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.28)",
                  }}
                >
                  {activeProject.role}
                </span>
                <span
                  style={{
                    fontFamily: "'Barlow',sans-serif",
                    fontSize: "0.5rem",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.28)",
                  }}
                >
                  {activeProject.year}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
