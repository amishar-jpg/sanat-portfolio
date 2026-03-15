"use client";

import { useEffect, useMemo, useState } from "react";

const ROLE = "Software Developer";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function RoleScrambler() {
  const [display, setDisplay] = useState(ROLE);

  const roleChars = useMemo(() => ROLE.split(""), []);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 22;

    const run = () => {
      frame += 1;
      const progress = frame / totalFrames;

      const next = roleChars
        .map((char, index) => {
          if (char === " ") {
            return " ";
          }

          if (progress * roleChars.length > index) {
            return char;
          }

          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplay(next);

      if (frame >= totalFrames) {
        setDisplay(ROLE);
      } else {
        window.setTimeout(run, 36);
      }
    };

    const interval = window.setInterval(() => {
      frame = 0;
      run();
    }, 3800);

    return () => window.clearInterval(interval);
  }, [roleChars]);

  return <span aria-label={ROLE}>{display}</span>;
}
