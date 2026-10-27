"use client";

import { motion } from "framer-motion";
import { FolderOpen, Info } from "lucide-react";
import { ModalShell } from "@/components/orders/modals/ModalShell";

type SaveDraftModalProps = {
  open: boolean;
  onKeepEditing: () => void;
  onSaveAsDraft: () => void;
};

export function SaveDraftModal({ open, onKeepEditing, onSaveAsDraft }: SaveDraftModalProps) {
  return (
    <ModalShell open={open} onClose={onKeepEditing} maxWidth="max-w-[440px]">
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
            <FolderOpen className="h-7 w-7 text-[#F7931E]" strokeWidth={2} />
          </motion.div>
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-black">Save Progress as Draft?</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            You have un-published changes in this form. Saving as a draft will move this record to your
            Drafts workspace so you can resume later.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#FEF3E2] p-3 text-left text-xs text-[#B45309]">
          <Info className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span className="whitespace-nowrap">
            Saved drafts will be accessible under the &lsquo;Drafts&rsquo; category
          </span>
        </div>

        <div className="mt-2 flex w-full items-center gap-3">
          <button
            type="button"
            onClick={onKeepEditing}
            className="flex-1 cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Keep Draft
          </button>
          <button
            type="button"
            onClick={onSaveAsDraft}
            className="flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
