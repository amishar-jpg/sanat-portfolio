"use client";

import { useState } from "react";
import { journey } from "@/data/journey";
import TimelineCard from "./TimelineCard";
import TimelineNode from "./TimelineNode";
import TimelineWire from "./TimelineWire";

export default function Journey() {
  const [active, setActive] = useState(0);

  return (
    <section id="journey" className="bg-[#000000] px-6 py-24 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#98FF98]">Journey</p>
        <h2 className="mt-4 text-4xl font-semibold text-engraved md:text-5xl">Milestones</h2>

        <div className="mt-12">
          <TimelineWire>
            {journey.map((item, index) => (
              <div
                key={item.title}
                className="relative grid gap-4 pl-12 md:grid-cols-[24px_1fr] md:items-start"
                onMouseEnter={() => setActive(index)}
              >
                <div className="absolute left-4.5 top-6 md:static md:left-auto md:top-auto">
                  <TimelineNode intensity={active === index ? 1 : 0.2} />
                </div>
                <TimelineCard title={item.title} description={item.description} />
              </div>
            ))}
          </TimelineWire>
        </div>
      </div>
    </section>
  );
}
