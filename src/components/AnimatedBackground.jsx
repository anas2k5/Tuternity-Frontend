import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      {/* 🌈 Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-600 z-0" />

      {/* 🌀 Animated glow */}
      <motion.div
        className="fixed w-[700px] h-[700px] bg-gradient-to-r from-pink-500 via-indigo-400 to-blue-500 rounded-full mix-blend-overlay blur-3xl opacity-40 z-0"
        animate={{ x: [0, 120, -120, 0], y: [0, -60, 60, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      />

      {/* ✨ Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.span
          key={i}
          className="fixed w-2 h-2 bg-white/40 rounded-full z-0"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            x: [0, i % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + i * 0.3,
            delay: i * 0.2,
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </>
  );
}
