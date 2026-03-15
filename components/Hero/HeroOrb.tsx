import { motion } from "framer-motion";
import GlassOrb, { type CoreMode } from "@/webgl/hero/GlassOrb";

type HeroOrbProps = {
  x: number;
  y: number;
  mode: CoreMode;
};

export default function HeroOrb({ x, y, mode }: HeroOrbProps) {
  return (
    <motion.div
      animate={{ x: x * 50, y: y * 32 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-70 w-70 rounded-[34px] border border-white/12 bg-[linear-gradient(145deg,#0f1212_0%,#050606_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-18px_28px_rgba(0,0,0,0.7),0_24px_50px_rgba(0,0,0,0.6),0_0_42px_rgba(152,255,152,0.18)] md:h-85 md:w-85"
    >
      <GlassOrb mode={mode} />
      <div className="pointer-events-none absolute inset-2 rounded-[28px] border border-[#98FF98]/16" />
      <div className="pointer-events-none absolute left-4 top-4 h-2.5 w-14 rounded-full bg-white/18 blur-[2px]" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-1.5 w-10 rounded-full bg-[#98FF98]/40 blur-[1px]" />
    </motion.div>
  );
}
