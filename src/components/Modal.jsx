import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ show, onClose, title, children, width = "w-96" }) {
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white text-gray-800 rounded-2xl shadow-xl ${width} p-6 relative`}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            {title && (
              <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
            )}

            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
