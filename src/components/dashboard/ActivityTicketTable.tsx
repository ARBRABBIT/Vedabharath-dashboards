"use client";

import { PackageCheck, PackageX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Order } from "@/components/orders/OrderCard";
import { OrderFulfillmentModal } from "@/components/orders/modals/OrderFulfillmentModal";

const TO_BE_PACKED_ORDERS: Order[] = [
  {
    id: "#VB-8492",
    customer: "Priya Patel",
    time: "Today, 10:45 AM",
    amount: "₹1,200",
    paymentMethod: "UPI Payment",
    phone: "+91 98765 43210",
    address: "42, Greenfield Residency, Block C, Whitefield, Bengaluru, Karnataka, 560066",
    status: "To Be Packed",
    items: [
      { name: "Heritage Ponni", variant: "5kg Pack • ₹850", qty: 1 },
      { name: "Dudeshwar", variant: "1kg Pack • ₹350", qty: 1 },
    ],
    primaryAction: { label: "Pack Order", icon: PackageCheck },
    secondaryAction: { label: "Cancel Order", icon: PackageX },
  },
  {
    id: "#VB-8490",
    customer: "Sneha Desai",
    time: "Yesterday, 06:30 PM",
    amount: "₹450",
    paymentMethod: "COD",
    phone: "+91 91234 56780",
    address: "18, Lotus Boulevard, Sector 100, Noida, Uttar Pradesh, 201304",
    status: "To Be Packed",
    items: [
      { name: "Bahurupi", variant: "1kg Pack • ₹180", qty: 2 },
      { name: "Indrani", variant: "1kg Pack • ₹140", qty: 1 },
    ],
    primaryAction: { label: "Pack Order", icon: PackageCheck },
    secondaryAction: { label: "Cancel Order", icon: PackageX },
  },
  {
    id: "#VB-8488",
    customer: "Rahul Sharma",
    time: "Yesterday, 04:15 PM",
    amount: "₹2,800",
    paymentMethod: "UPI Payment",
    phone: "+91 90123 45678",
    address: "104, Sunrise Heights, Baner Road, Pune, Maharashtra, 411045",
    status: "To Be Packed",
    items: [
      { name: "Mysore Malliga", variant: "1kg Pack • ₹150", qty: 1 },
      { name: "Black Burma", variant: "1kg Pack • ₹200", qty: 1 },
    ],
    primaryAction: { label: "Pack Order", icon: PackageCheck },
    secondaryAction: { label: "Cancel Order", icon: PackageX },
  },
  {
    id: "#VB-8484",
    customer: "Divya Krishnan",
    time: "2 days ago, 09:20 AM",
    amount: "₹680",
    paymentMethod: "COD",
    phone: "+91 89765 43219",
    address: "7B, Palm Grove Avenue, Anna Nagar, Chennai, Tamil Nadu, 600040",
    status: "To Be Packed",
    items: [
      { name: "Heritage Ponni", variant: "5kg Pack • ₹850", qty: 1 },
    ],
    primaryAction: { label: "Pack Order", icon: PackageCheck },
    secondaryAction: { label: "Cancel Order", icon: PackageX },
  },
  {
    id: "#VB-8481",
    customer: "Rajesh Khanna",
    time: "2 days ago, 07:05 AM",
    amount: "₹1,550",
    paymentMethod: "UPI Payment",
    phone: "+91 88123 45670",
    address: "55, Silver Birch Villa, Jubilee Hills, Hyderabad, Telangana, 500033",
    status: "To Be Packed",
    items: [
      { name: "Bahurupi", variant: "1kg Pack • ₹180", qty: 2 },
      { name: "Dudeshwar", variant: "1kg Pack • ₹350", qty: 1 },
    ],
    primaryAction: { label: "Pack Order", icon: PackageCheck },
    secondaryAction: { label: "Cancel Order", icon: PackageX },
  },
];

export function ActivityTicketTable() {
  const [orders, setOrders] = useState<Order[]>(TO_BE_PACKED_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-black">To Be Packed Orders</h2>
        <Link
          href="/orders"
          className="text-sm font-semibold text-[#F7931E] transition-colors hover:text-[#e68310] hover:underline"
        >
          View All Orders &rarr;
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
          <thead>
            <tr className="text-xs font-medium uppercase tracking-wide text-[#1F1B17]">
              <th className="px-4 pb-2 text-left">Order ID</th>
              <th className="px-4 pb-2 text-left">Customer</th>
              <th className="px-4 pb-2 text-left">Items</th>
              <th className="px-4 pb-2 text-left">Order Time</th>
              <th className="px-4 pb-2 text-left">Amount</th>
              <th className="px-4 pb-2 text-left">Status</th>
              <th className="px-4 pb-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const itemsSummary =
                order.items && order.items.length > 0
                  ? order.items.map((i) => `${i.name} (${i.qty})`).join(", ")
                  : "—";

              return (
                <tr key={order.id} className="bg-[#FAFAFA] transition-colors hover:bg-[#F5F5F7]">
                  <td className="rounded-l-2xl px-4 py-4 text-sm font-bold text-[#F9A51A]">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold capitalize text-[#1F1B17]">
                    {order.customer}
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-4 text-sm text-[#3F4942]" title={itemsSummary}>
                    {itemsSummary}
                  </td>
                  <td className="px-4 py-4 text-sm text-[#6E7B6A]">
                    {order.time}
                  </td>
                  <td className="px-4 py-4 text-sm text-[#1F1B17]">
                    <span className="font-bold">{order.amount}</span>
                    <span className="block text-xs text-[#6E7B6A]">{order.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block whitespace-nowrap rounded-full bg-[#FEF3E2] px-3 py-1 text-xs font-bold text-[#F7931E]">
                      {order.status}
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveOrder(order)}
                      className="cursor-pointer whitespace-nowrap rounded-full border border-[#2E7D32] px-4 py-1.5 text-sm font-semibold text-[#2E7D32] transition-colors hover:bg-[#2E7D32]/5"
                    >
                      Pack Order
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeOrder && (
        <OrderFulfillmentModal
          order={activeOrder}
          open={activeOrder !== null}
          initialStep="pack"
          onClose={() => setActiveOrder(null)}
        />
      )}
    </div>
  );
}

export { ActivityTicketTable as ToBePackedOrdersTable };
