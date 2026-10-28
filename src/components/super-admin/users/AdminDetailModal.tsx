"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft, LogOut, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Admin, Hub } from "@/components/super-admin/users/usersData";

const ZONES = ["South Bangalore", "North Hyderabad", "West Bangalore", "Central Hyderabad"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type AdminDetailModalProps = {
  admin: Admin | null;
  hub: Hub | null;
  hubs: Hub[];
  allAdmins: Admin[];
  open: boolean;
  onClose: () => void;
  onSuspend: (adminId: string) => void;
  onReassign: (adminId: string, newHubId: string) => void;
};

export function AdminDetailModal({ admin, hub, hubs, allAdmins, open, onClose, onSuspend, onReassign }: AdminDetailModalProps) {
  const [step, setStep] = useState<"detail" | "reassignForm" | "reassignConfirm" | "suspendConfirm">("detail");
  const [selectedHubId, setSelectedHubId] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [zone, setZone] = useState(ZONES[0]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (open) {
      setStep("detail");
      setSelectedHubId(hub?.id ?? hubs[0]?.id ?? "");
      setSelectedAdminId(admin?.id ?? "");
      setZone(ZONES[0]);
      setAddress(hub?.facilityAddress ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!admin) return null;

  const selectedHub = hubs.find((item) => item.id === selectedHubId) ?? null;
  const selectedAdmin = allAdmins.find((item) => item.id === selectedAdminId) ?? admin;

  function closeAll() {
    setStep("detail");
    onClose();
  }

  if (step === "reassignForm") {
    return (
      <ModalShell open={open} onClose={closeAll} maxWidth="max-w-[440px]">
        <div className="p-6">
          <h2 className="text-xl font-bold text-black">Re-Assign Distribution Warehouse</h2>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-black">Warehouse Name</label>
              <select
                value={selectedHubId}
                onChange={(event) => {
                  setSelectedHubId(event.target.value);
                  const nextHub = hubs.find((item) => item.id === event.target.value);
                  setAddress(nextHub?.facilityAddress ?? "");
                }}
                className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#F7931E]"
              >
                {hubs.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-black">Regional Zone</label>
              <select
                value={zone}
                onChange={(event) => setZone(event.target.value)}
                className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#F7931E]"
              >
                {ZONES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-black">Select Admin</label>
              <select
                value={selectedAdminId}
                onChange={(event) => setSelectedAdminId(event.target.value)}
                className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#F7931E]"
              >
                {allAdmins.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">Physical Address</label>
              <label className="mt-2 block text-sm font-semibold text-black">Full Address</label>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#F7931E]"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-5">
            <button
              type="button"
              onClick={closeAll}
              className="cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-7 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB] hover:text-black"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep("reassignConfirm")}
              className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Re-Assign
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  if (step === "reassignConfirm") {
    const previousHub = hubs.find((item) => item.id === selectedAdmin.hubId) ?? null;
    return (
      <ModalShell open={open} onClose={closeAll} maxWidth="max-w-[420px]">
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
              <ArrowRightLeft className="h-6 w-6 text-[#22C55E]" strokeWidth={2} />
            </motion.div>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-black">Confirm Admin Re-Assign?</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              You are Assigning <span className="font-semibold text-black">{selectedAdmin.name}</span> to a New Hub.
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-3 rounded-xl bg-[#F9FAFB] p-4 text-left">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">Previous Hub</p>
              <p className="text-sm font-semibold text-[#6B7280]">{previousHub?.name ?? "Unassigned"}</p>
            </div>
            <ArrowRightLeft className="h-4 w-4 shrink-0 text-[#F7931E]" strokeWidth={2} />
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">New Hub</p>
              <p className="text-sm font-semibold text-[#22C55E]">{selectedHub?.name ?? "-"}</p>
            </div>
          </div>

          <div className="mt-2 flex w-full items-center gap-3">
            <button
              type="button"
              onClick={() => setStep("reassignForm")}
              className="flex-1 cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onReassign(selectedAdminId, selectedHubId);
                closeAll();
              }}
              className="flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Confirm Re-Assign
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  if (step === "suspendConfirm") {
    return (
      <ModalShell open={open} onClose={closeAll} maxWidth="max-w-[400px]">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE2E2]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
            >
              <LogOut className="h-6 w-6 text-[#EF4444]" strokeWidth={2} />
            </motion.div>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-black">
              {admin.status === "Active" ? "Suspend Account?" : "Reactivate Account?"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              {admin.status === "Active"
                ? "Are you sure you want to Suspend Account? all the data will be lost forever."
                : "Are you sure you want to reactivate this account?"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onSuspend(admin.id);
              closeAll();
            }}
            className={`mt-2 w-full cursor-pointer rounded-full py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 ${
              admin.status === "Active" ? "bg-[#EF4444]" : "bg-[#F7931E]"
            }`}
          >
            {admin.status === "Active" ? "Suspend" : "Reactivate"}
          </button>
          <button
            type="button"
            onClick={() => setStep("detail")}
            className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
          >
            Cancel
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell open={open} onClose={closeAll} maxWidth="max-w-[520px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black">{admin.name}</h2>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-lg font-bold text-white">
            {initials(admin.name)}
          </div>
          <div>
            <span className="inline-flex rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3B82F6]">
              {admin.status === "Active" ? "Warehouse Admin" : "Suspended"}
            </span>
            <p className="mt-1 text-sm text-[#6B7280]">{admin.email}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#F9FAFB] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Current Assignment</p>
          <p className="mt-1 text-sm font-semibold text-black">{hub?.name ?? "Unassigned"}</p>
        </div>

        <div className="mt-5 border-t border-[#F3F4F6] pt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Contact Details</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            <div>
              <p className="text-sm font-semibold text-black">Contact Number</p>
              <p className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <Phone className="h-3.5 w-3.5" strokeWidth={2} />
                {admin.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep("suspendConfirm")}
            className="flex-1 cursor-pointer rounded-full border-2 border-[#FCA5A5] py-3 text-sm font-bold text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
          >
            {admin.status === "Active" ? "Suspend Account" : "Reactivate Account"}
          </button>
          <button
            type="button"
            onClick={() => setStep("reassignForm")}
            className="flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Reassign Hub
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
