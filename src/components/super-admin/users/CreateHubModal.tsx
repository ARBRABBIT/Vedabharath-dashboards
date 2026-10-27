"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Admin, Hub } from "@/components/super-admin/users/usersData";

const ZONES = ["North Bangalore", "South Bangalore", "East Bangalore", "Hyderabad", "Secunderabad"];

export type HubFormData = {
  name: string;
  zone: string;
  address: string;
  adminId: string;
};

type CreateHubModalProps = {
  open: boolean;
  onClose: () => void;
  initial?: Hub | null;
  admins?: Admin[];
  onSave: (data: HubFormData) => void;
};

export function CreateHubModal({ open, onClose, initial, admins = [], onSave }: CreateHubModalProps) {
  const [name, setName] = useState("");
  const [zone, setZone] = useState("");
  const [address, setAddress] = useState("");
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setZone("");
    setAddress(initial?.facilityAddress ?? "");
    setAdminId(admins.find((admin) => admin.hubId === initial?.id)?.id ?? "");
    setError(false);
    setStep("form");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  function handleCreate() {
    if (!name.trim() || !address.trim()) {
      setError(true);
      return;
    }
    onSave({ name: name.trim(), zone: zone || ZONES[0], address: address.trim(), adminId });
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
            <h2 className="text-xl font-bold text-black">{initial ? "Hub Updated" : "Distribution Hub Created"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              <span className="font-semibold text-black">{name.trim()}</span>{" "}
              {initial ? "has been updated successfully." : "has been registered and is now active."}
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
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[460px]">
      <div className="p-6">
        <h2 className="text-lg font-bold text-black">
          {initial ? "Edit Distribution Hub" : "Register New Distribution Hub"}
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-black">Hub Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g., Whitefield Logistics Center"
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-black">Regional Zone</label>
            <select
              value={zone}
              onChange={(event) => setZone(event.target.value)}
              className={`mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] py-2.5 pl-4 pr-10 text-sm outline-none focus:border-[#F7931E] ${
                zone ? "text-black" : "text-[#9CA3AF]"
              }`}
            >
              <option value="" disabled>
                e.g., South Bangalore
              </option>
              {ZONES.map((option) => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-black">Select Admin</label>
            <select
              value={adminId}
              onChange={(event) => setAdminId(event.target.value)}
              className={`mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] py-2.5 pl-4 pr-10 text-sm outline-none focus:border-[#F7931E] ${
                adminId ? "text-black" : "text-[#9CA3AF]"
              }`}
            >
              <option value="">Select Admin</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id} className="text-black">
                  {admin.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Physical Address</p>
            <label className="mt-2 block text-sm font-semibold text-black">Full Address</label>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="e.g., Plot 45, Industrial Area..."
              rows={3}
              className="mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#EF4444]">
              Please fill in Hub Name and Full Address.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-6 border-t border-[#F3F4F6] pt-5">
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
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
