"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: ReactNode;
};

export function ModalShell({ open, onClose, maxWidth = "max-w-[500px]", children }: ModalShellProps) {
  useEffect(() => {
    if (!open) return;

    // Disable body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 py-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className={`modal-card relative w-full ${maxWidth} overflow-hidden rounded-[24px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.12)]`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F5F5F7] text-[#6E7B6A] transition-colors hover:bg-[#e9e9ec]"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
