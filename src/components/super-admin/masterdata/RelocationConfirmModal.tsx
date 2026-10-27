"use client";

import { ArrowRight, ArrowRightLeft } from "lucide-react";
import { ModalShell } from "@/components/orders/modals/ModalShell";

type RelocationConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  productName: string;
  fromLabel: string;
  toLabel: string;
  onConfirm: () => void;
};

export function RelocationConfirmModal({
  open,
  onClose,
  productName,
  fromLabel,
  toLabel,
  onConfirm,
}: RelocationConfirmModalProps) {
  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[440px]">
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]">
          <ArrowRightLeft className="h-6 w-6 text-[#F7931E]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-black">Confirm Product Relocation?</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            You are Changing <span className="font-semibold text-black">{productName}</span> to a New Position.
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-3 rounded-xl bg-[#F9FAFB] p-4 text-left">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">Storefront Grid</p>
            <p className="text-sm font-semibold text-[#6B7280]">{fromLabel}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#F7931E]" strokeWidth={2} />
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">Storefront Grid</p>
            <p className="text-sm font-semibold text-[#22C55E]">{toLabel}</p>
          </div>
        </div>

        <div className="mt-2 flex w-full items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Confirm Relocation
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
