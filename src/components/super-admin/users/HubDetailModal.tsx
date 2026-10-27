"use client";

import { MapPin } from "lucide-react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Admin, Hub } from "@/components/super-admin/users/usersData";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type HubDetailModalProps = {
  hub: Hub | null;
  admins: Admin[];
  open: boolean;
  onClose: () => void;
  onSelectAdmin: (admin: Admin) => void;
};

export function HubDetailModal({ hub, admins, open, onClose, onSelectAdmin }: HubDetailModalProps) {
  if (!hub) return null;

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[520px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black">{hub.name}</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#F9FAFB] p-4">
            <p className="text-xs text-[#6B7280]">Total Orders Dispatched Today</p>
            <p className="mt-1 text-xl font-bold text-black">{hub.ordersDispatchedToday}</p>
          </div>
          <div className="rounded-2xl bg-[#F9FAFB] p-4">
            <p className="text-xs text-[#6B7280]">Total Inventory Volume</p>
            <p className="mt-1 text-xl font-bold text-black">{hub.totalInventoryVolumeKg.toLocaleString()} kg</p>
          </div>
          <div className="rounded-2xl bg-[#F9FAFB] p-4">
            <p className="text-xs text-[#6B7280]">Orders Yet To be Packed</p>
            <p className="mt-1 text-xl font-bold text-black">{hub.ordersYetToPack}</p>
          </div>
          <div className="rounded-2xl bg-[#F9FAFB] p-4">
            <p className="text-xs text-[#6B7280]">Low Stock</p>
            <p className="mt-1 text-xl font-bold text-black">{hub.lowStockItem}</p>
          </div>
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Facility Address</p>
        <div className="mt-1.5 flex items-start gap-2 text-sm text-[#374151]">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F7931E]" strokeWidth={2} />
          {hub.facilityAddress}
        </div>

        <div className="relative mt-3 flex h-[140px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#EEF2F1]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <MapPin className="relative h-7 w-7 text-[#F7931E]" strokeWidth={2} fill="#FEF3E2" />
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Active Administrators</p>
        <div className="mt-1.5 flex flex-col divide-y divide-[#F3F4F6]">
          {admins.length === 0 && <p className="py-3 text-sm text-[#9CA3AF]">No administrators assigned.</p>}
          {admins.map((admin) => (
            <button
              key={admin.id}
              type="button"
              onClick={() => onSelectAdmin(admin)}
              className="flex cursor-pointer items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-[#F9FAFB]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white">
                  {initials(admin.name)}
                </div>
                <span className="text-sm font-semibold text-black">{admin.name}</span>
              </div>
              <span className="text-sm text-[#EF4444]">{admin.phone}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Done
        </button>
      </div>
    </ModalShell>
  );
}
