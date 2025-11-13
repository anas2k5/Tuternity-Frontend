// src/components/AnimatedBackground.jsx
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      {/* Main dark nebula gradient */}
      <div
        className="
          fixed inset-0 z-0 
          bg-gradient-to-br from-[#05070F] via-[#0E1329] to-[#1B1F3B]
          transition-all duration-700
        "
      />

      {/* Floating cosmic glow */}
      <motion.div
        className="
          fixed w-[700px] h-[700px] 
          rounded-full blur-3xl mix-blend-screen z-0
          bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-40
        "
        animate={{ x: [0, 120, -120, 0], y: [0, -60, 60, 0] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
      />

      {/* Floating soft particles */}
      {[...Array(18)].map((_, i) => (
        <motion.span
          key={i}
          className="
            fixed rounded-full bg-white/30
            blur-[1px] 
            z-0
          "
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
    </>
  );
}
