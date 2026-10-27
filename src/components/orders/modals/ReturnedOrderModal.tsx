"use client";

import { CheckCircle2, MapPin, MessageCircleQuestion, Phone, Truck, Wallet } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { Order } from "../OrderCard";
import { ModalShell } from "./ModalShell";
import { PRIMARY_BUTTON, initials, pillClasses, splitVariant } from "./modalHelpers";
import type { ReturnResolution } from "./returnResolution";

type ReturnedOrderModalProps = {
  order: Order;
  open: boolean;
  resolution: ReturnResolution | null;
  onClose: () => void;
  onProcessRefund: () => void;
  onAssignReplacement: (details: { driverName: string; driverPhone: string }) => void;
  onViewTicket: () => void;
};

const RETURN_SHIPPING_FEE = 50;

export function ReturnedOrderModal({ order, open, resolution, onClose, onProcessRefund, onAssignReplacement, onViewTicket }: ReturnedOrderModalProps) {
  const id = useId();
  const [mode, setMode] = useState<"return" | "replacement">("replacement");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const selectedMode = resolution?.type ?? mode;
  const nameError = submitted && !driverName.trim();
  const phoneError = submitted && !/^[0-9]{10}$/.test(driverPhone);
  const items = order.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + (Number(splitVariant(item.variant).price.replace(/[^\d.]/g, "")) || 0) * item.qty, 0);
  const walletAmount = Math.max(subtotal - RETURN_SHIPPING_FEE, 0);

  function closeDetails() {
    setMode("replacement");
    setSubmitted(false);
    onClose();
  }

  function assignReplacement() {
    setSubmitted(true);
    if (!driverName.trim()) { nameRef.current?.focus(); return; }
    if (!/^[0-9]{10}$/.test(driverPhone)) { phoneRef.current?.focus(); return; }
    if (!resolution) onAssignReplacement({ driverName: driverName.trim(), driverPhone: `+91 ${driverPhone}` });
  }

  return (
    <ModalShell open={open} onClose={closeDetails} maxWidth="max-w-[900px]">
      <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pr-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[#171D15]">Return / Replacement</h2>
            <p className="text-sm text-[#6E7B6A]">Order {order.id} · {order.customer}</p>
          </div>
          <button type="button" onClick={onViewTicket} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-[#E5E5E7] px-4 py-2 text-xs font-semibold text-[#171D15] hover:bg-[#F5F5F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931E]">
            <MessageCircleQuestion aria-hidden="true" className="h-3.5 w-3.5" />
            View Support Ticket
          </button>
        </div>

        <fieldset className="mt-6">
          <legend className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">Resolution Type</legend>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {([
              { value: "replacement", label: "Replacement", description: "Assign a driver for a replacement order", icon: Truck },
              { value: "return", label: "Return", description: "Add money to the user's wallet", icon: Wallet },
            ] as const).map((option) => (
              <label key={option.value} className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${resolution ? "cursor-default" : "cursor-pointer"} ${selectedMode === option.value ? "border-[#F7931E] bg-[#FEF3E2]" : "border-[#E5E5E7] bg-white hover:bg-[#F5F5F7]"}`}>
                <input type="radio" name={`${id}-resolution`} value={option.value} checked={selectedMode === option.value} disabled={Boolean(resolution)} onChange={() => { setMode(option.value); setSubmitted(false); }} className="h-4 w-4 shrink-0 accent-[#F7931E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7931E]" />
                <option.icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#F7931E]" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-bold text-[#171D15]">{option.label}</span>
                  <span className="text-xs text-[#6E7B6A]">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <section className="rounded-xl border border-[#F1F5F9] p-4">
              <h3 className="text-sm font-bold text-[#171D15]">Order Details</h3>
              <p className="mt-1 text-xs text-[#86868B]">{order.id} · {order.amount} · {order.paymentMethod}</p>
              <div className="mt-4 flex flex-col gap-3">
                {items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex items-center gap-3 border-t border-[#F1F5F9] pt-3 first:border-0 first:pt-0">
                    <Image src="/Warehouse/product.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#171D15]">{item.name}</p>
                      <p className="text-xs text-[#6E7B6A]">{splitVariant(item.variant).packSize}</p>
                    </div>
                    <span className="text-sm font-bold text-[#171D15]">x{item.qty}</span>
                  </div>
                ))}
                {items.length === 0 && <p className="text-sm text-[#86868B]">No items on this order.</p>}
              </div>
            </section>
            <section className="flex flex-col gap-3 rounded-xl border border-[#F1F5F9] p-4">
              <h3 className="text-sm font-bold text-[#171D15]">{selectedMode === "replacement" ? "Delivery Details" : "Customer Details"}</h3>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E]/10 text-xs font-bold text-[#F7931E]">{initials(order.customer)}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#171D15]">{order.customer}</p>
                  {order.phone && <p className="mt-1 flex items-center gap-1.5 text-xs text-[#6E7B6A]"><Phone aria-hidden="true" className="h-3 w-3" />{order.phone}</p>}
                </div>
              </div>
              {order.address && <p className="flex items-start gap-2 border-t border-[#F1F5F9] pt-3 text-xs leading-[18px] text-[#3E4A3C]"><MapPin aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F7931E]" />{order.address}</p>}
            </section>
          </div>

          <div className="flex flex-col gap-4">
            {resolution ? (
              <section role="status" className="flex flex-col gap-4 rounded-xl border border-[#3BB54A]/30 bg-[#EBF7EC] p-5">
                <CheckCircle2 aria-hidden="true" className="h-7 w-7 text-[#3BB54A]" />
                <h3 className="text-lg font-bold text-[#171D15]">{resolution.type === "return" ? "Money Added to Wallet" : "Replacement Assigned"}</h3>
                {resolution.type === "return" ? (
                  <p className="text-sm leading-relaxed text-[#3E4A3C]">₹{resolution.amount.toFixed(2)} added to {order.customer}&apos;s wallet.</p>
                ) : (
                  <dl className="flex flex-col gap-3 text-sm">
                    <div><dt className="text-xs text-[#6E7B6A]">Delivery Partner</dt><dd className="font-semibold text-[#171D15]">Self Delivery</dd></div>
                    <div><dt className="text-xs text-[#6E7B6A]">Driver Name</dt><dd className="break-words font-semibold text-[#171D15]">{resolution.driverName}</dd></div>
                    <div><dt className="text-xs text-[#6E7B6A]">Phone Number</dt><dd className="font-semibold text-[#171D15]">{resolution.driverPhone}</dd></div>
                  </dl>
                )}
              </section>
            ) : selectedMode === "return" ? (
              <section className="flex flex-col gap-4 rounded-xl border border-[#F1F5F9] p-5">
                <div className="flex items-center gap-2"><Wallet aria-hidden="true" className="h-5 w-5 text-[#F7931E]" /><h3 className="text-sm font-bold text-[#171D15]">Add Money to User Wallet</h3></div>
                <p className="text-sm text-[#6E7B6A]">Credit the return amount to {order.customer}&apos;s wallet.</p>
                <dl className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-[#6E7B6A]">Subtotal</dt><dd className="font-semibold text-[#171D15]">₹{subtotal.toFixed(2)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-[#6E7B6A]">Return Shipping</dt><dd className="font-semibold text-[#DC2626]">−₹{RETURN_SHIPPING_FEE.toFixed(2)}</dd></div>
                  <div className="border-t border-[#F1F5F9] pt-4"><dt className="text-xs text-[#6E7B6A]">Wallet Credit Amount</dt><dd className="mt-1 text-2xl font-bold text-[#171D15]">₹{walletAmount.toFixed(2)}</dd></div>
                </dl>
                <button type="button" disabled={walletAmount <= 0} onClick={onProcessRefund} className={`w-full disabled:cursor-not-allowed disabled:opacity-50 ${PRIMARY_BUTTON}`}>Add Money to User Wallet</button>
              </section>
            ) : (
              <section className="flex flex-col gap-4 rounded-xl border border-[#F1F5F9] p-5">
                <h3 className="text-sm font-bold text-[#171D15]">Assign Delivery Person</h3>
                <span className={`w-fit ${pillClasses("orange")}`}>Self Delivery</span>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${id}-driver-name`} className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">Delivery Person Name</label>
                  <input ref={nameRef} id={`${id}-driver-name`} name="replacementDriverName" type="text" autoComplete="off" value={driverName} onChange={(event) => setDriverName(event.target.value)} placeholder="Enter delivery person name" aria-invalid={nameError} aria-describedby={nameError ? `${id}-name-error` : undefined} className={`h-14 w-full rounded-xl bg-[#F5F5F7] px-4 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus-visible:ring-2 ${nameError ? "ring-1 ring-[#DC2626] focus-visible:ring-[#DC2626]" : "focus-visible:ring-[#F7931E]"}`} />
                  {nameError && <p role="alert" id={`${id}-name-error`} className="text-xs font-medium text-[#DC2626]">Please enter the driver&apos;s name.</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${id}-driver-phone`} className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">Delivery Person Phone Number</label>
                  <div className={`flex h-14 items-center gap-3 rounded-xl bg-[#F5F5F7] px-4 focus-within:ring-2 ${phoneError ? "ring-1 ring-[#DC2626] focus-within:ring-[#DC2626]" : "focus-within:ring-[#F7931E]"}`}>
                    <span id={`${id}-country-code`} className="shrink-0 border-r border-[#E5E5E7] pr-3 text-sm font-semibold text-[#171D15]">+91</span>
                    <input ref={phoneRef} id={`${id}-driver-phone`} name="replacementDriverPhone" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} autoComplete="off" value={driverPhone} onChange={(event) => setDriverPhone(event.target.value.replace(/[^0-9]/g, "").slice(0, 10))} placeholder="Enter 10-digit number" aria-invalid={phoneError} aria-describedby={`${id}-country-code${phoneError ? ` ${id}-phone-error` : ""}`} className="w-full min-w-0 bg-transparent text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B]" />
                  </div>
                  {phoneError && <p role="alert" id={`${id}-phone-error`} className="text-xs font-medium text-[#DC2626]">Please enter a valid 10-digit phone number.</p>}
                </div>
                <button type="button" onClick={assignReplacement} className={`mt-1 w-full ${PRIMARY_BUTTON}`}>Assign Replacement</button>
              </section>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end border-t border-[#F1F5F9] pt-5">
          <button type="button" onClick={closeDetails} className="cursor-pointer rounded-xl border border-[#E5E5E7] px-6 py-3 text-sm font-semibold text-[#171D15] hover:bg-[#F5F5F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931E]">{resolution ? "Done" : "Close"}</button>
        </div>
      </div>
    </ModalShell>
  );
}
