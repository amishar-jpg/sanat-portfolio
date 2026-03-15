"use client";

import { useState } from "react";
import { education } from "@/data/education";
import DegreeCard from "./DegreeCard";

export default function Education() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="education" className="bg-[#000000] px-6 py-24 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#98FF98]">Education</p>
        <h2 className="mt-4 text-4xl font-semibold text-engraved md:text-5xl">Academic Path</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {education.map((item, index) => {
            const repulseX = hovered === null ? 0 : hovered === index ? 0 : hovered < index ? 4 : -4;

            return (
              <div key={item.title} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)}>
                <DegreeCard
                  title={item.title}
                  institution={item.institution}
                  badge={item.badge}
                  repulseX={repulseX}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
