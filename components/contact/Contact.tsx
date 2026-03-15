"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";

/* ─── GSAP char-split helper ─────────────────────────────────────── */
function splitChars(el: HTMLElement) {
  const text = el.textContent ?? "";
  el.innerHTML = "";
  el.setAttribute("aria-label", text);
  return text.split("").map((ch) => {
    const outer = document.createElement("span");
    outer.style.cssText = "display:inline-block;overflow:hidden;line-height:1.1;";
    const inner = document.createElement("span");
    inner.textContent = ch === " " ? "\u00A0" : ch;
    inner.style.display = "inline-block";
    outer.appendChild(inner);
    el.appendChild(outer);
    return inner;
  });
}

/* ─── ContactPill component ──────────────────────────────────────── */
function ContactPill({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      initial="initial"
      whileHover="hover"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px 36px",
        borderRadius: "100px",
        border: "1px solid rgba(255,255,255,0.22)",
        color: "#fff",
        textDecoration: "none",
        fontSize: "clamp(13px, 1.3vw, 17px)",
        letterSpacing: "0.01em",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <motion.span
        variants={{
          initial: { y: "102%" },
          hover: { y: "0%" }
        }}
        transition={{ duration: 0.44, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: "#5252f5",
          borderRadius: "inherit",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </motion.a>
  );
}

/* ─── SocialLink with premium roll & wipe ───────────────────────── */
function SocialLink({ label }: { label: string }) {
  return (
    <motion.a
      href="#"
      initial="initial"
      whileHover="hover"
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        textDecoration: "none",
        cursor: "pointer",
        paddingBottom: 4,
      }}
    >
      <motion.span
        variants={{
          initial: { y: 0, color: "rgba(255,255,255,0.55)" },
          hover: { y: "-100%", color: "#ffffff" }
        }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        style={{ display: "block", fontSize: 13, lineHeight: 1.2 }}
      >
        {label}
      </motion.span>
      <motion.span
        variants={{
          initial: { y: 0, color: "rgba(255,255,255,0.55)" },
          hover: { y: "-100%", color: "#ffffff" }
        }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: "absolute", top: "100%", left: 0, display: "block", fontSize: 13, lineHeight: 1.2, whiteSpace: "nowrap" }}
      >
        {label}
      </motion.span>
      {/* Wipe underline */}
      <motion.div
        variants={{
          initial: { scaleX: 0, transformOrigin: "left" },
          hover: { scaleX: 1, transformOrigin: "left" }
        }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(255,255,255,0.8)",
        }}
      />
    </motion.a>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function Connect() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(600);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 180, mass: 0.6 });

  const [lineY, setLineY] = useState(0);
  const [time, setTime] = useState("");

  /* live clock */
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* measure line Y */
  useEffect(() => {
    const measure = () => {
      if (!lineRef.current || !sectionRef.current) return;
      const lr = lineRef.current.getBoundingClientRect();
      const sr = sectionRef.current.getBoundingClientRect();
      setLineY(lr.top - sr.top);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* track mouse X */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) =>
      mouseX.set(e.clientX - section.getBoundingClientRect().left);
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [mouseX]);

  /* GSAP: split h1 chars entrance */
  useEffect(() => {
    if (!h1Ref.current) return;
    const chars = splitChars(h1Ref.current);
    gsap.fromTo(
      chars,
      { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.022, delay: 0.15 }
    );
  }, []);

  /* GSAP: subtitle + pills fade-up */
  useEffect(() => {
    if (!subRef.current || !pillsRef.current) return;
    gsap.fromTo(
      [subRef.current, pillsRef.current],
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: "power2.out", stagger: 0.12, delay: 0.75 }
    );
  }, []);

  /* h1 hover: chars scatter */
  const onH1Enter = () => {
    if (!h1Ref.current) return;
    const inners = Array.from(h1Ref.current.querySelectorAll("span > span")) as HTMLElement[];
    gsap.to(inners, {
      yPercent: () => gsap.utils.random(-55, 55),
      xPercent: () => gsap.utils.random(-25, 25),
      opacity: 0.25,
      duration: 0.32,
      ease: "power2.out",
      stagger: { each: 0.012, from: "random" },
    });
  };

  const onH1Leave = () => {
    if (!h1Ref.current) return;
    const inners = Array.from(h1Ref.current.querySelectorAll("span > span")) as HTMLElement[];
    gsap.to(inners, {
      yPercent: 0,
      xPercent: 0,
      opacity: 1,
      duration: 0.6,
      ease: "elastic.out(1,0.55)",
      stagger: { each: 0.01, from: "random" },
    });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000000ff",
        color: "#ffffff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px 44px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* subtle grain overlay */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.04, zIndex: 0 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>

        {/* headline row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
          {/* avatar */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              width: 68, height: 68, borderRadius: "50%",
              overflow: "hidden", flexShrink: 0, marginTop: 14,
              background: "#2a2a2a",
              border: "1.5px solid rgba(255,255,255,0.12)",
            }}
          >
            <img src="Sanat_2.jpg" alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>

          {/* headline — GSAP split */}
          <h1
            ref={h1Ref}
            onMouseEnter={onH1Enter}
            onMouseLeave={onH1Leave}
            style={{
              fontSize: "clamp(52px, 7.5vw, 108px)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              margin: 0,
              cursor: "default",
              userSelect: "none",
            }}
          >
            Let's work together
          </h1>
        </div>

        {/* subtitle */}
        <p
          ref={subRef}
          style={{
            fontSize: "clamp(11px, 1vw, 13px)",
            color: "rgba(255,255,255,0.32)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "18px 5px 0 0",
            opacity: 0,
          }}
        >
          Stay in Touch...
        </p>

        {/* ── DIVIDER LINE ── */}
        <div
          ref={lineRef}
          style={{
            width: "100%",
            height: "1px",
            background: "linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.18) 20%,rgba(255,255,255,0.18) 80%,rgba(255,255,255,0) 100%)",
            margin: "50px 0 56px",
          }}
        />

        {/* contact pills */}
        <div ref={pillsRef} style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: 0 }}>
          <ContactPill label="sanatjha4@gmail.com" href="mailto:sanatjha4@gmail.com" />
          <ContactPill label="+91 88829 44464" href="tel:+918882944464" />
        </div>
      </div>

      {/* ── BLUE BALL — locked to line Y, slides on X ── */}
      <motion.div
        style={{
          position: "absolute",
          left: smoothX,
          top: lineY,
          translateX: "-50%",
          translateY: "-50%",
          width: 115,
          height: 115,
          borderRadius: "50%",
          background: "radial-gradient(circle at 32% 32%, #9090ff, #5050f7 52%, #3232d6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 10,
          boxShadow: "0 0 0 1px rgba(88,88,247,0.25), 0 10px 48px rgba(69,69,245,0.55)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.7, type: "spring", bounce: 0.42 }}
      >
        <span style={{
          fontSize: 10,
          fontWeight: 500,
          color: "rgba(255,255,255,0.92)",
          letterSpacing: "0.04em",
          textAlign: "center",
          lineHeight: 1.4,
          pointerEvents: "none",
          userSelect: "none",
        }}>
          {/* Get in<br />touch */}
        </span>
      </motion.div>

      {/* ── FOOTER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 24,
        position: "relative",
        zIndex: 1,
      }}>
        {/* version + time */}
        <div style={{ display: "flex", gap: 56 }}>
          {[{ label: "Version", value: "2026 © Sanat Jha" }, { label: "Local Time", value: time }].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 5px" }}>{label}</p>
              <p style={{ fontSize: 13, margin: 0, color: "rgba(255,255,255,0.6)" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* socials */}
        <div>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 5px", textAlign: "right" }}>Socials</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Email", "Instagram", "Github", "LinkedIn"].map((s) => <SocialLink key={s} label={s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}