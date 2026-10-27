"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Hub } from "@/components/super-admin/users/usersData";

type CreateAdminModalProps = {
  open: boolean;
  onClose: () => void;
  hubs: Hub[];
  onCreate: (data: { name: string; email: string; hubId: string }) => void;
};

export function CreateAdminModal({ open, onClose, hubs, onCreate }: CreateAdminModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hubId, setHubId] = useState(hubs[0]?.id ?? "");
  const [error, setError] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  useEffect(() => {
    if (!open) return;
    setName("");
    setEmail("");
    setHubId(hubs[0]?.id ?? "");
    setError(false);
    setStep("form");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleCreate() {
    if (!name.trim() || !email.trim() || !hubId) {
      setError(true);
      return;
    }
    onCreate({ name: name.trim(), email: email.trim(), hubId });
    setStep("success");
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
            <h2 className="text-xl font-bold text-black">Administrator Created</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              <span className="font-semibold text-black">{name.trim()}</span> has been registered and assigned to{" "}
              {hubs.find((hub) => hub.id === hubId)?.name ?? "the selected hub"}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[520px]">
      <div className="p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]">
          <ShieldCheck className="h-6 w-6 text-[#F7931E]" strokeWidth={2} />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-black">Register Hub Administrator</h2>
        <p className="mt-1.5 text-sm text-[#6B7280]">Generate secure credentials for a new warehouse manager.</p>

        <div className="mt-6 flex flex-col gap-4 text-left">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[#374151]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter administrator's full name"
              className="mt-1.5 w-full rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[#374151]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@vedabharath.com"
              className="mt-1.5 w-full rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-black">Assign to Distribution Hub</label>
            <select
              value={hubId}
              onChange={(event) => setHubId(event.target.value)}
              className="mt-1.5 w-full cursor-pointer rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#F7931E]"
            >
              {hubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-center text-sm font-medium text-[#EF4444]">Please fill in all fields.</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-8 border-t border-[#F3F4F6] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm font-bold text-[#EF4444] hover:opacity-80"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="cursor-pointer rounded-full bg-[#F7931E] px-10 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Create
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
