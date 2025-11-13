// src/components/AuthContainer.jsx
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function AuthContainer({ children }) {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`
        relative w-full max-w-md p-[2px] rounded-3xl
        shadow-[0_0_25px_rgba(79,70,229,0.25)]
        ${theme === "dark"
          ? "bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900"
          : "bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400"}
      `}
    >
      <div
        className={`
          rounded-3xl h-full w-full p-6 md:p-8 backdrop-blur-2xl border
          transition-colors duration-500

          ${theme === "dark"
            ? "bg-[#0B0F1E]/90 border-indigo-900/40 text-gray-100 shadow-[0_0_30px_rgba(79,70,229,0.25)]"
            : "bg-white/80 border-indigo-300/40 text-gray-900 shadow-[0_0_20px_rgba(99,102,241,0.15)]"}
        `}
      >
        {children}
      </div>

      {/* Neon glows */}
      <div
        className={`
          absolute -top-10 -left-10 w-36 h-36 blur-3xl rounded-full transition-opacity duration-500
          ${theme === "dark" ? "bg-indigo-600/40" : "bg-indigo-300/40"}
        `}
      ></div>

      <div
        className={`
          absolute -bottom-10 -right-10 w-36 h-36 blur-3xl rounded-full transition-opacity duration-500
          ${theme === "dark" ? "bg-purple-500/30" : "bg-purple-300/30"}
        `}
      ></div>
    </motion.div>
  );
}
