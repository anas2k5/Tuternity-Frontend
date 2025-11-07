// src/components/PageTransition.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="sync"> {/* ✅ instant sync, no waiting */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{
            duration: 0.3, // ⚡ faster than before
            ease: "easeInOut",
          }}
          className="min-h-screen w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
