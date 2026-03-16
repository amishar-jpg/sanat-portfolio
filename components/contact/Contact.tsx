"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";

/* ─── Page transition variants ───────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 32, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(6px)",
    transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
  },
};

function splitIntoChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.innerHTML = "";
  const inners: HTMLElement[] = [];

  Array.from(text).forEach((ch) => {
    if (ch === " ") {
      el.appendChild(document.createTextNode("\u00A0"));
      return;
    }
    const mask = document.createElement("span");
    // ✅ FIX 1: Add a data attribute so we can precisely select masks vs inners
    mask.dataset.role = "mask";
    mask.style.cssText =
      "display:inline-block;overflow:hidden;vertical-align:bottom;" +
      "line-height:1.15;padding-bottom:0.04em;";

    const inner = document.createElement("span");
    inner.dataset.role = "inner";
    inner.textContent = ch;
    inner.style.cssText = "display:inline-block;will-change:transform,opacity;";

    mask.appendChild(inner);
    el.appendChild(mask);
    inners.push(inner);
  });

  return inners;
}

/* ─── ContactPill ────────────────────────────────────────────────── */
function ContactPill({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      initial="initial"
      whileHover="hover"
      className="relative inline-flex items-center justify-center px-5 py-3 sm:px-9 sm:py-[18px] rounded-full border border-white/20 text-white no-underline tracking-[0.01em] cursor-pointer overflow-hidden"
      style={{ fontSize: "clamp(12px,1.3vw,17px)" }}
    >
      <motion.span
        variants={{ initial: { y: "102%" }, hover: { y: "0%" } }}
        transition={{ duration: 0.44, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 bg-[#5252f5] rounded-[inherit] z-0"
      />
      <span className="relative z-10 whitespace-nowrap">{label}</span>
    </motion.a>
  );
}

/* ─── Social links data ──────────────────────────────────────────── */
const SOCIALS = [
  { label: "Email", href: "mailto:sanatjha4@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sanatjha4/" },
  { label: "Instagram", href: "https://instagram.com/sanatjha4" },
  { label: "Github", href: "https://github.com/Sanat-Jha" },
] as const;

/* ─── SocialLink — GSAP roll-up + wipe underline ────────────────── */
function SocialLink({ label, href }: { label: string; href: string }) {
  const topRef = useRef<HTMLSpanElement>(null);
  const btmRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    gsap.to([topRef.current, btmRef.current], { yPercent: -100, duration: 0.38, ease: "power3.out" });
    gsap.to([topRef.current, btmRef.current], { color: "#ffffff", duration: 0.22 });
    gsap.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      { scaleX: 1, duration: 0.38, ease: "power3.out" }
    );
  };

  const handleLeave = () => {
    gsap.to([topRef.current, btmRef.current], { yPercent: 0, duration: 0.38, ease: "power3.out" });
    gsap.to([topRef.current, btmRef.current], { color: "rgba(255,255,255,0.55)", duration: 0.22 });
    gsap.to(lineRef.current, { scaleX: 0, transformOrigin: "right", duration: 0.32, ease: "power3.in" });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative inline-block overflow-hidden no-underline cursor-pointer pb-[3px]"
    >
      <span ref={topRef} className="block text-[13px] leading-tight" style={{ color: "rgba(255,255,255,0.55)" }}>
        {label}
      </span>
      <span ref={btmRef} className="absolute top-full left-0 block text-[13px] leading-tight whitespace-nowrap" style={{ color: "rgba(255,255,255,0.55)" }}>
        {label}
      </span>
      <span ref={lineRef} className="absolute bottom-0 left-0 right-0 h-px bg-white/75"
        style={{ transform: "scaleX(0)", transformOrigin: "left" }} />
    </a>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function Connect() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const footerLeftRef = useRef<HTMLDivElement>(null);
  const footerRightRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(300);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 180, mass: 0.6 });

  const lineYRef = useRef(0);
  const [lineYState, setLineYState] = useState(0);

  const [sectionWidth, setSectionWidth] = useState(800);
  const [time, setTime] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const ballSize = isMobile ? 72 : 96;
  const half = ballSize / 2;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit", timeZoneName: "short",
      }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!lineRef.current || !sectionRef.current) return;
      const lr = lineRef.current.getBoundingClientRect();
      const sr = sectionRef.current.getBoundingClientRect();
      const y = lr.top - sr.top + lr.height / 2;
      lineYRef.current = y;
      setLineYState(y);
      setSectionWidth(sr.width);
      mouseX.set(sr.width / 2);
    };

    measure();
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 800);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [mouseX]);

  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const x = e.clientX - section.getBoundingClientRect().left;
      mouseX.set(Math.min(Math.max(x, half), sectionWidth - half));
    };
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [mouseX, isMobile, sectionWidth, half]);

  useEffect(() => {
    if (!isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    const onTouch = (e: TouchEvent) => {
      const x = e.touches[0].clientX - section.getBoundingClientRect().left;
      mouseX.set(Math.min(Math.max(x, half), sectionWidth - half));
    };
    section.addEventListener("touchmove", onTouch, { passive: true });
    return () => section.removeEventListener("touchmove", onTouch);
  }, [mouseX, isMobile, sectionWidth, half]);

  useEffect(() => {
    const el = h1Ref.current;
    if (!el) return;

    let raf: number;
    raf = requestAnimationFrame(() => {
      const chars = splitIntoChars(el);
      gsap.set(chars, { yPercent: 115, skewX: 6, opacity: 0 });
      gsap.to(chars, {
        yPercent: 0,
        skewX: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        stagger: { each: 0.032, from: "start" },
        delay: 0.1,
      });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = subRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const chars = splitIntoChars(el);
      gsap.set(chars, { yPercent: 110, opacity: 0 });
      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power3.out",
        stagger: { each: 0.025, from: "start" },
        delay: 0.75,
      });
    });
  }, []);

  useEffect(() => {
    const pills = pillsRef.current;
    const fLeft = footerLeftRef.current;
    const fRight = footerRightRef.current;
    if (!pills || !fLeft || !fRight) return;

    const tl = gsap.timeline({ delay: 1.0 });

    tl.set(pills, { y: 28, opacity: 0 })
      .to(pills, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" });

    tl.set(fLeft.children, { y: 20, opacity: 0 }, "<0.15")
      .to(fLeft.children, {
        y: 0, opacity: 1,
        duration: 0.5, ease: "power2.out",
        stagger: 0.1,
      }, "<0.15");

    tl.set(fRight, { x: 16, opacity: 0 }, "<0.1")
      .to(fRight, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "<0.1");
  }, []);

  /* ── h1 hover scatter ──────────────────────────────────────────────
     FIX 2: Use data-role selectors to precisely target only mask spans
     and only inner spans — avoids cross-contamination between the two.
  ────────────────────────────────────────────────────────────────── */
  const onH1Enter = () => {
    if (!h1Ref.current || isMobile) return;
    // ✅ Precise selectors: only direct mask spans, only inner char spans
    const masks = Array.from(h1Ref.current.querySelectorAll<HTMLElement>("[data-role='mask']"));
    const inners = Array.from(h1Ref.current.querySelectorAll<HTMLElement>("[data-role='inner']"));
    if (!inners.length) return;

    // Unlock clipping so chars can fly freely beyond their mask bounds
    masks.forEach(m => (m.style.overflow = "visible"));

    gsap.killTweensOf(inners);
    gsap.to(inners, {
      yPercent: () => gsap.utils.random(-80, 80),
      xPercent: () => gsap.utils.random(-40, 40),
      rotation: () => gsap.utils.random(-20, 20),
      scale: () => gsap.utils.random(0.6, 1.4),
      opacity: () => gsap.utils.random(0.1, 0.5),
      duration: 0.4,
      ease: "power3.out",
      stagger: { each: 0.012, from: "random" },
    });
  };

  const onH1Leave = () => {
    if (!h1Ref.current) return;
    // ✅ Same precise selectors on leave
    const masks = Array.from(h1Ref.current.querySelectorAll<HTMLElement>("[data-role='mask']"));
    const inners = Array.from(h1Ref.current.querySelectorAll<HTMLElement>("[data-role='inner']"));
    if (!inners.length) return;

    gsap.killTweensOf(inners);
    gsap.to(inners, {
      yPercent: 0, xPercent: 0, rotation: 0, scale: 1, opacity: 1,
      duration: 0.75,
      ease: "elastic.out(1, 0.45)",
      stagger: { each: 0.01, from: "random" },
      onComplete: () => {
        // Re-lock overflow after chars snap back into position
        masks.forEach(m => (m.style.overflow = "hidden"));
      },
    });
  };

  return (
    <AnimatePresence mode="wait">
      {mounted && (
        <motion.section
          key="connect"
          ref={sectionRef}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full min-h-screen bg-[#0e0f11] text-white flex flex-col justify-between overflow-hidden box-border"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            padding: "clamp(28px,5vw,56px) clamp(20px,5vw,64px) clamp(24px,4vw,44px)",
          }}
        >
          {/* grain overlay */}
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.04]">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 flex flex-col justify-center relative z-10">

            {/* headline row */}
            <div className="flex items-start gap-4 sm:gap-8">

              {/* avatar */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ scale: 1.08, boxShadow: "0 0 28px rgba(82,82,245,0.4)" }}
                className="rounded-full overflow-hidden flex-shrink-0 bg-[#2a2a2a] border border-white/10 cursor-pointer"
                style={{ width: "clamp(44px,6vw,68px)", height: "clamp(44px,6vw,68px)", marginTop: 14 }}
              >
                <motion.img
                  src="/Sanat_2.jpg"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>

              {/* HEADING */}
              <h1
                ref={h1Ref}
                onMouseEnter={onH1Enter}
                onMouseLeave={onH1Leave}
                className="font-bold select-none cursor-default m-0"
                style={{
                  fontSize: "clamp(36px,7.5vw,108px)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.08,
                }}
              >
                Let&apos;s work together
              </h1>
            </div>

            {/* subtitle */}
            <p
              ref={subRef}
              className="text-white/30 tracking-[0.1em] uppercase mt-4 sm:mt-[18px] m-0"
              style={{ fontSize: "clamp(9px,1vw,13px)" }}
            >
              Stay in Touch...
            </p>

            {/* divider line */}
            <div
              ref={lineRef}
              className="w-full my-10 sm:my-[52px]"
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.18) 20%,rgba(255,255,255,0.18) 80%,rgba(255,255,255,0) 100%)",
              }}
            />

            {/* contact pills */}
            <div ref={pillsRef} className="flex gap-3 flex-wrap">
              <ContactPill label="sanatjha4@gmail.com" href="mailto:sanatjha4@gmail.com" />
              <ContactPill label="+91 88829 44464" href="tel:+918882944464" />
            </div>
          </div>

          {/* ── BLUE BALL ── */}
          <motion.div
            style={{
              position: "absolute",
              left: smoothX,
              top: lineYState,
              marginLeft: -half,
              marginTop: -half,
              width: ballSize,
              height: ballSize,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 32% 32%, #9090ff, #5050f7 52%, #3232d6)",
              pointerEvents: "none",
              zIndex: 10,
              boxShadow:
                "0 0 0 1px rgba(88,88,247,0.25), 0 10px 48px rgba(69,69,245,0.55)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7, type: "spring", bounce: 0.42 }}
          />

          {/* ── FOOTER ── */}
          <div className="flex justify-between items-end flex-wrap gap-6 relative z-10 pt-6 sm:pt-0">

            {/* version + time */}
            <div ref={footerLeftRef} className="flex gap-8 sm:gap-14">
              {[
                { label: "Version", value: "2026 © Sanat Jha" },
                { label: "Local Time", value: time },
              ].map(({ label, value }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-default"
                >
                  <p className="text-[9px] text-white/25 tracking-[0.14em] uppercase mb-1 m-0">{label}</p>
                  <p className="text-[13px] text-white/60 m-0">{value}</p>
                </motion.div>
              ))}
            </div>

            {/* socials */}
            <div ref={footerRightRef}>
              <p className="text-[9px] text-white/25 tracking-[0.14em] uppercase mb-1 text-right m-0">
                Socials
              </p>
              <div className="flex gap-5 sm:gap-7 flex-wrap justify-end">
                {SOCIALS.map(({ label, href }) => (
                  <SocialLink key={label} label={label} href={href} />
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}