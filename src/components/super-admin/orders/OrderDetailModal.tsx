"use client";

import { AlertCircle, Check, Mail, MapPin, MessageSquare, PackageCheck, Phone } from "lucide-react";
import Image from "next/image";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Order } from "@/components/super-admin/orders/ordersData";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type OrderDetailModalProps = {
  order: Order | null;
  open: boolean;
  onClose: () => void;
};

const HEADER_PILL: Record<Order["status"], string> = {
  "To Be Packed": "Payment Confirmed",
  Ship: "Packed",
  Exception: "Exception",
  Delivered: "Delivered",
  Returned: "Returned",
};

export function OrderDetailModal({ order, open, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={order.status === "Ship" ? "max-w-[760px]" : "max-w-[900px]"}>
      <div className={`max-h-[90vh] overflow-y-auto ${order.status === "Ship" ? "p-8" : "p-7"}`}>
        <div className="flex items-start justify-between gap-4 pr-10">
          <div>
            {order.status === "Ship" ? (
              <>
                <h2 className="text-xl font-bold text-black">Ship Package</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  Order #{order.id} • {order.customer}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-black">Order #{order.id}</h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  {order.status === "Delivered"
                    ? `Package handed to customer on ${order.placedAt}.`
                    : `Placed ${order.placedAt}`}
                </p>
              </>
            )}
          </div>
          <span className="inline-flex shrink-0 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#3B82F6]">
            {HEADER_PILL[order.status]}
          </span>
        </div>

        <div className={`mt-6 grid grid-cols-1 sm:grid-cols-2 ${order.status === "Ship" ? "gap-8" : "gap-5"}`}>
          {order.status === "Delivered" && (
            <>
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Status Update</p>
                  <div className="mt-2 flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC]">
                      <Check className="h-4 w-4 text-[#22C55E]" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-black">Delivered Successfully</p>
                      <p className="text-xs text-[#9CA3AF]">Package handed to customer on {order.placedAt}.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Ordered Items</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {order.items.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3">
                        <Image
                          src="/Warehouse/product.png"
                          alt=""
                          width={44}
                          height={44}
                          className="h-11 w-11 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-black">{item.name}</p>
                          <p className="text-xs text-[#9CA3AF]">
                            {item.variant} • ₹{item.price}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-black">x{item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Customer Details</p>
                  <p className="mt-2 text-sm font-bold text-black">{order.customer}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
                    <Phone className="h-3.5 w-3.5 text-[#F7931E]" strokeWidth={2} />
                    {order.phone}
                  </p>
                  <p className="mt-1 flex items-start gap-1.5 text-sm text-[#6B7280]">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F7931E]" strokeWidth={2} />
                    {order.address}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Payment Summary</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-[#6B7280]">Paid via</span>
                    <span className="font-semibold text-black">{order.paymentMethod}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-sm">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-semibold text-black">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-sm">
                    <span className="text-[#6B7280]">Shipping</span>
                    <span className="font-semibold text-black">₹{order.shipping}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-[#E5E7EB] pt-3 text-sm">
                    <span className="font-bold text-black">Total</span>
                    <span className="text-lg font-bold text-black">
                      ₹{(subtotal + order.shipping).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {order.status === "Exception" && (
            <>
              <div className="rounded-2xl bg-[#F9FAFB] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                    Items to Pack - {order.items.length}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    ₹{order.amount.toLocaleString()} - {order.paymentMethod}
                  </p>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div
                      key={item.name}
                      className={`flex items-center gap-3 rounded-xl border p-3 ${
                        item.outOfStock ? "border-[#F7931E] bg-[#FEF9F0]" : "border-transparent bg-white"
                      }`}
                    >
                      <Image
                        src="/Warehouse/product.png"
                        alt=""
                        width={44}
                        height={44}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-black">{item.name}</p>
                        <p className={`text-xs ${item.outOfStock ? "font-semibold text-[#F7931E]" : "text-[#9CA3AF]"}`}>
                          {item.outOfStock ? "OUT OF STOCK - 0 units available" : item.variant}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-black">x{item.qty}</span>
                      {item.outOfStock && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7931E]">
                          <AlertCircle className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Customer Information</p>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Customer Name</p>
                    <p className="font-semibold text-black">{order.customer}</p>
                    <p className="text-xs text-[#9CA3AF]">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Phone Number</p>
                    <p className="font-semibold text-black">{order.phone}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[#9CA3AF]">Shipping Address</p>
                <p className="text-sm text-[#374151]">{order.address}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Order Timeline</p>
                  <div className="mt-3 flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7931E]">
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                      </span>
                      <span className="my-1 w-0.5 flex-1 bg-[#F7931E]/30" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-bold text-black">Payment Confirmed</p>
                      <p className="text-xs text-[#9CA3AF]">Transaction ID: #TXN-{order.id.slice(-4)}</p>
                      <span className="mt-1 inline-flex rounded-full bg-[#EBF7EC] px-2 py-0.5 text-[10px] font-bold text-[#22C55E]">
                        SUCCESSFUL
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7931E]">
                        <AlertCircle className="h-4 w-4 text-white" strokeWidth={2.5} />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">Exception Flagged: Stock Mismatch</p>
                      <div className="mt-1.5 rounded-lg bg-white p-2.5 text-xs italic text-[#6B7280]">
                        &quot;System detected 0 quantity for {order.items.find((item) => item.outOfStock)?.name ?? "an item"}.&quot;
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F0FDF4] p-4">
                  <p className="text-sm font-bold text-[#22C55E]">Suggested Actions</p>
                  <button
                    type="button"
                    className="mt-2 flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white p-3 text-left transition-colors hover:bg-[#F9FAFB]"
                  >
                    <MessageSquare className="h-4 w-4 text-[#6B7280]" strokeWidth={2} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-black">Notify Customer</p>
                      <p className="text-xs text-[#9CA3AF]">Send WhatsApp/Email about delay</p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {order.status === "Returned" && (
            <>
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#F7931E]">
                    <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    Return Reason
                  </p>
                  <div className="mt-2 rounded-xl bg-[#F0FDF4] p-3 text-sm leading-relaxed text-[#374151]">
                    Customer reported that the outer packaging was significantly crushed upon arrival. The
                    moisture seal on the internal bags appeared compromised, making the grains unfit for
                    consumption. Photographic evidence attached in the support ticket.
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Returned Items</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {order.items.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3">
                        <Image
                          src="/Warehouse/product.png"
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-black">{item.name}</p>
                          <p className="text-xs text-[#9CA3AF]">Batch: #{item.batch}</p>
                          <p className="text-xs text-[#9CA3AF]">
                            Quantity: {item.qty} x {item.variant}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[10px] font-bold text-[#EF4444]">
                          DAMAGED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Customer Details</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-xs font-bold text-[#22C55E]">
                      {initials(order.customer)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">{order.customer}</p>
                      <p className="text-xs text-[#9CA3AF]">{order.phone}</p>
                    </div>
                  </div>
                  <p className="mt-3 flex items-start gap-1.5 text-sm text-[#374151]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F7931E]" strokeWidth={2} />
                    {order.address}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="text-sm font-bold text-black">Financial Summary</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-semibold text-black">₹{order.amount.toLocaleString()}.00</span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-sm">
                    <span className="text-[#6B7280]">Shipping</span>
                    <span className="font-semibold text-[#EF4444]">-₹{order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 border-t border-[#E5E7EB] pt-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Total Refundable</p>
                    <p className="text-2xl font-bold text-[#F7931E]">
                      ₹{(order.amount - order.shipping).toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-[#9CA3AF]">
                    Refunds are processed back to the original payment method within 3-5 business days.
                  </p>
                </div>
              </div>
            </>
          )}

          {order.status === "Ship" && (
            <>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-5">
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Items to Scan</p>
                    <p className="text-sm font-bold text-black">{order.items.length} / {order.items.length} Verified</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7931E]">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                    Select Courier Partner
                  </label>
                  <div className="mt-2 rounded-xl bg-[#F9FAFB] px-4 py-3.5 text-sm font-medium text-black">
                    Delhivery Express
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Tracking Number</label>
                  <div className="mt-2 rounded-xl bg-[#F9FAFB] px-4 py-3.5 text-sm font-medium text-black">
                    DEL-{order.id.replace("VB-", "")}0045
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="mb-1 flex items-center gap-3 rounded-2xl bg-[#FEF3E2] p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
                    <PackageCheck className="h-4 w-4 text-[#F7931E]" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#F7931E]">Package Ready</p>
                    <p className="text-xs text-[#9CA3AF]">The Package is Ready To Ship</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F9FAFB]">
                    <MessageSquare className="h-4 w-4 text-[#6B7280]" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-black">SMS tracking link</p>
                    <p className="text-xs text-[#9CA3AF]">To: {order.phone.slice(0, -4).replace(/\d/g, "•")}{order.phone.slice(-4)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F9FAFB]">
                    <Mail className="h-4 w-4 text-[#6B7280]" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-black">Email dispatch confirmation</p>
                    <p className="text-xs text-[#9CA3AF]">{order.email.replace(/(.{3}).+(@.+)/, "$1***$2")}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {order.status === "To Be Packed" && (
            <>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Items to Pack ({order.items.length})
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3">
                      <Image
                        src="/Warehouse/product.png"
                        alt=""
                        width={44}
                        height={44}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-black">{item.name}</p>
                        <p className="text-xs text-[#9CA3AF]">
                          {item.variant}
                          {item.batch ? ` / Batch: ${item.batch}` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#F7931E]">x {item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Delivery Details</p>
                  <div className="mt-2 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-bold text-white">
                      {initials(order.customer)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">{order.customer}</p>
                      <p className="text-xs text-[#9CA3AF]">{order.address}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Contact Info</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-black">
                    <Phone className="h-4 w-4 text-[#6B7280]" strokeWidth={2} />
                    {order.phone}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-black">
                    <Mail className="h-4 w-4 text-[#6B7280]" strokeWidth={2} />
                    {order.email}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-6 border-t border-[#F3F4F6] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
