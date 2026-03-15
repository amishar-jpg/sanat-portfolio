"use client";
import Navbar from "@/components/Navbar/Navbar";
import About from "@/components/about/About";
import Works from "@/components/projects/Projects";
import Connect from "../components/contact/Contact";
import Skills from "@/components/skills/Skills";
import Loader from "@/components/loader/Loader";
import Hero from "../components/Hero/Hero";

import { useState, useEffect } from "react";

export default function Page() {
 

  return (
    <>
      <Loader />
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <Navbar />
        <Hero />
      </main>
      <About />
      <Skills />
      <Works />
      <Connect />
      
    </>
  );
}
