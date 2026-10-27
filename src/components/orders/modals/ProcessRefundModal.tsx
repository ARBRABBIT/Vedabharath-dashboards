"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import type { Order } from "../OrderCard";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./modalHelpers";

type ProcessRefundModalProps = {
  order: Order;
  amount: number;
  open: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onCredit: () => void;
};

export function ProcessRefundModal({ order, amount, open, onBack, onConfirm, onCredit }: ProcessRefundModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) setConfirmed(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Disable body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onBack();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onBack]);

  const formattedAmount = `₹${amount.toFixed(2)}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={confirmed ? undefined : onBack}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-[460px] flex-col items-center gap-6 rounded-[20px] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
          >
            {confirmed ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF7EC]">
                  <Check className="h-6 w-6 text-[#3BB54A]" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-[#1D1D1F]">Money Added to Wallet</h2>
                  <p className="text-sm leading-[22px] text-[#86868B]">
                    {formattedAmount} has been added to {order.customer}&apos;s wallet.
                  </p>
                </div>
                <button type="button" onClick={onConfirm} className={`w-full ${PRIMARY_BUTTON}`}>
                  Done
                </button>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF3E2]">
                  <IndianRupee className="h-6 w-6 text-[#F7931E]" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-[#1D1D1F]">Add Money to User Wallet?</h2>
                  <span className="text-3xl font-bold text-[#171D15]">{formattedAmount}</span>
                  <p className="text-sm leading-[22px] text-[#86868B]">
                    This amount will be credited to {order.customer}&apos;s wallet for this return.
                  </p>
                </div>
                <div className="flex w-full justify-center gap-3">
                  <button type="button" onClick={onBack} className={SECONDARY_BUTTON}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={amount <= 0}
                    onClick={() => {
                      if (confirmed || amount <= 0) return;
                      setConfirmed(true);
                      onCredit();
                    }}
                    className="cursor-pointer whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 rounded-xl bg-[#F7931E] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_15px_-3px_rgba(247,147,30,0.2)] transition-colors hover:bg-[#e6850f]"
                  >
                    Add {formattedAmount} to Wallet
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
