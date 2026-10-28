"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Hub } from "@/components/super-admin/users/usersData";

function AssignWarehouseDropdown({
  value,
  onChange,
  hubs,
}: {
  value: string;
  onChange: (id: string) => void;
  hubs: Hub[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = hubs.find((h) => h.id === value) ?? hubs[0];

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative mt-1.5" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
          open
            ? "border border-[#F7931E] bg-white ring-2 ring-[#F7931E]/20"
            : "bg-[#F5F5F7] text-black hover:bg-[#EEEEEF]"
        }`}
      >
        <span className="truncate">{selected?.name ?? "Select warehouse"}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8E8E93] transition-transform duration-200 ${
            open ? "rotate-180 text-[#F7931E]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-56 overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
          {hubs.map((hub) => {
            const isSelected = hub.id === value;
            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => {
                  onChange(hub.id);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition ${
                  isSelected
                    ? "bg-[#FFF8F0] text-[#F7931E]"
                    : "text-black hover:bg-[#F5F5F7]"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className={`font-semibold ${isSelected ? "text-[#F7931E]" : "text-black"}`}>
                    {hub.name}
                  </p>
                  <p className="text-[11px] text-[#6B7280] truncate">{hub.address}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-[#F7931E]" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
        <h2 className="mt-4 text-2xl font-bold text-black">Register Warehouse Administrator</h2>
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
            <label className="text-sm font-semibold text-black">Assign to Warehouse</label>
            <AssignWarehouseDropdown value={hubId} onChange={setHubId} hubs={hubs} />
          </div>
          {error && (
            <p className="text-center text-sm font-medium text-[#EF4444]">Please fill in all fields.</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-7 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB] hover:text-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Create
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
