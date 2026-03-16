"use client";
import Loader from "@/components/loader/Loader";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import Journey from "@/components/journey/Journey";
import Works from "@/components/projects/Projects";
import Connect from "../components/contact/Contact";

import { useState, useEffect } from "react";

export default function Page() {
 

  return (
    <>
      <Loader />
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <Navbar />
        <Hero />
      </main>
      <section id="about">
        <About />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="education">
        <Journey />
      </section>
      <section id="works">
        <Works />
      </section>
      <section id="contact">
        <Connect />
      </section>
    </>
  );
}
