"use client";

import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;

      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-150"
        style={{
          background: `
            radial-gradient(
              650px circle at ${position.x}% ${position.y}%,
              rgba(37, 99, 235, 0.16),
              rgba(29, 78, 216, 0.08) 25%,
              rgba(15, 23, 42, 0.03) 50%,
              transparent 75%
            )
          `,
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(
              900px circle at 50% 50%,
              rgba(15, 23, 42, 0.18),
              transparent 70%
            )
          `,
        }}
      />
    </>
  );
}