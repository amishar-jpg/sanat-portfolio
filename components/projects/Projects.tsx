"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

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

const CORNER_STYLE: Record<string, React.CSSProperties> = {
  tl: { top: "20%", left: "16%", textAlign: "left" },
  tr: { top: "20%", right: "16%", textAlign: "right" },
  bl: { top: "48%", left: "16%", textAlign: "left" },
  br: { top: "48%", right: "16%", textAlign: "right" },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const HOVER_SCALE = 0.005;
const LABEL_Z = 0.01;

// ── TESSERACT (4D hypercube) helpers ──────────────────────────────────────────
// 16 vertices of a 4D unit hypercube projected to 3D via perspective projection
function tesseractEdges(): [number, number][] {
  // All pairs of vertices that differ in exactly one bit (i.e. share an edge in 4D)
  const edges: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      // XOR — if exactly one bit differs they are connected
      const xor = i ^ j;
      if (xor && (xor & (xor - 1)) === 0) edges.push([i, j]);
    }
  }
  return edges;
}

function project4Dto3D(
  w4: [number, number, number, number][],
  angle1: number,
  angle2: number,
): THREE.Vector3[] {
  // Rotate in two 4D planes (XW and YW) then perspective-project W → 3D
  const cos1 = Math.cos(angle1),
    sin1 = Math.sin(angle1);
  const cos2 = Math.cos(angle2),
    sin2 = Math.sin(angle2);
  const wDist = 2.5; // perspective distance in W dimension

  return w4.map(([x, y, z, w]) => {
    // Rotate in XW plane
    const x1 = x * cos1 - w * sin1;
    const w1 = x * sin1 + w * cos1;
    // Rotate in YW plane
    const y1 = y * cos2 - w1 * sin2;
    const w2 = y * sin2 + w1 * cos2;
    // Perspective divide
    const s = 1 / (wDist - w2);
    return new THREE.Vector3(x1 * s, y1 * s, z * s);
  });
}

// Build 4D vertices (all combinations of ±1 in 4 dims)
const VERTS_4D: [number, number, number, number][] = Array.from(
  { length: 16 },
  (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1],
);
const EDGES_4D = tesseractEdges();

// Classify each edge as "inner" (both verts have w=1 or both w=-1 in same 4D cube)
// We use a simple heuristic: inner cube = all verts with w < 0 (bit 3 clear)
function isInnerEdge(a: number, b: number): boolean {
  return !!(a & 8) === !!(b & 8);
}
// ── END TESSERACT HELPERS ─────────────────────────────────────────────────────

export default function Works() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const asteroidRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const targetMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0.2, y: 0.4 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const activeRef = useRef<Project | null>(null);
  const animating = useRef(false);

  // Refs for tesseract line geometry so we can update them each frame
  const edgeLinesRef = useRef<THREE.LineSegments[]>([]);
  const angle1Ref = useRef(0);
  const angle2Ref = useRef(0);

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

    // ── TESSERACT GROUP ───────────────────────────────────────────────────────
    const tesseractGroup = new THREE.Group();
    scene.add(tesseractGroup);
    asteroidRef.current = tesseractGroup;

    // Pre-create one LineSegments per edge (so we can update positions each frame)
    const lines: THREE.LineSegments[] = [];
    EDGES_4D.forEach(([a, b]) => {
      const inner = isInnerEdge(a, b);
      const geo = new THREE.BufferGeometry();
      // Two points per line segment
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3),
      );

      const mat = new THREE.LineBasicMaterial({
        color: inner ? 0xaaddff : 0xffffff,
        transparent: true,
        opacity: inner ? 0.3 : 0.85,
        linewidth: 1,
      });
      const line = new THREE.LineSegments(geo, mat);
      line.renderOrder = inner ? 1 : 2;
      tesseractGroup.add(line);
      lines.push(line);
    });
    edgeLinesRef.current = lines;

    // Outer glow sphere behind tesseract
    const glowGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.18, 0.42, 0.85),
      transparent: true,
      opacity: 0.055,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.renderOrder = 0;
    tesseractGroup.add(glowMesh);

    // Very faint inner core sphere
    const coreGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.5, 0.85, 1.0),
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.renderOrder = 3;
    tesseractGroup.add(coreMesh);

    // Vertex dots
    const dotGeo = new THREE.SphereGeometry(0.018, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    const dotMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 16; i++) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      tesseractGroup.add(dot);
      dotMeshes.push(dot);
    }

    // Initial rotation
    tesseractGroup.rotation.set(0.25, 0.4, 0.08);
    // ── END TESSERACT ─────────────────────────────────────────────────────────

    // ── Mouse tracking ────────────────────────────────────────────────────────
    const container = containerRef.current ?? document.body;
    const onMouse = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      targetMouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetMouse.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    container.addEventListener("mousemove", onMouse);

    // ── Render loop ───────────────────────────────────────────────────────────
    let t = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frameRef.current = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      t += 0.004;

      // Advance 4D rotation angles
      angle1Ref.current += 0.007;
      angle2Ref.current += 0.011;

      // Re-project tesseract vertices and update line geometry
      const projected = project4Dto3D(
        VERTS_4D,
        angle1Ref.current,
        angle2Ref.current,
      );
      edgeLinesRef.current.forEach((line, i) => {
        const [a, b] = EDGES_4D[i];
        const pa = projected[a];
        const pb = projected[b];
        const arr = line.geometry.attributes.position.array as Float32Array;
        arr[0] = pa.x;
        arr[1] = pa.y;
        arr[2] = pa.z;
        arr[3] = pb.x;
        arr[4] = pb.y;
        arr[5] = pb.z;
        line.geometry.attributes.position.needsUpdate = true;
      });
      // Update vertex dot positions
      dotMeshes.forEach((dot, i) => {
        dot.position.copy(projected[i]);
      });

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
          const rotY = t * 0.08 + smoothMouse.current.x * 0.5;
          const rotX =
            0.4 + Math.sin(t * 0.5) * 0.03 + smoothMouse.current.y * 0.45;
          m.rotation.y = rotY;
          m.rotation.x = rotX;

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
    const targetPos = labelEl
      ? labelStartWorld(labelEl, project.corner)
      : { x: 0, y: 0, z: 0 };

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
    );

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
    tl.to(
      asteroid.position,
      { x: 0, y: 0, z: 0, duration: 1.25, ease: "power2.inOut" },
      0,
    );
    tl.to(
      asteroid.scale,
      { x: 1, y: 1, z: 1, duration: 1.1, ease: "power2.inOut" },
      0.15,
    );
  };

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
          0%,100% { transform:translate(0,0) }
          10%      { transform:translate(-2%,-3%) }
          30%      { transform:translate(3%,2%) }
          50%      { transform:translate(-1%,3%) }
          70%      { transform:translate(2%,-2%) }
          90%      { transform:translate(-3%,1%) }
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
        {/* Smoky background */}
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

        {/* HUD labels */}
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

        {/* Three.js canvas */}
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

        {/* 4 corner project labels */}
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
            onMouseEnter={() => handleEnter(project)}
            onMouseLeave={handleLeave}
          >
            <span className="proj-label">{project.name}</span>
          </div>
        ))}

        {/* Mosaic — bottom center */}
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
          onMouseEnter={() => handleEnter(mosaicProject)}
          onMouseLeave={handleLeave}
        >
          <span className="proj-label">{mosaicProject.name}</span>
        </div>

        {/* Sub-label */}
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

        {/* Preview card */}
        <div
          ref={cardRef}
          className="preview-card"
          style={{
            position: "absolute",
            left: "50%",
            top: "28%",
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
                  "linear-gradient(160deg,#0d0f18 0%,#111520 45%,#0a0c14 100%)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
              }}
            >
              {/* film grain overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                  opacity: 0.55,
                  mixBlendMode: "overlay",
                }}
              />
              {/* subtle cyan edge glow matching black hole palette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(40,120,180,0.12) 0%, transparent 70%)",
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
