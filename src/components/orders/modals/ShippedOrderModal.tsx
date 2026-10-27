"use client";

import { Check, Phone, Truck, UserRound } from "lucide-react";
import Image from "next/image";
import type { Order } from "../OrderCard";
import { ModalShell } from "./ModalShell";
import type { ShipmentDetails } from "./shipmentDetails";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, pillClasses, placedLabel } from "./modalHelpers";

type ShippedOrderModalProps = {
  order: Order;
  shipment: ShipmentDetails | null;
  deliveredAt: string | null;
  open: boolean;
  onBack: () => void;
  onMarkDelivered: () => void;
};

type TimelineStep = { label: string; time: string; detail?: string; done: boolean };

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TimelineDot({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  return (
    <div className="flex flex-col items-center">
      {step.done ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3BB54A] text-white shadow-[0_0_0_4px_white]">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      ) : (
        <span className="h-6 w-6 shrink-0 rounded-full border-2 border-[#E5E5E7] bg-white shadow-[0_0_0_4px_white]" />
      )}
      {!isLast && (
        <span className={`mt-1 w-px flex-1 ${step.done ? "bg-[#3BB54A]" : "bg-[#E5E5E7]"}`} />
      )}
    </div>
  );
}

export function ShippedOrderModal({ order, shipment, deliveredAt, open, onBack, onMarkDelivered }: ShippedOrderModalProps) {
  const item = order.items?.[0];
  const driver = shipment?.method === "Self Delivery" ? shipment : null;

  const steps: TimelineStep[] = [
    { label: "Payment Confirmed", time: "Today, 9:16 AM", done: true },
    { label: "Packed", time: "Today, 11:45 AM", done: true },
    {
      label: "Shipped",
      detail: driver
        ? `Self Delivery • ${driver.driverName} • ${driver.driverPhone}`
        : shipment?.method === "Ship Rocket" ? `Tracking ID ${shipment.trackingNumber}` : undefined,
      time: "Today, 2:30 PM",
      done: true,
    },
    {
      label: "Delivered",
      time: deliveredAt
        ? new Date(deliveredAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })
        : "Pending",
      done: Boolean(deliveredAt),
    },
  ];

  return (
    <ModalShell open={open} onClose={onBack} maxWidth="max-w-[900px]">
      <div className="max-h-[85vh] overflow-y-auto p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-[#171D15]">{order.id}</h2>
            {order.isReplacement && (
              <span className="my-1 w-fit rounded-full bg-[#FEF3E2] px-3 py-1 text-xs font-semibold text-[#171D15]">Replacement product</span>
            )}
            <p className="text-sm font-semibold text-[#3E4A3C]/70">{placedLabel(order.time)}</p>
          </div>
          <span role="status" className={pillClasses(deliveredAt ? "green" : "blue")}>
            {deliveredAt ? "Delivered" : "Shipped"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 rounded-xl bg-[#F5F5F7] p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#6E7B6A]" strokeWidth={2} />
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                  Delivery Partner
                </span>
              </div>
              <span className="text-base font-bold text-[#171D15]">{shipment?.method ?? "Self Delivery"}</span>
              {driver ? (
                <dl className="mt-2 flex flex-col gap-3 border-t border-[#E5E5E7] pt-3">
                  <div className="flex items-start gap-2.5">
                    <UserRound aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#6E7B6A]" />
                    <div className="min-w-0">
                      <dt className="text-xs text-[#6E7B6A]">Driver Name</dt>
                      <dd className="break-words text-sm font-semibold text-[#171D15]">{driver.driverName}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#6E7B6A]" />
                    <div>
                      <dt className="text-xs text-[#6E7B6A]">Phone Number</dt>
                      <dd className="text-sm font-semibold text-[#171D15]">{driver.driverPhone}</dd>
                    </div>
                  </div>
                </dl>
              ) : shipment?.method === "Ship Rocket" ? (
                <span className="text-sm font-semibold text-[#3BB54A]">Tracking ID {shipment.trackingNumber}</span>
              ) : <span className="text-sm text-[#86868B]">Driver details not available.</span>}
            </div>

            {item && (
              <div className="flex flex-col gap-2 rounded-xl border border-[#F1F5F9] p-4">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                  Items Dispatched (1)
                </span>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/Warehouse/product.png"
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <span className="text-sm font-semibold text-[#171D15]">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#171D15]">x{item.qty}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 rounded-xl border border-[#F1F5F9] p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-bold text-[#171D15]">{order.customer}</span>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="flex shrink-0 items-center gap-1 text-xs font-bold uppercase text-[#25D366]"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
              <span className="text-xs leading-[18px] text-[#3E4A3C]">{order.address}</span>
              <span className="text-xs text-[#3E4A3C]">{order.phone}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="mb-4 text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
              Fulfillment Timeline
            </span>
            {steps.map((step, index) => (
              <div key={step.label} className="flex gap-4">
                <TimelineDot step={step} isLast={index === steps.length - 1} />
                <div className="flex flex-1 flex-col gap-0.5 pb-6">
                  <span
                    className={`text-sm font-bold ${step.done ? "text-[#171D15]" : "text-[#86868B]"}`}
                  >
                    {step.label}
                  </span>
                  {step.detail && <span className="text-xs text-[#3E4A3C]">{step.detail}</span>}
                  <span className="text-xs text-[#86868B]">{step.time}</span>
                </div>
              </div>
            ))}
            <p className="text-xs italic text-[#86868B]">End of fulfillment record for {order.id}</p>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6">
          <button type="button" onClick={onBack} className={SECONDARY_BUTTON}>
            Back
          </button>
          <button
            type="button"
            onClick={onMarkDelivered}
            disabled={Boolean(deliveredAt)}
            className={`${PRIMARY_BUTTON} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {deliveredAt ? "Delivered" : "Mark as Delivered"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
