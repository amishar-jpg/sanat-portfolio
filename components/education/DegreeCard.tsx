"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type DegreeCardProps = {
  title: string;
  institution: string;
  badge: string;
  repulseX: number;
};

export default function DegreeCard({ title, institution, badge, repulseX }: DegreeCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x: -ny * 8, y: nx * 8 });
  };

  return (
    <motion.article
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, x: repulseX }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="surface-glass relative rounded-2xl border border-white/10 bg-[#0f0f0f]/80 p-6"
    >
      <motion.div
        animate={{ rotate: tilt.y * 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#141414] text-[10px] uppercase tracking-[0.08em] text-[#98FF98]"
      >
        {badge}
      </motion.div>

      <h3 className="text-xl font-semibold text-[#f5f5f5]">{title}</h3>
      <p className="mt-2 text-sm text-[#aaaaaa]">{institution}</p>
    </motion.article>
  );
}
