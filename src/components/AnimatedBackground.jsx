// src/components/AnimatedBackground.jsx
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      {/* Wrapper uses pointer-events-none and negative z-index to guarantee it's behind everything */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ WebkitTransform: "translateZ(0)" }}
      >
        {/* Main dark nebula gradient */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-br from-[#05070F] via-[#0E1329] to-[#1B1F3B]
            transition-all duration-700
          "
        />

        {/* Floating cosmic glow */}
        <motion.div
          className="
            absolute w-[700px] h-[700px] 
            rounded-full blur-3xl mix-blend-screen
            bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-40
          "
          animate={{ x: [0, 120, -120, 0], y: [0, -60, 60, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        />

        {/* Floating soft particles */}
        {[...Array(18)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/30 blur-[1px]"
            style={{
              width: 6,
              height: 6,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.4, 1, 0.4],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + i * 0.35,
              delay: i * 0.22,
            }}
          />
        ))}
      </div>
    </>
  );
}
