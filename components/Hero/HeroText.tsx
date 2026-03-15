import RoleScrambler from "./RoleScrambler";

export default function HeroText() {
  return (
    <div className="relative z-10 max-w-3xl">
      <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-[#aaaaaa] md:text-xs">
        BTech, IIT Roorkee
      </p>

      <h1 className="text-5xl font-semibold leading-[0.88] text-[#f5f5f5] sm:text-6xl md:text-7xl lg:text-8xl">
        <span className="block">SANAT JHA</span>
      </h1>

      <p className="mt-6 text-lg font-light text-[#98FF98] md:text-2xl">
        <RoleScrambler />
      </p>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#aaaaaa] md:text-base">
        Passionate software engineer focused on building web and mobile applications,
        with a journey rooted in discipline, late-night practice, and deep curiosity.
      </p>
    </div>
  );
}
