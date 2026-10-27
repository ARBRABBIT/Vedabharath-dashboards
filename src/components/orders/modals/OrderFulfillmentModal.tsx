"use client";

import { useEffect, useState } from "react";
import type { Order } from "../OrderCard";
import { InvoiceModal } from "./InvoiceModal";
import { InvoicePrintedModal } from "./InvoicePrintedModal";
import { PackOrderModal } from "./PackOrderModal";
import { ShipOrderModal } from "./ShipOrderModal";
import { ShippedOrderModal } from "./ShippedOrderModal";
import type { ShipmentDetails } from "./shipmentDetails";

type FlowStep = "pack" | "invoice" | "ship" | "shipped";

type OrderFulfillmentModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  initialStep?: FlowStep;
  onDelivered?: (deliveredAt: string) => void;
};

export function OrderFulfillmentModal({
  order,
  open,
  onClose,
  initialStep = "pack",
  onDelivered,
}: OrderFulfillmentModalProps) {
  const [step, setStep] = useState<FlowStep>(initialStep);
  const [printedConfirmOpen, setPrintedConfirmOpen] = useState(false);
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [deliveredAt, setDeliveredAt] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep(initialStep);
      setPrintedConfirmOpen(false);
    }
  }, [open, initialStep]);

  return (
    <>
      <PackOrderModal
        order={order}
        open={open && step === "pack"}
        onClose={onClose}
        onPrintInvoice={() => setStep("invoice")}
        onPackOrder={() => setStep("ship")}
      />
      <InvoiceModal
        order={order}
        open={open && step === "invoice" && !printedConfirmOpen}
        onClose={onClose}
        onPrinted={() => setPrintedConfirmOpen(true)}
      />
      <InvoicePrintedModal
        open={open && printedConfirmOpen}
        onBack={() => {
          setPrintedConfirmOpen(false);
          setStep("pack");
        }}
        onContinue={() => {
          setPrintedConfirmOpen(false);
          setStep("ship");
        }}
      />
      <ShipOrderModal
        order={order}
        open={open && step === "ship"}
        onCancel={onClose}
        onShip={(details) => {
          setShipment(details);
          setDeliveredAt(null);
          setStep("shipped");
        }}
      />
      <ShippedOrderModal
        order={order}
        shipment={order.shipment ?? shipment}
        deliveredAt={order.deliveredAt ?? deliveredAt}
        open={open && step === "shipped"}
        onBack={onClose}
        onMarkDelivered={() => {
          const timestamp = new Date().toISOString();
          setDeliveredAt(timestamp);
          onDelivered?.(timestamp);
        }}
      />
    </>
  );
}
