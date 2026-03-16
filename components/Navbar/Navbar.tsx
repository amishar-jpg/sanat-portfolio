"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const NAV_LINKS = ["About", "Skills", "Works", "Education", "Contact"] as const;
type NavLink = (typeof NAV_LINKS)[number];

// Map nav links to section IDs
const SECTION_IDS: Record<NavLink, string> = {
  About: "about",
  Skills: "skills",
  Works: "works",
  Education: "education",
  Contact: "contact",
};

// ─────────────────────────────────────────────
// Single nav item — GSAP char-shuffle on hover
// ─────────────────────────────────────────────
function NavItem({ label, onClick }: { label: NavLink; onClick?: () => void }) {
  const topRowRef = useRef<HTMLSpanElement>(null);
  const botRowRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const chars = label.split("");

  const handleEnter = () => {
    if (busy.current) return;
    busy.current = true;
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
        },
      })
      .to(topRowRef.current!.querySelectorAll(".char"), {
        yPercent: -130,
        opacity: 0,
        duration: 0.24,
        stagger: 0.024,
        ease: "power2.in",
      })
      .fromTo(
        botRowRef.current!.querySelectorAll(".char"),
        { yPercent: 130, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.24,
          stagger: 0.024,
          ease: "power2.out",
        },
        "<0.05",
      );
  };

  const handleLeave = () => {
    if (busy.current) return;
    busy.current = true;
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
        },
      })
      .to(botRowRef.current!.querySelectorAll(".char"), {
        yPercent: 130,
        opacity: 0,
        duration: 0.22,
        stagger: 0.02,
        ease: "power2.in",
      })
      .fromTo(
        topRowRef.current!.querySelectorAll(".char"),
        { yPercent: -130, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.22,
          stagger: 0.02,
          ease: "power2.out",
        },
        "<0.04",
      );
  };

  return (
    <li
      data-nav-item
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className="relative cursor-pointer select-none"
      style={{
        fontFamily: "'Barlow', sans-serif",
        height: "1.4em",
        overflow: "hidden",
        opacity: 0,
      }}
    >
      <span ref={topRowRef} className="flex items-center h-full">
        {chars.map((ch, i) => (
          <span
            key={i}
            className="char inline-block text-white/65 leading-none"
          >
            {ch}
          </span>
        ))}
      </span>
      <span
        ref={botRowRef}
        className="flex items-center h-full absolute top-0 left-0 pointer-events-none"
        aria-hidden="true"
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            className="char inline-block text-white leading-none opacity-0"
          >
            {ch}
          </span>
        ))}
      </span>
    </li>
  );
}

// ─────────────────────────────────────────────
// Hamburger
// ─────────────────────────────────────────────
function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative z-50 flex flex-col justify-center items-center w-8 h-8 gap-[5px] md:hidden"
      aria-label={open ? "Close menu" : "Open menu"}
    >
      {[
        open ? "translate-y-[6.5px] rotate-45" : "",
        open ? "opacity-0 scale-x-0" : "",
        open ? "-translate-y-[6.5px] -rotate-45" : "",
      ].map((extra, i) => (
        <span
          key={i}
          className={`block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${extra}`}
        />
      ))}
    </button>
  );
}

// ─────────────────────────────────────────────
// Mobile overlay
// ─────────────────────────────────────────────
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const handleNavClick = (label: NavLink) => {
    onClose();
    // Small delay to allow menu to close first
    setTimeout(() => {
      const sectionId = SECTION_IDS[label];
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <div
      className={[
        "fixed inset-0 z-40 flex flex-col items-center justify-center gap-10",
        "bg-black/90 backdrop-blur-md transition-all duration-300 ease-in-out",
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {NAV_LINKS.map((n) => (
        <button
          key={n}
          onClick={() => handleNavClick(n)}
          className="text-white/65 hover:text-white transition-colors duration-200 uppercase tracking-[0.22em] text-sm"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Navbar
// Listens for the custom "loader:done" event that
// Loading.tsx dispatches when its exit animation
// completes — no prop drilling needed.
// ─────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const runEntrance = () => {
      const logo = logoRef.current;
      const items = navRef.current?.querySelectorAll("[data-nav-item]");
      if (!logo || !items) return;

      gsap
        .timeline()
        // 1 — logo hops in with bounce
        .fromTo(
          logo,
          { opacity: 0, y: 16, scale: 0.82 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(2.6)" },
        )
        // 2 — nav links drop in one by one
        .fromTo(
          items,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.09,
            ease: "power3.out",
          },
          "-=0.3",
        );
    };

    // Fire immediately if loader already done (e.g. HMR / fast reload)
    // Otherwise wait for the custom event dispatched by Loading.tsx
    window.addEventListener("loader:done", runEntrance, { once: true });
    return () => window.removeEventListener("loader:done", runEntrance);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400&display=swap');
      `}</style>

      <nav
        ref={navRef}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 sm:px-8 lg:px-10 py-5"
      >
        <span
          ref={logoRef}
          className="text-white tracking-[0.26em] text-[1.05rem] sm:text-[1.1rem] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", opacity: 0 }}
        >
          SANAT JHA
        </span>

        <ul className="hidden md:flex gap-8 lg:gap-12 list-none text-[0.58rem] lg:text-[0.62rem] tracking-[0.2em] uppercase">
          {NAV_LINKS.map((n) => (
            <NavItem 
              key={n} 
              label={n} 
              onClick={() => {
                const sectionId = SECTION_IDS[n];
                const element = document.getElementById(sectionId);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          ))}
        </ul>

        <Hamburger open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
