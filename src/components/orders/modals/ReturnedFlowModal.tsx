"use client";

import { useEffect, useState } from "react";
import type { Order } from "../OrderCard";
import { ProcessRefundModal } from "./ProcessRefundModal";
import { ReturnedOrderModal } from "./ReturnedOrderModal";
import { splitVariant } from "./modalHelpers";
import { SupportTicketModal } from "./SupportTicketModal";
import type { ReturnResolution } from "./returnResolution";

type FlowStep = "detail" | "refund" | "ticket";

type ReturnedFlowModalProps = {
  order: Order;
  open: boolean;
  initialStep?: FlowStep;
  onClose: () => void;
  resolution: ReturnResolution | null;
  onResolve: (resolution: ReturnResolution) => void;
};

const RETURN_SHIPPING_FEE = 50;

function currencyToNumber(price: string) {
  return Number(price.replace(/[^\d.]/g, "")) || 0;
}

export function ReturnedFlowModal({
  order,
  open,
  initialStep = "detail",
  onClose,
  resolution,
  onResolve,
}: ReturnedFlowModalProps) {
  const [step, setStep] = useState<FlowStep>(initialStep);

  useEffect(() => {
    if (open) setStep(initialStep);
  }, [open, initialStep]);

  const items = order.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const { price } = splitVariant(item.variant);
    return sum + currencyToNumber(price) * item.qty;
  }, 0);
  const totalRefundable = Math.max(subtotal - RETURN_SHIPPING_FEE, 0);

  return (
    <>
      <ReturnedOrderModal
        order={order}
        open={open && step === "detail"}
        onClose={onClose}
        resolution={resolution}
        onProcessRefund={() => { if (!resolution) setStep("refund"); }}
        onAssignReplacement={(details) => {
          if (!resolution) onResolve({ type: "replacement", ...details });
        }}
        onViewTicket={() => setStep("ticket")}
      />
      <ProcessRefundModal
        order={order}
        amount={totalRefundable}
        open={open && step === "refund"}
        onBack={() => setStep("detail")}
        onCredit={() => {
          if (!resolution) onResolve({ type: "return", amount: totalRefundable });
        }}
        onConfirm={() => setStep("detail")}
      />
      <SupportTicketModal
        order={order}
        open={open && step === "ticket"}
        onClose={onClose}
        onInitiateRefund={() => setStep("detail")}
      />
    </>
  );
}
