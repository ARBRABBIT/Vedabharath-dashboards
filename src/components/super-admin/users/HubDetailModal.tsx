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
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[760px]">
      <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-7">
        <h2 className="text-xl font-bold text-black">{hub.name}</h2>

        {/* 4 Stat Cards in a row */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-[#F9FAFB] p-3.5">
            <p className="text-[11px] font-medium text-[#6B7280]">Orders Dispatched Today</p>
            <p className="mt-1 text-lg font-bold text-black">{hub.ordersDispatchedToday}</p>
          </div>
          <div className="rounded-2xl bg-[#F9FAFB] p-3.5">
            <p className="text-[11px] font-medium text-[#6B7280]">Total Inventory Volume</p>
            <p className="mt-1 text-lg font-bold text-black">{hub.totalInventoryVolumeKg.toLocaleString()} kg</p>
          </div>
          <div className="rounded-2xl bg-[#F9FAFB] p-3.5">
            <p className="text-[11px] font-medium text-[#6B7280]">Orders Yet To Pack</p>
            <p className="mt-1 text-lg font-bold text-black">{hub.ordersYetToPack}</p>
          </div>
          <div className="rounded-2xl bg-[#F9FAFB] p-3.5">
            <p className="text-[11px] font-medium text-[#6B7280]">Low Stock Item</p>
            <p className="mt-1 truncate text-lg font-bold text-[#EF4444]">{hub.lowStockItem}</p>
          </div>
        </div>

        {/* 2-Column Section: Facility Address & Map on left, Active Admins on right */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Left: Facility Address & Map */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Facility Address</p>
            <div className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-[#374151]">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F7931E]" strokeWidth={2} />
              <span>{hub.facilityAddress}</span>
            </div>

            <div className="relative mt-3 flex h-[130px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#EEF2F1]">
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
          </div>

          {/* Right: Active Administrators */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Active Administrators</p>
            <div className="mt-2 flex flex-col divide-y divide-[#F3F4F6] rounded-2xl border border-[#F3F4F6] bg-[#FAFAFA] px-3">
              {admins.length === 0 && (
                <p className="py-5 text-center text-xs text-[#9CA3AF]">No administrators assigned.</p>
              )}
              {admins.map((admin) => (
                <button
                  key={admin.id}
                  type="button"
                  onClick={() => onSelectAdmin(admin)}
                  className="flex cursor-pointer items-center justify-between gap-3 py-2.5 text-left transition-colors hover:bg-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white">
                      {initials(admin.name)}
                    </div>
                    <span className="truncate text-xs font-semibold text-black">{admin.name}</span>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-[#6B7280]">{admin.phone}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-6 flex justify-end border-t border-[#F3F4F6] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
