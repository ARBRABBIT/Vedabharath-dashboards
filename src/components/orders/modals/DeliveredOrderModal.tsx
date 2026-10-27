"use client";

import { Check, Download, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import type { Order, OrderItem } from "../OrderCard";
import { ModalShell } from "./ModalShell";
import { deliveredOn, pillClasses, splitVariant } from "./modalHelpers";

type DeliveredOrderModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onDownloadInvoice: () => void;
};

function currencyToNumber(price: string) {
  return Number(price.replace(/[^\d.]/g, "")) || 0;
}

function DeliveredItemRow({ item }: { item: OrderItem }) {
  const { packSize, price } = splitVariant(item.variant);
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/Warehouse/product.png"
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-lg object-cover"
      />
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-[#171D15]">{item.name}</span>
        <span className="text-xs text-[#6E7B6A]">
          {packSize} • {price}
        </span>
      </div>
      <span className="text-sm font-bold text-[#171D15]">x{item.qty}</span>
    </div>
  );
}

export function DeliveredOrderModal({ order, open, onClose, onDownloadInvoice }: DeliveredOrderModalProps) {
  const items = order.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const { price } = splitVariant(item.variant);
    return sum + currencyToNumber(price) * item.qty;
  }, 0);

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[900px]">
      <div className="max-h-[92vh] overflow-y-auto p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#171D15]">Order {order.id}</h2>
            <span className={pillClasses("green")}>DELIVERED</span>
          </div>
          <span className={pillClasses("blue")}>Delivered</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-xl border border-[#F1F5F9] p-4">
            <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
              Status Update
            </span>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-[#3BB54A]">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-[#171D15]">Delivered Successfully</span>
                <span className="text-xs text-[#86868B]">
                  Package handed to customer on {deliveredOn(order.id)}.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#F1F5F9] pt-4">
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                Ordered Items
              </span>
              {items.map((item) => (
                <DeliveredItemRow key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-[#F1F5F9] p-4">
            <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
              Customer Details
            </span>
            <span className="text-sm font-bold text-[#171D15]">{order.customer}</span>
            {order.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-[#F9A51A]" strokeWidth={2} />
                <span className="text-sm text-[#3E4A3C]">{order.phone}</span>
              </div>
            )}
            {order.address && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F9A51A]" strokeWidth={2} />
                <span className="text-xs leading-[18px] text-[#3E4A3C]">{order.address}</span>
              </div>
            )}

            <div className="mt-2 flex flex-col gap-2.5 border-t border-[#F1F5F9] pt-3">
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                Payment Summary
              </span>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6E7B6A]">Paid via</span>
                <span className="font-bold text-[#171D15]">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6E7B6A]">Subtotal</span>
                <span className="font-semibold text-[#171D15]">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6E7B6A]">Shipping</span>
                <span className="font-semibold text-[#3BB54A]">FREE</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-2.5 text-base font-bold text-[#171D15]">
                <span>Total</span>
                <span>{order.amount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onDownloadInvoice}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E5E5E7] py-3 text-sm font-semibold text-[#171D15] transition-colors hover:bg-[#F5F5F7]"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
