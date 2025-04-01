/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, X, Check } from "lucide-react";

const SharePopup = ({ isOpen, onClose, url }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Add no-scroll class to body when popup is open
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-6 mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Share this article
                </h3>
                <button
                  onClick={onClose}
                  className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center mt-4">
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-l-lg px-3 py-2 truncate">
                  <p className="truncate text-zinc-800 dark:text-zinc-200 text-sm">
                    {url}
                  </p>
                </div>
                <button
                  onClick={handleCopyClick}
                  className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-4">
                Copy the link to share this article with others
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SharePopup;
