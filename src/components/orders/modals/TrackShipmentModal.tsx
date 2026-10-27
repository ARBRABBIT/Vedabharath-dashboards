"use client";

import { Check, Copy, ExternalLink, Phone, Share2, Truck, UserRound } from "lucide-react";
import { useState } from "react";
import type { Order } from "../OrderCard";
import { ModalShell } from "./ModalShell";
import type { ShipmentDetails } from "./shipmentDetails";
import { pillClasses } from "./modalHelpers";

type TrackShipmentModalProps = {
  order: Order;
  shipment: ShipmentDetails | null;
  open: boolean;
  onClose: () => void;
};

type StepStatus = "pending" | "active" | "done";
type Step = { label: string; time: string; status: StepStatus };

const STEPS: Step[] = [
  { label: "Out for Delivery", time: "Pending", status: "pending" },
  { label: "In Transit - Arrived at Regional Hub", time: "Today, 2:30 PM", status: "active" },
  { label: "Picked up by Courier", time: "Today, 11:00 AM", status: "done" },
  { label: "Order Packed & Ready", time: "Today, 10:15 AM", status: "done" },
];

function TimelineDot({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#F7931E]">
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        <span className="h-3 w-3 rounded-full bg-[#F7931E] shadow-[0_0_0_4px_#FFEDD5]" />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#F5F5F7]">
      <span className="h-2.5 w-2.5 rounded-full bg-[#86868B]" />
    </span>
  );
}

export function TrackShipmentModal({ order, shipment, open, onClose }: TrackShipmentModalProps) {
  const [copied, setCopied] = useState(false);
  const trackingNumber = shipment?.method === "Ship Rocket" ? shipment.trackingNumber : "";

  function handleCopy() {
    navigator.clipboard?.writeText(trackingNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (shipment?.method === "Self Delivery") {
    return (
      <ModalShell open={open} onClose={onClose} maxWidth="max-w-[680px]">
        <div className="max-h-[85vh] overflow-y-auto p-7 sm:p-9">
          <div className="flex flex-col gap-1 pr-10">
            <h2 className="text-2xl font-bold text-[#171D15]">Delivery Details</h2>
            <p className="text-sm text-[#86868B]">Order {order.id}</p>
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-xl bg-[#F5F5F7] p-5">
            <div className="flex items-center gap-2">
              <Truck aria-hidden="true" className="h-4 w-4 text-[#6E7B6A]" />
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">Delivery Partner</span>
            </div>
            <p className="text-lg font-bold text-[#171D15]">Self Delivery</p>
            <dl className="flex flex-col gap-4 border-t border-[#E5E5E7] pt-4">
              <div className="flex items-start gap-3">
                <UserRound aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#6E7B6A]" />
                <div className="min-w-0">
                  <dt className="text-xs text-[#6E7B6A]">Driver Name</dt>
                  <dd className="break-words text-sm font-semibold text-[#171D15]">{shipment.driverName}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#6E7B6A]" />
                <div>
                  <dt className="text-xs text-[#6E7B6A]">Phone Number</dt>
                  <dd className="text-sm font-semibold text-[#171D15]">{shipment.driverPhone}</dd>
                </div>
              </div>
            </dl>
          </div>
          <a
            href={`tel:${shipment.driverPhone.replace(/\s/g, "")}`}
            className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F7931E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e6850f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931E] focus-visible:ring-offset-2"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            Call Driver
          </a>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[960px]">
      <div className="max-h-[85vh] overflow-y-auto p-8 sm:p-12">
        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-[28px] font-bold text-[#1D1D1F]">Track Shipment</h2>
            <p className="text-[15px] text-[#86868B]">Order {order.id}</p>
          </div>
          <span className={pillClasses("blue")}>Shipped</span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F5F5F7] p-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#86868B]">
                  Estimated Delivery
                </span>
                <span className="text-base font-bold text-[#1D1D1F]">Tomorrow By 8:00 PM</span>
              </div>
              <span className="whitespace-nowrap rounded-full bg-[#EBF7EC] px-3 py-1 text-sm font-semibold text-[#3BB54A]">
                On Schedule
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F7]">
                  <Truck className="h-5 w-5 text-[#1D1D1F]" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-[#1D1D1F]">{shipment?.method ?? "Ship Rocket"}</span>
                  <span className="text-sm font-medium text-[#3BB54A]">{trackingNumber || "Tracking ID unavailable"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy tracking ID"
                title={copied ? "Copied!" : "Copy tracking ID"}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#86868B] transition-colors hover:bg-[#F5F5F7]"
              >
                <Copy className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#E5E5E7] text-base font-semibold text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7]"
              >
                Track on Ship Rocket Website
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
              <button
                type="button"
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#F7931E] text-base font-semibold text-white transition-colors hover:bg-[#e6850f]"
              >
                Share Tracking Link
                <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="mb-8 text-xl font-bold text-[#1D1D1F]">Shipment Progress</span>
            {STEPS.map((step, index) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <TimelineDot status={step.status} />
                  {index !== STEPS.length - 1 && (
                    <span
                      className={`mt-1 w-0.5 flex-1 ${
                        step.status === "pending" ? "bg-black/5" : "bg-[#F7931E]"
                      }`}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-0.5 pb-10">
                  <span
                    className={`text-[15px] ${
                      step.status === "pending"
                        ? "font-semibold text-[#86868B]"
                        : step.status === "active"
                          ? "font-bold text-[#1D1D1F]"
                          : "font-semibold text-[#1D1D1F]"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[13px] text-[#86868B]">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
