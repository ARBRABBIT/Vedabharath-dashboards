"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import type { Order } from "../OrderCard";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./modalHelpers";

type CancelOrderModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function CancelOrderModal({ order, open, onClose, onConfirm }: CancelOrderModalProps) {
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-[420px] flex-col items-center gap-6 rounded-[20px] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDAD6]">
                <Trash2 className="h-6 w-6 text-[#D93025]" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-[#1D1D1F]">Cancel Order {order.id}?</h2>
                <p className="text-sm leading-[22px] text-[#86868B]">
                  This action cannot be undone. The items will be returned to the pending inventory
                  pool and the customer will be notified of the cancellation.
                </p>
              </div>
            </div>

            <div className="flex w-full justify-center gap-4">
              <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
                Keep Order
              </button>
              <button type="button" onClick={onConfirm} className={PRIMARY_BUTTON}>
                Cancel Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
