"use client";

import { motion } from "framer-motion";
import { Check, FolderCheck, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { SaveDraftModal } from "@/components/super-admin/content/SaveDraftModal";
import { ModalShell } from "@/components/orders/modals/ModalShell";

export type FormField = {
  key: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  numericOnly?: boolean;
  suffix?: string;
};

type FormModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  helperText?: string;
  fields: FormField[];
  submitLabel: string;
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
};

export function FormModal({ open, onClose, title, helperText, fields, submitLabel, initialValues, onSubmit }: FormModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"form" | "draft" | "draftSuccess" | "success">("form");

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? {});
      setStep("form");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit() {
    onSubmit(values);
    setStep("success");
  }

  if (step === "draft") {
    return (
      <SaveDraftModal
        open={open}
        onKeepEditing={() => setStep("form")}
        onSaveAsDraft={() => setStep("draftSuccess")}
      />
    );
  }

  if (step === "draftSuccess") {
    return (
      <ModalShell open={open} onClose={onClose} maxWidth="max-w-[420px]">
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
              <FolderCheck className="h-7 w-7 text-[#F7931E]" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-black">Saved as Draft</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              This record has been moved to your Drafts workspace so you can resume later.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("form");
              onClose();
            }}
            className="mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  if (step === "success") {
    return (
      <ModalShell open={open} onClose={onClose} maxWidth="max-w-[420px]">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
            >
              <Check className="h-7 w-7 text-[#22C55E]" strokeWidth={3} />
            </motion.div>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-black">{title} Saved Successfully</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">Your changes are now live and visible on the storefront.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("form");
              onClose();
            }}
            className="mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[420px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black">{title}</h2>

        <div className="mt-5 flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.key}>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-black">{field.label}</label>
                {field.required && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">Required</span>
                )}
              </div>
              {field.type === "textarea" ? (
                <textarea
                  value={values[field.key] ?? ""}
                  onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
                  placeholder={field.placeholder}
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]"
                />
              ) : (
                <div className="relative mt-1.5 flex items-center">
                  <input
                    type="text"
                    inputMode={field.numericOnly ? "numeric" : undefined}
                    maxLength={field.maxLength}
                    value={values[field.key] ?? ""}
                    onChange={(event) => {
                      let val = event.target.value;
                      if (field.numericOnly) {
                        val = val.replace(/[^0-9]/g, "");
                      }
                      if (field.maxLength) {
                        val = val.slice(0, field.maxLength);
                      }
                      setValues((prev) => ({ ...prev, [field.key]: val }));
                    }}
                    placeholder={field.placeholder}
                    className={`w-full rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E] ${
                      field.suffix ? "pr-14" : ""
                    }`}
                  />
                  {field.suffix && (
                    <span className="pointer-events-none absolute right-4 text-sm font-semibold text-[#6B7280]">
                      {field.suffix}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          {helperText && (
            <p className="flex items-center gap-1.5 text-xs text-[#F7931E]">
              <Tag className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {helperText}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setStep("draft")}
            className="cursor-pointer rounded-full border border-[#E5E7EB] px-8 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
