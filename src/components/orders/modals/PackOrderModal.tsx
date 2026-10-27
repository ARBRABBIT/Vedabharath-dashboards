"use client";

import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import type { Order } from "../OrderCard";
import { ModalShell } from "./ModalShell";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  deriveEmail,
  initials,
  pillClasses,
  placedLabel,
  splitVariant,
} from "./modalHelpers";

type PackOrderModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onPrintInvoice: () => void;
  onPackOrder: () => void;
};

export function PackOrderModal({
  order,
  open,
  onClose,
  onPrintInvoice,
  onPackOrder,
}: PackOrderModalProps) {
  const email = deriveEmail(order.customer);
  const items = order.items ?? [];
  const customerInitials = initials(order.customer);

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[820px]">
      <div className="max-h-[85vh] overflow-y-auto p-7 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#F1F5F9] pb-6 sm:pr-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-[-0.7px] text-[#171D15]">{order.id}</h2>
            <p className="text-sm font-semibold text-[#3E4A3C]/70">{placedLabel(order.time)}</p>
          </div>
          <span className={pillClasses("blue")}>Payment Confirmed</span>
        </div>

        <div className="grid grid-cols-1 gap-8 py-6 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className="text-[15px] font-bold text-[#171D15]">Items to Pack ({items.length})</h3>
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const { packSize } = splitVariant(item.variant);
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 rounded-2xl bg-[#F5F5F7] p-5"
                  >
                    <Image
                      src="/Warehouse/product.png"
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-[15px] font-bold text-[#171D15]">{item.name}</span>
                      <span className="text-[13px] text-[#3E4A3C]">
                        {packSize}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#F7931E]">x{item.qty}</span>
                  </div>
                );
              })}
              {items.length === 0 && (
                <p className="text-sm text-[#6E7B6A]">No items on this order.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#171D15]">Delivery Details</h3>
              <div className="flex items-start gap-4 rounded-2xl bg-[#F5F5F7] p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7931E]/10 text-base font-bold text-[#F7931E]">
                  {customerInitials}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-bold text-[#171D15]">{order.customer}</span>
                  <span className="text-[13px] leading-[21px] text-[#3E4A3C]">
                    {order.address ?? "No address on file"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-[#171D15]">Contact Info</h3>
              <div className="flex flex-col gap-4 rounded-2xl bg-[#F5F5F7] p-5">
                <div className="flex items-center gap-4">
                  <Phone className="h-[15px] w-[15px] shrink-0 text-[#6E7B6A]" strokeWidth={2} />
                  <span className="text-[15px] font-semibold text-[#171D15]">
                    {order.phone ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-[15px] w-[15px] shrink-0 text-[#6E7B6A]" strokeWidth={2} />
                  <span className="text-[15px] font-semibold text-[#171D15]">{email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-[#F1F5F9] pt-6">
          <button type="button" onClick={onPrintInvoice} className={SECONDARY_BUTTON}>
            Print Invoice
          </button>
          <button type="button" onClick={onPackOrder} className={PRIMARY_BUTTON}>
            Pack Order
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
