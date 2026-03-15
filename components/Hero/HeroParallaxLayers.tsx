import { motion } from "framer-motion";

type HeroParallaxLayersProps = {
  x: number;
  y: number;
};

export default function HeroParallaxLayers({ x, y }: HeroParallaxLayersProps) {
  return (
    <>
      <motion.div
        animate={{ x: x * 8, y: y * 6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(152,255,152,0.06),transparent_38%),radial-gradient(circle_at_85%_70%,rgba(152,255,152,0.04),transparent_42%)]" />
      </motion.div>

      <motion.div
        animate={{ x: x * 15, y: y * 10 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-1/2 top-[20%] z-0 -translate-x-1/2 text-center text-[16vw] font-semibold leading-none text-white/3"
      >
        SANAT JHA
      </motion.div>
    </>
  );
}
