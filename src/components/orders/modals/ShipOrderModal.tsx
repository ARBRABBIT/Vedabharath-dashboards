"use client";

import { Barcode, CheckCircle2, Info } from "lucide-react";
import { useRef, useState } from "react";
import { SelectDropdown, type SelectOption } from "@/components/ui/SelectDropdown";
import type { Order } from "../OrderCard";
import { ModalShell } from "./ModalShell";
import type { ShipmentDetails } from "./shipmentDetails";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  deriveEmail,
  maskEmail,
  maskPhone,
  pillClasses,
} from "./modalHelpers";

type ShipOrderModalProps = {
  order: Order;
  open: boolean;
  onCancel: () => void;
  onShip: (shipment: ShipmentDetails) => void;
};

const COURIERS: readonly SelectOption[] = [
  { value: "Self Delivery", label: "Self Delivery" },
  { value: "Ship Rocket", label: "Ship Rocket", disabled: true },
];

function generateTrackingNumber() {
  return `DEL-${Math.floor(100000000 + Math.random() * 900000000)}`;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
        checked ? "bg-[#F7931E]" : "bg-[#D1D5DB]"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function NotificationRow({
  title,
  detail,
  checked,
  onChange,
}: {
  title: string;
  detail: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F1F5F9] p-4">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[#171D15]">{title}</span>
        <span className="text-xs text-[#6E7B6A]">{detail}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export function ShipOrderModal({ order, open, onCancel, onShip }: ShipOrderModalProps) {
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [courier, setCourier] = useState(COURIERS[0].value);
  const [tracking, setTracking] = useState(generateTrackingNumber);
  const [deliveryPersonName, setDeliveryPersonName] = useState("");
  const [deliveryPersonPhone, setDeliveryPersonPhone] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const deliveryNameRef = useRef<HTMLInputElement>(null);
  const deliveryPhoneRef = useRef<HTMLInputElement>(null);
  const isSelfDelivery = courier === "Self Delivery";
  const nameError = submitAttempted && isSelfDelivery && !deliveryPersonName.trim();
  const phoneError = submitAttempted && isSelfDelivery && !/^[0-9]{10}$/.test(deliveryPersonPhone);

  function handleShip() {
    setSubmitAttempted(true);
    if (isSelfDelivery && !deliveryPersonName.trim()) {
      deliveryNameRef.current?.focus();
      return;
    }
    if (isSelfDelivery && !/^[0-9]{10}$/.test(deliveryPersonPhone)) {
      deliveryPhoneRef.current?.focus();
      return;
    }
    onShip(isSelfDelivery
      ? { method: "Self Delivery", driverName: deliveryPersonName.trim(), driverPhone: `+91 ${deliveryPersonPhone}` }
      : { method: "Ship Rocket", trackingNumber: tracking.trim() });
  }

  const maskedEmail = maskEmail(deriveEmail(order.customer));
  const maskedPhone = order.phone ? maskPhone(order.phone) : "—";
  const itemCount = order.items?.length ?? 0;

  return (
    <ModalShell open={open} onClose={onCancel} maxWidth="max-w-[860px]">
      <div className="max-h-[85vh] overflow-y-auto p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-[#171D15]">Ship Package</h2>
            <p className="text-[13px] font-semibold tracking-[0.2px] text-[#86868B]">
              Order {order.id} • {order.customer}
            </p>
          </div>
          <span className={pillClasses("blue")}>Packed</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-[#F1F5F9] p-4">
            <span className="text-sm font-bold text-[#171D15]">Items to Scan</span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-[#F7931E]">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
              {itemCount} / {itemCount} Verified
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#FDF4E7] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E]/15 text-[#F7931E]">
              <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#171D15]">Package Ready</span>
              <span className="text-xs text-[#3E4A3C]">The Package is Ready To Ship</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="courier-select" className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                Select Courier Partner
              </label>
              <SelectDropdown
                id="courier-select"
                label="Courier partner"
                appearance="field"
                value={courier}
                onChange={setCourier}
                options={COURIERS}
              />
            </div>

            {isSelfDelivery ? (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="delivery-person-name" className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                    Delivery Person Name
                  </label>
                  <input
                    ref={deliveryNameRef}
                    id="delivery-person-name"
                    name="deliveryPersonName"
                    type="text"
                    autoComplete="off"
                    aria-invalid={nameError}
                    aria-describedby={nameError ? "delivery-person-name-error" : undefined}
                    value={deliveryPersonName}
                    onChange={(event) => setDeliveryPersonName(event.target.value)}
                    placeholder="Enter delivery person name"
                    className={`h-14 w-full rounded-xl bg-[#F5F5F7] px-4 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus-visible:ring-2 ${nameError ? "ring-1 ring-[#DC2626] focus-visible:ring-[#DC2626]" : "focus-visible:ring-[#F7931E]"}`}
                  />
                  {nameError && (
                    <p id="delivery-person-name-error" role="alert" className="text-xs font-medium text-[#DC2626]">
                      Please enter the driver&apos;s name.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="delivery-person-phone" className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                    Delivery Person Phone Number
                  </label>
                  <div className={`flex h-14 items-center gap-3 rounded-xl bg-[#F5F5F7] px-4 focus-within:ring-2 ${phoneError ? "ring-1 ring-[#DC2626] focus-within:ring-[#DC2626]" : "focus-within:ring-[#F7931E]"}`}>
                    <span id="delivery-person-country-code" className="shrink-0 border-r border-[#E5E5E7] pr-3 text-sm font-semibold text-[#171D15]">
                      +91
                    </span>
                    <input
                      ref={deliveryPhoneRef}
                      id="delivery-person-phone"
                      name="deliveryPersonPhone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      aria-invalid={phoneError}
                      aria-describedby={`delivery-person-country-code${phoneError ? " delivery-person-phone-error" : ""}`}
                      autoComplete="off"
                      value={deliveryPersonPhone}
                      onChange={(event) => setDeliveryPersonPhone(event.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full min-w-0 bg-transparent text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B]"
                    />
                  </div>
                  {phoneError && (
                    <p id="delivery-person-phone-error" role="alert" className="text-xs font-medium text-[#DC2626]">
                      {deliveryPersonPhone ? "Please enter a valid 10-digit phone number." : "Please enter the driver's phone number."}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <label htmlFor="tracking-number" className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                  Tracking Number
                </label>
                <div className="flex h-14 items-center gap-2 rounded-xl border-2 border-[#F7931E] pl-4 pr-2">
                  <input
                    id="tracking-number"
                    value={tracking}
                    onChange={(event) => setTracking(event.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-[#171D15] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTracking(generateTrackingNumber())}
                    aria-label="Scan barcode"
                    title="Scan barcode"
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#F7931E]/10 text-[#F7931E] transition-colors hover:bg-[#F7931E]/20"
                  >
                    <Barcode className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#F7931E]">
                  <Info className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  Scan barcode on shipping label to verify
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <NotificationRow
              title={isSelfDelivery ? "Send SMS delivery confirmation" : "Send SMS tracking link"}
              detail={`To: ${maskedPhone}`}
              checked={smsEnabled}
              onChange={setSmsEnabled}
            />
            <NotificationRow
              title="Send Email dispatch confirmation"
              detail={maskedEmail}
              checked={emailEnabled}
              onChange={setEmailEnabled}
            />
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6">
          <button type="button" onClick={onCancel} className={SECONDARY_BUTTON}>
            Cancel
          </button>
          <button type="button" onClick={handleShip} className={PRIMARY_BUTTON}>
            Ship Package
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
