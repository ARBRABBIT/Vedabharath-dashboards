"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ModalShell } from "./ModalShell";
import { PRIMARY_BUTTON } from "./modalHelpers";

type InvoicePrintedModalProps = {
  open: boolean;
  onBack: () => void;
  onContinue: () => void;
};

export function InvoicePrintedModal({ open, onBack, onContinue }: InvoicePrintedModalProps) {
  return (
    <ModalShell open={open} onClose={onBack} maxWidth="max-w-[420px]">
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
          >
            <Check className="h-7 w-7 text-[#F7931E]" strokeWidth={3} />
          </motion.div>
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-[#171D15]">Invoice Printed Successfully?</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6E7B6A]">
            This order will be moved to the &lsquo;Mark as Packed&rsquo; queue.
          </p>
        </div>

        <div className="mt-2 flex w-full items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer text-sm font-semibold text-[#3E4A3C] hover:text-black"
          >
            Back
          </button>
          <button type="button" onClick={onContinue} className={PRIMARY_BUTTON}>
            Continue
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
