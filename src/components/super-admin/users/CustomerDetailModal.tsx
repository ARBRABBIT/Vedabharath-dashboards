"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Customer } from "@/components/super-admin/users/usersData";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type CustomerDetailModalProps = {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
};

export function CustomerDetailModal({ customer, open, onClose }: CustomerDetailModalProps) {
  if (!customer) return null;

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[820px]">
      <div className="max-h-[88vh] overflow-y-auto p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EBF7EC] text-xl font-bold text-[#22C55E]">
            {initials(customer.name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">{customer.name}</h2>
            <p className="mt-0.5 text-sm text-[#6B7280]">
              {customer.id} • Member since {customer.joinedOn}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#E5E7EB] p-5">
            <p className="text-xs text-[#6B7280]">Lifetime Value</p>
            <p className="mt-1.5 text-2xl font-bold text-[#22C55E]">₹{customer.lifetimeValue.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] p-5">
            <p className="text-xs text-[#6B7280]">Total Orders</p>
            <p className="mt-1.5 text-2xl font-bold text-black">{customer.orders} Orders</p>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] p-5">
            <p className="text-xs text-[#6B7280]">Joined Date</p>
            <p className="mt-1.5 text-2xl font-bold text-[#22C55E]">{customer.joinedOn}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Contact Information</p>
              <div className="mt-3 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#374151]">Email Address</label>
                  <div className="relative mt-1 flex items-center">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" strokeWidth={2} />
                    <input
                      type="text"
                      readOnly
                      value={customer.email}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-10 pr-3.5 text-sm text-[#1F2937] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#374151]">Phone Number</label>
                  <div className="relative mt-1 flex items-center">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" strokeWidth={2} />
                    <input
                      type="text"
                      readOnly
                      value={customer.phone}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-10 pr-3.5 text-sm text-[#1F2937] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                Primary Shipping Address
              </p>
              <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#9CA3AF]" strokeWidth={2} />
                <textarea
                  readOnly
                  rows={3}
                  value={customer.address}
                  className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-10 pr-3.5 text-sm leading-relaxed text-[#1F2937] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="sm:border-l sm:border-[#E5E7EB] sm:pl-10">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Recent Orders</p>
            <div className="mt-3 flex flex-col gap-2.5">
              {customer.recentOrders.map((order, index) => (
                <div
                  key={`${order.txn}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-black">{order.txn}</p>
                    <p className="text-xs text-[#9CA3AF]">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-black">₹{order.amount.toLocaleString()}</span>
                    <span className="inline-flex rounded-full bg-[#EBF7EC] px-2.5 py-1 text-[10px] font-bold text-[#22C55E]">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-[#F3F4F6] pt-6">
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
