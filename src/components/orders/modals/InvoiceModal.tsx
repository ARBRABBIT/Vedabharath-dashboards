"use client";

import Image from "next/image";
import type { Order } from "../OrderCard";
import { ModalShell } from "./ModalShell";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, deriveEmail, splitVariant } from "./modalHelpers";

type InvoiceModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onPrinted: () => void;
};

function currencyToNumber(price: string) {
  return Number(price.replace(/[^\d.]/g, "")) || 0;
}

export function InvoiceModal({ order, open, onClose, onPrinted }: InvoiceModalProps) {
  const email = deriveEmail(order.customer);
  const items = order.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const { price } = splitVariant(item.variant);
    return sum + currencyToNumber(price) * item.qty;
  }, 0);

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[580px]">
      <div id="invoice-print-area" className="max-h-[85vh] overflow-y-auto p-7 sm:p-9">
        <div className="flex items-start justify-between border-b border-[#F0F0F0] pb-6 sm:pr-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-[-0.5px] text-[#F9A51A]">ORDER DETAILS</h2>
            <p className="text-sm font-medium tracking-[0.3px] text-[#86868B]">From Soil to Soul</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#3E4A3C]">
              Tax Invoice
            </span>
            <span className="text-2xl font-bold text-[#171D15]">{order.id}</span>
            <span className="text-sm text-[#86868B]">
              Date:{" "}
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 border-b border-[#F0F0F0] py-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[1px] text-[#3E4A3C]">
              Billed To
            </span>
            <span className="text-lg font-bold text-[#171D15]">{order.customer}</span>
            <span className="text-sm leading-[23px] text-[#3E4A3C]">
              {email}
              <br />
              {order.phone}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[1px] text-[#3E4A3C]">
              Shipped To
            </span>
            <span className="text-sm leading-[23px] text-[#3E4A3C]">
              {order.address ?? "No address on file"}
            </span>
          </div>
        </div>

        <div className="py-6">
          <div className="flex justify-between pb-3 text-xs font-bold uppercase tracking-[1px] text-[#3E4A3C]">
            <span>Item</span>
            <span>Amount</span>
          </div>
          <div className="flex flex-col">
            {items.map((item) => {
              const { packSize, price } = splitVariant(item.variant);
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between border-t border-dashed border-[#F0F0F0] py-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src="/Warehouse/product.png"
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg bg-[#E9F0E3] object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-[#171D15]">{item.name}</span>
                      <span className="text-base text-[#3E4A3C]">
                        {packSize} × {item.qty} unit
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-semibold text-[#171D15]">{price}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-end justify-between gap-8 border-t border-[#F0F0F0] pt-6">
          <Image
            src="/veda-bharat-logo.png"
            alt="Veda Bharath"
            width={140}
            height={58}
            priority
            className="h-9 w-auto"
          />

          <div className="flex w-full max-w-[240px] flex-col gap-3">
            <div className="flex items-center justify-between text-base text-[#3E4A3C]">
              <span>Subtotal</span>
              <span className="text-base font-medium text-[#171D15]">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-base text-[#3E4A3C]">
              <span>Delivery</span>
              <span className="text-base font-medium text-[#3BB54A]">FREE</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-3 text-lg font-bold text-[#171D15]">
              <span>Total Paid</span>
              <span>{order.amount}</span>
            </div>
            <span className="ml-auto w-fit rounded-full bg-[#EBF7EC] px-3 py-1 text-xs font-bold text-[#F7931E]">
              Successful ({order.paymentMethod.replace(/[()]/g, "").toUpperCase()})
            </span>
          </div>
        </div>

        <div className="no-print mt-6 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              window.print();
              onPrinted();
            }}
            className={PRIMARY_BUTTON}
          >
            Print Invoice
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
