"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";

gsap.registerPlugin(SplitText, CustomEase);

export default function LoaderHero() {
  const [count, setCount] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Kill any leftover tweens from strict mode first run
    gsap.killTweensOf(".loader");
    gsap.killTweensOf(".counter");
    gsap.killTweensOf(".hero-bg");

    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const heroCopyParagraph = document.querySelector(".hero-copy p");
    const split = heroCopyParagraph
      ? SplitText.create(".hero-copy p", {
          type: "words",
          mask: "words",
          wordsClass: "word",
        })
      : null;

    const textPaths = document.querySelectorAll<SVGTextPathElement>(
      ".loader svg textPath",
    );
    const startTextLengths = Array.from(textPaths).map((tp) =>
      parseFloat(tp.getAttribute("textLength") ?? "0"),
    );
    const startTextOffsets = Array.from(textPaths).map((tp) =>
      parseFloat(tp.getAttribute("startOffset") ?? "0"),
    );

    const targetTextLengths = [3200, 2800, 2600, 2400, 2000, 1600, 1200, 1000];
    const orbitRadii = [775, 700, 625, 550, 475, 400, 325, 250];
    const maxOrbitRadius = orbitRadii[0];
    const maxAnimDuration = 3.5;
    const minAnimDuration = 2.5;

    textPaths.forEach((textPath, index) => {
      const animationDelay = (textPaths.length - 1 - index) * 0.1;
      const currentOrbitRadius = orbitRadii[index];
      const currentDuration =
        minAnimDuration +
        (currentOrbitRadius / maxOrbitRadius) *
          (maxAnimDuration - minAnimDuration);
      const pathLength = 2 * Math.PI * currentOrbitRadius * 3;
      const textLengthIncrease =
        targetTextLengths[index] - startTextLengths[index];
      const offsetAdjustment = (textLengthIncrease / 2 / pathLength) * 100;
      const targetOffset = startTextOffsets[index] - offsetAdjustment;

      gsap.to(textPath, {
        attr: {
          textLength: targetTextLengths[index],
          startOffset: targetOffset + "%",
        },
        duration: currentDuration,
        delay: animationDelay,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.4,
      });
    });

    let loaderRotation = 0;
    function animateRotation() {
      const spinDirection = Math.random() < 0.5 ? 1 : -1;
      loaderRotation += 25 * spinDirection;
      gsap.to(".loader svg", {
        rotation: loaderRotation,
        duration: 2,
        ease: "power2.inOut",
        onComplete: animateRotation,
      });
    }
    animateRotation();

    const countValue = { value: 0 };

    gsap.to(countValue, {
      value: 100,
      duration: 6,
      delay: 0.5,
      ease: "none",
      onUpdate: function () {
        setCount(Math.floor(countValue.value));
      },
      onComplete: function () {
        // Step 1: fade out counter
        gsap.to(".counter", {
          opacity: 0,
          duration: 0.5,
        });

        // Step 2: fade out loader AFTER counter disappears
        gsap.to(".loader", {
          opacity: 0,
          duration: 1.2,
          delay: 0.6, // wait for counter to fade first
          ease: "power2.out",
          onComplete: () => {
            const loaderElement = document.querySelector(".loader");
            loaderElement?.remove();

            // Step 3: reveal hero AFTER loader is gone
            gsap.to(".hero-bg", {
              opacity: 1,
              scale: 1,
              duration: 2.5,
              ease: "hop",
            });
          },
        });
      },
    });

    const orbitTextElements = document.querySelectorAll(".orbit-text");
    gsap.set(orbitTextElements, { opacity: 0 });
    const orbitTextsReversed = Array.from(orbitTextElements).reverse();

    gsap.to(orbitTextsReversed, {
      opacity: 1,
      duration: 0.75,
      stagger: 0.125,
      ease: "power1.out",
    });

    // gsap.to(orbitTextsReversed, {
    //   opacity: 1,
    //   duration: 0.5,
    //   stagger: 0.01,
    //   delay: 2,
    //   ease: "power1.out",
    //   onComplete: function () {
    //     gsap.to(".loader", {
    //       opacity: 0,
    //       duration: 1.2,
    //       ease: "power2.out",
    //       onComplete: () => {
    //         gsap.to(".hero-bg", {
    //           opacity: 1,
    //           scale: 1,
    //           duration: 2,
    //           ease: "hop",
    //         });
    //         gsap.to(".loader", {
    //           opacity: 0,
    //           duration: 1.2,
    //           ease: "power2.out",
    //           onComplete: () => {
    //             const loaderElement = document.querySelector(".loader");
    //             loaderElement?.remove(); // remove AFTER fade completes
    //           },
    //         });
    //       },
    //     });
    //   },
    // });

    if (split) {
      gsap.to(".hero-copy p .word", {
        y: 0,
        duration: 2,
        delay: -0.25,
        stagger: 0.1,
        ease: "hop",
      });
    }

    return () => {
      split?.revert();
      gsap.killTweensOf(".loader svg");
      gsap.killTweensOf(".counter");
      gsap.killTweensOf(".loader");
      gsap.killTweensOf(".hero-bg");
      gsap.killTweensOf(".hero-copy p .word");
      gsap.killTweensOf(countValue);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FDFBD4] text-black font-[Segoe_UI]">
      {/* LOADER */}
      <div className="loader fixed inset-0 grid place-items-center z-50 isolate bg-white">
        {/* Glow */}
        <div className="absolute w-[78vmin] h-[78vmin] rounded-full blur-[18px]  animate-pulse"></div>

        {/* Outer Ring */}
        <div className="absolute w-[92vmin] h-[92vmin] rounded-full "></div>

        {/* SVG Orbits */}
        <svg
          viewBox="-425 -425 1850 1850"
          className="w-[88vmin] h-[88vmin] animate-[spin_20s_linear_infinite] "
        >
          {/* ORBIT PATHS */}
          <path
            d="M 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 499.99,-275"
            id="orbit1"
            className="fill-none "
          />

          <path
            d="M 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 499.99,-200"
            id="orbit2"
            className="fill-none"
          />

          <path
            d="M 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 499.99,-125"
            id="orbit3"
            className="fill-none "
          />

          <path
            d="M 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 499.99,-50"
            id="orbit4"
            className="fill-none"
          />

          <path
            d="M 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 499.99,25"
            id="orbit5"
            className="fill-none"
          />

          <path
            d="M 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 499.99,100"
            id="orbit6"
            className="fill-none"
          />

          <path
            d="M 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 499.99,175"
            id="orbit7"
            className="fill-none"
          />

          <path
            d="M 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 499.99,250"
            id="orbit8"
            className="fill-none "
          />

          {/* TEXT PATHS */}
          <text className="orbit-text text-[54px] font-semibold  uppercase fill-black">
            <textPath href="#orbit1" startOffset="30%">
              SOFTWARE
            </textPath>
          </text>

          <text className="orbit-text text-[54px] font-semibold tracking-[0.12em] uppercase fill-black">
            <textPath href="#orbit2" startOffset="31%">
              DEVELOPER
            </textPath>
          </text>

          <text className="orbit-text text-[54px] font-semibold tracking-[0.12em] uppercase fill-black">
            <textPath href="#orbit3" startOffset="33%">
              GENERATIVE AI
            </textPath>
          </text>
          <text className="orbit-text text-[54px] font-semibold tracking-[0.12em] uppercase fill-black">
            <textPath href="#orbit4" startOffset="37%">
              BACKEND ENGINEER
            </textPath>
          </text>
          <text className="orbit-text text-[54px] font-semibold tracking-[0.12em] uppercase fill-black">
            <textPath href="#orbit5" startOffset="39%">
              FULLSTACK DEVELOPER
            </textPath>
          </text>
          <text className="orbit-text text-[54px] font-semibold tracking-[0.12em] uppercase fill-black">
            <textPath href="#orbit6" startOffset="41%">
              CLOUD ENGINEER
            </textPath>
          </text>
          <text className="orbit-text text-[54px] font-semibold tracking-[0.12em] uppercase fill-black">
            <textPath href="#orbit7" startOffset="43%">
              AI ENTHUSIAST
            </textPath>
          </text>
        </svg>

        {/* COUNTER */}
        <div className="counter absolute w-30 h-30 rounded-full grid place-items-center ">
          <p className="text-3xl font-bold tracking-[0.08em]">{count}</p>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="hero-bg absolute inset-0 scale-[1.2] opacity-0">
          <Image
            src="https://images.unsplash.com/photo-1612744192242-35cd7a7d35e6?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="background"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover brightness-[0.6] contrast-105 saturate-90 scale-105"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,4,6,0.76),rgba(3,4,6,0.45)_40%,rgba(3,4,6,0.88))]" />
      </section>
    </div>
  );
}
