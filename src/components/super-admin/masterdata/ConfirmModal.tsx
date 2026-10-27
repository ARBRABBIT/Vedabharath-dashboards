"use client";

import type { LucideIcon } from "lucide-react";
import { ModalShell } from "@/components/orders/modals/ModalShell";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  noteIcon?: LucideIcon;
  noteText?: string;
  cancelLabel: string;
  onCancel: () => void;
  confirmLabel: string;
  onConfirm: () => void;
};

export function ConfirmModal({
  open,
  onClose,
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  noteIcon: NoteIcon,
  noteText,
  cancelLabel,
  onCancel,
  confirmLabel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[440px]">
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className={`h-7 w-7 ${iconColor}`} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-black">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{description}</p>
        </div>

        {noteText && (
          <div className="flex w-full items-center gap-2 rounded-xl bg-[#F9FAFB] p-3 text-left text-sm text-[#374151]">
            {NoteIcon && <NoteIcon className="h-4 w-4 shrink-0 text-[#9CA3AF]" strokeWidth={2} />}
            {noteText}
          </div>
        )}

        <div className="mt-2 flex w-full items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
