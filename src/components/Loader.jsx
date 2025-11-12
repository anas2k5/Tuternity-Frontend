import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0B0F19] via-[#1E1B4B] to-[#312E81] z-[9999]">
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Glowing Rotating Ring */}
        <motion.div
          className="w-24 h-24 border-[5px] border-transparent border-t-indigo-400 border-l-purple-500 rounded-full absolute"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        ></motion.div>

        {/* Brand Text */}
        <motion.h1
          className="text-white text-3xl font-extrabold drop-shadow-lg tracking-wide"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          TuterNity
        </motion.h1>

        <p className="text-indigo-300 text-sm mt-3 font-medium tracking-wide">
          Learn • Grow • Connect
        </p>
      </motion.div>
    </div>
  );
}
