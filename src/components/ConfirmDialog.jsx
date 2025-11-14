import { motion } from "framer-motion";

const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="
          bg-white dark:bg-[#101828] 
          rounded-2xl shadow-2xl p-6 w-[90%] max-w-md
        "
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Remove Slot?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete this availability slot?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-white/10
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg
              bg-red-500 hover:bg-red-600
              text-white font-semibold
              transition
            "
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDialog;
