// src/components/PageTransition.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="min-h-screen w-full relative"
        >
          {/* Soft animated overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-800/10 via-purple-700/10 to-pink-700/10"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
