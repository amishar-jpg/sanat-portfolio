"use client";
// import Loader from "@/components/loader/Loader";
// import LightRays from "@/components/Hero/HeroBackground";
import Navbar from "@/components/Navbar/Navbar";
// import HeroText from "@/components/Hero/HeroText";
import About from "@/components/about/About";
import Works from "@/components/projects/Projects";
import Connect from "../components/contact/Contact";
import Skills from "@/components/skills/Skills";

import { useState, useEffect } from "react";

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* {loading && <Loader />} */}

      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        {/* <LightRays />; */}
        <Navbar />
        {/* <HeroText /> */}
      </main>
      <About />
      <Skills />
      <Works />
      <Connect />
      
    </>
  );
}
