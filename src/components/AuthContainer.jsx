// src/components/AuthContainer.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

export default function AuthContainer({ children }) {
  const location = useLocation();

  const getDirection = () => {
    if (location.pathname.includes("register")) return 1; // Slide right
    if (location.pathname.includes("login")) return -1; // Slide left
    return 0;
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden w-full h-screen">
      <AnimatedBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 80 * getDirection() }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 * getDirection() }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-md"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
