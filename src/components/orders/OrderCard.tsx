"use client";

import { AlertTriangle, ChevronDown, MapPin, Phone, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CancelOrderModal } from "./modals/CancelOrderModal";
import { DeliveredOrderModal } from "./modals/DeliveredOrderModal";
import { InvoiceModal } from "./modals/InvoiceModal";
import { OrderFulfillmentModal } from "./modals/OrderFulfillmentModal";
import { ReturnedFlowModal } from "./modals/ReturnedFlowModal";
import type { ReturnResolution } from "./modals/returnResolution";
import type { ShipmentDetails } from "./modals/shipmentDetails";

export type OrderItem = { name: string; variant: string; qty: number; warning?: string };

export type OrderAction = { label: string; icon: LucideIcon };

export type Order = {
  id: string;
  customer: string;
  time: string;
  amount: string;
  paymentMethod: string;
  status: string;
  statusTone?: "positive" | "negative";
  phone?: string;
  address?: string;
  items?: OrderItem[];
  primaryAction: OrderAction;
  secondaryAction?: OrderAction;
  isReplacement?: boolean;
  shipment?: ShipmentDetails;
  deliveredAt?: string;
};

type OrderCardProps = {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onReplacementAssigned?: (details: Extract<ReturnResolution, { type: "replacement" }>) => void;
  onDelivered?: (deliveredAt: string) => void;
  deliveryDetailsOpen?: boolean;
  onCloseDeliveryDetails?: () => void;
};

export function OrderCard({ order, expanded, onToggle, onReplacementAssigned, onDelivered, deliveryDetailsOpen = false, onCloseDeliveryDetails }: OrderCardProps) {
  const [fulfillmentOpen, setFulfillmentOpen] = useState(false);
  const [deliveredOpen, setDeliveredOpen] = useState(false);
  const [returnedOpen, setReturnedOpen] = useState(false);
  const [returnedStep, setReturnedStep] = useState<"detail" | "ticket">("detail");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [returnResolution, setReturnResolution] = useState<ReturnResolution | null>(null);
  const isNegative = order.statusTone === "negative";
  const isPackFlow = order.primaryAction.label === "Pack Order";
  const isShipFlow = order.primaryAction.label === "Ship Package";
  const isDeliveryPendingFlow = order.status === "To be delivered" && order.primaryAction.label === "View Details";
  const isDeliveredFlow = order.status === "Delivered" && order.primaryAction.label === "View Details";
  const isFulfillmentFlow = isPackFlow || isShipFlow || isDeliveryPendingFlow || (isDeliveredFlow && order.isReplacement);
  const isReturnedFlow = order.status === "Returned" && order.primaryAction.label === "View Details";
  const isSupportTicketFlow = order.secondaryAction?.label === "View Support Ticket";
  const isCancelFlow = order.secondaryAction?.label === "Cancel Order";
  const isViewInvoiceFlow = order.secondaryAction?.label === "View Invoice";
  const PrimaryIcon = order.primaryAction.icon;
  const SecondaryIcon = order.secondaryAction?.icon;

  return (
    <div className="w-full overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-4 px-6 py-6 text-left sm:flex-nowrap sm:px-9"
      >
        <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-2 sm:gap-x-10">
          <span className="text-lg font-bold text-[#F9A51A]">{order.id}</span>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-[#171D15]">{order.customer}</span>
            <span className="text-sm font-medium text-[#6E7B6A]">{order.time}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#171D15]">{order.amount}</span>
            <span className="text-xs text-[#6E7B6A]">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {order.isReplacement && (
            <span className="whitespace-nowrap rounded-full bg-[#FEF3E2] px-3 py-1 text-xs font-semibold text-[#171D15]">Replacement product</span>
          )}
          <span
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.6px] ${
              isNegative ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#3BB54A]/10 text-[#3BB54A]"
            }`}
          >
            {order.status === "Returned" ? "Returned/ Replacement" : order.status}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#171D15] transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            strokeWidth={2.5}
          />
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-8 border-t border-[#BDCAB8]/30 px-6 py-6 sm:flex-row sm:px-9">
          <div className="flex flex-col gap-4 sm:w-[280px] sm:shrink-0">
            <h4 className="text-xs font-bold uppercase tracking-[1.2px] text-[#6E7B6A]">
              Customer Details
            </h4>
            {order.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-[18px] w-[18px] shrink-0 text-[#F9A51A]" strokeWidth={2} />
                <span className="text-base font-semibold text-[#171D15]">{order.phone}</span>
              </div>
            )}
            {order.address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F9A51A]" strokeWidth={2} />
                <span className="text-sm leading-[23px] text-[#3E4A3C]">{order.address}</span>
              </div>
            )}
          </div>

          {order.items && order.items.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-1 sm:border-x sm:border-[#BDCAB8]/30 sm:px-8">
              <h4 className="text-xs font-bold uppercase tracking-[1.2px] text-[#6E7B6A]">
                Ordered Items
              </h4>
              <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <Image
                      src="/Warehouse/product.png"
                      alt=""
                      width={62}
                      height={62}
                      className="h-[62px] w-[62px] shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-base font-semibold text-[#171D15]">{item.name}</span>
                      <span className="text-sm text-[#6E7B6A]">{item.variant}</span>
                      {item.warning && (
                        <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#EF4444]">
                          <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
                          {item.warning}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-bold text-[#171D15]">x{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:w-[294px] sm:shrink-0">
            <h4 className="text-xs font-bold uppercase tracking-[1.2px] text-[#6E7B6A]">
              Quick Actions
            </h4>
            <button
              type="button"
              disabled={cancelled}
              onClick={
                isFulfillmentFlow
                  ? () => setFulfillmentOpen(true)
                  : isDeliveredFlow
                    ? () => setDeliveredOpen(true)
                    : isReturnedFlow
                      ? () => {
                          setReturnedStep("detail");
                          setReturnedOpen(true);
                        }
                      : undefined
              }
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F9A51A] py-4 text-sm font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#e6960f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PrimaryIcon className="h-5 w-5" strokeWidth={2} />
              {cancelled ? "Order Cancelled" : order.primaryAction.label}
            </button>
            {order.secondaryAction && SecondaryIcon && (
              <button
                type="button"
                disabled={cancelled}
                onClick={
                  isCancelFlow
                    ? () => setCancelOpen(true)
                    : isViewInvoiceFlow
                      ? () => setInvoiceOpen(true)
                      : isSupportTicketFlow
                        ? () => {
                            setReturnedStep("ticket");
                            setReturnedOpen(true);
                          }
                        : undefined
                }
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#BDCAB8] py-3 text-sm font-bold text-[#171D15] transition-colors hover:bg-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SecondaryIcon className="h-4 w-4" strokeWidth={2} />
                {cancelled ? "Order Cancelled" : order.secondaryAction.label}
              </button>
            )}
          </div>
        </div>
      )}

      {isFulfillmentFlow && (
        <OrderFulfillmentModal
          order={order}
          open={fulfillmentOpen || deliveryDetailsOpen}
          onClose={() => {
            setFulfillmentOpen(false);
            onCloseDeliveryDetails?.();
          }}
          onDelivered={onDelivered}
          initialStep={isDeliveryPendingFlow || order.isReplacement ? "shipped" : isShipFlow ? "ship" : "pack"}
        />
      )}

      {isDeliveredFlow && !order.isReplacement && (
        <DeliveredOrderModal
          order={order}
          open={deliveredOpen}
          onClose={() => setDeliveredOpen(false)}
          onDownloadInvoice={() => setInvoiceOpen(true)}
        />
      )}

      {(isReturnedFlow || isSupportTicketFlow) && (
        <ReturnedFlowModal
          order={order}
          open={returnedOpen}
          initialStep={returnedStep}
          onClose={() => setReturnedOpen(false)}
          resolution={returnResolution}
          onResolve={(resolution) => {
            setReturnResolution(resolution);
            if (resolution.type === "replacement" && onReplacementAssigned) {
              setReturnedOpen(false);
              onReplacementAssigned(resolution);
            }
          }}
        />
      )}

      {isCancelFlow && (
        <CancelOrderModal
          order={order}
          open={cancelOpen}
          onClose={() => setCancelOpen(false)}
          onConfirm={() => {
            setCancelled(true);
            setCancelOpen(false);
          }}
        />
      )}

      {(isViewInvoiceFlow || isDeliveredFlow) && (
        <InvoiceModal order={order} open={invoiceOpen} onClose={() => setInvoiceOpen(false)} onPrinted={() => {}} />
      )}
    </div>
  );
}
