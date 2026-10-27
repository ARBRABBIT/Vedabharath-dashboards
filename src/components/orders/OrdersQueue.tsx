"use client";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageCircleQuestion,
  PackageCheck,
  PackageX,
  Search,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { OrderCard, type Order, type OrderItem } from "./OrderCard";
import type { ReturnResolution } from "./modals/returnResolution";

const PAGE_SIZE = 10;

const CUSTOMER_ADDRESS =
  "42, Greenfield Residency, Block C, Whitefield, Bengaluru, Karnataka, 560066";

const ITEM_SETS: OrderItem[][] = [
  [
    { name: "Heritage Ponni", variant: "5kg Pack • ₹850", qty: 1 },
    { name: "Dudeshwar", variant: "1kg Pack • ₹350", qty: 1 },
  ],
  [
    { name: "Bahurupi", variant: "1kg Pack • ₹180", qty: 2 },
    { name: "Indrani", variant: "1kg Pack • ₹140", qty: 1 },
  ],
  [
    { name: "Mysore Malliga", variant: "1kg Pack • ₹150", qty: 1 },
    { name: "Black Burma", variant: "1kg Pack • ₹200", qty: 1 },
  ],
];

type OrderBase = {
  id: string;
  customer: string;
  time: string;
  amount: string;
  paymentMethod: string;
  phone: string;
};

function makeOrder(base: OrderBase, itemSetIndex: number): Order {
  const items = ITEM_SETS[itemSetIndex % ITEM_SETS.length].map((item) => ({ ...item }));

  return {
    ...base,
    status: "",
    address: CUSTOMER_ADDRESS,
    items,
    primaryAction: { label: "", icon: PackageCheck },
  };
}

type TabConfig = {
  label: string;
  status: string;
  statusTone?: "positive" | "negative";
  primaryAction: { label: string; icon: LucideIcon };
  secondaryAction?: { label: string; icon: LucideIcon };
  total: number;
  pages: Order[][];
};

function withStatus(orders: Order[], config: Omit<TabConfig, "pages" | "label" | "total">) {
  return orders.map((order) => ({
    ...order,
    status: config.status,
    statusTone: config.statusTone,
    primaryAction: config.primaryAction,
    secondaryAction: config.secondaryAction,
  }));
}

const TO_BE_PACKED = {
  status: "To Be Packed",
  primaryAction: { label: "Pack Order", icon: PackageCheck },
  secondaryAction: { label: "Cancel Order", icon: PackageX },
};

const SHIP = {
  status: "Ship",
  primaryAction: { label: "Ship Package", icon: Truck },
  secondaryAction: { label: "View Invoice", icon: FileText },
};

const TO_BE_DELIVERED = {
  status: "To be delivered",
  primaryAction: { label: "View Details", icon: FileText },
  secondaryAction: { label: "View Invoice", icon: FileText },
};

const DELIVERED = {
  status: "Delivered",
  primaryAction: { label: "View Details", icon: FileText },
};

const RETURNED = {
  status: "Returned",
  statusTone: "negative" as const,
  primaryAction: { label: "View Details", icon: FileText },
  secondaryAction: { label: "View Support Ticket", icon: MessageCircleQuestion },
};

const SEED_TABS: TabConfig[] = [
  {
    label: "To Be Packed",
    total: 84,
    ...TO_BE_PACKED,
    pages: [
      withStatus(
        [
          makeOrder(
            { id: "#VB-8492", customer: "Priya Patel", time: "Today, 10:45 AM", amount: "₹1,200", paymentMethod: "UPI Payment", phone: "+91 98765 43210" },
            0,
          ),
          makeOrder(
            { id: "#VB-8490", customer: "Sneha Desai", time: "Yesterday, 06:30 PM", amount: "₹450", paymentMethod: "COD", phone: "+91 91234 56780" },
            1,
          ),
          makeOrder(
            { id: "#VB-8488", customer: "Rahul Sharma", time: "Yesterday, 04:15 PM", amount: "₹2,800", paymentMethod: "UPI Payment", phone: "+91 90123 45678" },
            2,
          ),
        ],
        TO_BE_PACKED,
      ),
      withStatus(
        [
          makeOrder(
            { id: "#VB-8484", customer: "Divya Krishnan", time: "2 days ago, 09:20 AM", amount: "₹680", paymentMethod: "COD", phone: "+91 89765 43219" },
            0,
          ),
          makeOrder(
            { id: "#VB-8481", customer: "Rajesh Khanna", time: "2 days ago, 07:05 AM", amount: "₹1,550", paymentMethod: "UPI Payment", phone: "+91 88123 45670" },
            1,
          ),
          makeOrder(
            { id: "#VB-8479", customer: "Meera Nair", time: "3 days ago, 06:40 PM", amount: "₹920", paymentMethod: "COD", phone: "+91 87654 90123" },
            2,
          ),
        ],
        TO_BE_PACKED,
      ),
      withStatus(
        [
          makeOrder(
            { id: "#VB-8476", customer: "Arjun Iyer", time: "3 days ago, 11:15 AM", amount: "₹2,100", paymentMethod: "UPI Payment", phone: "+91 86543 21098" },
            0,
          ),
          makeOrder(
            { id: "#VB-8474", customer: "Kavya Menon", time: "4 days ago, 03:30 PM", amount: "₹540", paymentMethod: "COD", phone: "+91 85432 10987" },
            1,
          ),
        ],
        TO_BE_PACKED,
      ),
    ],
  },
  {
    label: "Ship",
    total: 84,
    ...SHIP,
    pages: [
      withStatus(
        [
          makeOrder(
            { id: "#VB-8491", customer: "Karthik Suraj", time: "Ordered 2h ago", amount: "₹2,450", paymentMethod: "Prepaid (UPI)", phone: "+91 98765 43210" },
            0,
          ),
          makeOrder(
            { id: "#VB-8488", customer: "Anita Reddy", time: "Ordered 5h ago", amount: "₹950", paymentMethod: "COD", phone: "+91 94321 09876" },
            1,
          ),
          makeOrder(
            { id: "#VB-8485", customer: "Rahul Verma", time: "Ordered 6h ago", amount: "₹1,820", paymentMethod: "Prepaid", phone: "+91 76543 21098" },
            2,
          ),
        ],
        SHIP,
      ),
      withStatus(
        [
          makeOrder(
            { id: "#VB-8480", customer: "Vikram Rao", time: "Ordered 9h ago", amount: "₹3,050", paymentMethod: "Prepaid (UPI)", phone: "+91 93210 87654" },
            0,
          ),
          makeOrder(
            { id: "#VB-8477", customer: "Neha Gupta", time: "Ordered 11h ago", amount: "₹760", paymentMethod: "COD", phone: "+91 92109 87654" },
            1,
          ),
          makeOrder(
            { id: "#VB-8473", customer: "Suresh Pillai", time: "Ordered 1 day ago", amount: "₹1,430", paymentMethod: "Prepaid", phone: "+91 91098 76543" },
            2,
          ),
        ],
        SHIP,
      ),
      withStatus(
        [
          makeOrder(
            { id: "#VB-8470", customer: "Priya Patel", time: "Ordered 1 day ago", amount: "₹2,200", paymentMethod: "Prepaid (UPI)", phone: "+91 98765 43210" },
            0,
          ),
        ],
        SHIP,
      ),
    ],
  },
  {
    label: "Delivered",
    total: 284,
    ...DELIVERED,
    pages: [
      withStatus(
        [
          makeOrder(
            { id: "#VB-8491", customer: "Karthik Suraj", time: "Ordered 2h ago", amount: "₹2,450", paymentMethod: "Prepaid (UPI)", phone: "+91 98765 43210" },
            0,
          ),
          makeOrder(
            { id: "#VB-8488", customer: "Anita Reddy", time: "Ordered 5h ago", amount: "₹950", paymentMethod: "COD", phone: "+91 94321 09876" },
            1,
          ),
          makeOrder(
            { id: "#VB-8485", customer: "Rahul Verma", time: "Ordered 6h ago", amount: "₹1,820", paymentMethod: "Prepaid", phone: "+91 76543 21098" },
            2,
          ),
        ],
        DELIVERED,
      ),
      withStatus(
        [
          makeOrder(
            { id: "#VB-8482", customer: "Meera Nair", time: "Ordered 8h ago", amount: "₹1,140", paymentMethod: "COD", phone: "+91 87654 90123" },
            0,
          ),
          makeOrder(
            { id: "#VB-8478", customer: "Arjun Iyer", time: "Ordered 10h ago", amount: "₹2,600", paymentMethod: "Prepaid (UPI)", phone: "+91 86543 21098" },
            1,
          ),
          makeOrder(
            { id: "#VB-8475", customer: "Kavya Menon", time: "Ordered 1 day ago", amount: "₹560", paymentMethod: "COD", phone: "+91 85432 10987" },
            2,
          ),
        ],
        DELIVERED,
      ),
      withStatus(
        [
          makeOrder(
            { id: "#VB-8471", customer: "Vikram Rao", time: "Ordered 1 day ago", amount: "₹3,050", paymentMethod: "Prepaid (UPI)", phone: "+91 93210 87654" },
            0,
          ),
        ],
        DELIVERED,
      ),
    ],
  },
  {
    label: "Returned",
    total: 284,
    ...RETURNED,
    pages: [
      withStatus(
        [
          makeOrder(
            { id: "#VB-8491", customer: "Karthik Suraj", time: "Ordered 2h ago", amount: "₹2,450", paymentMethod: "Prepaid (UPI)", phone: "+91 98765 43210" },
            0,
          ),
          makeOrder(
            { id: "#VB-8488", customer: "Anita Reddy", time: "Ordered 5h ago", amount: "₹950", paymentMethod: "COD", phone: "+91 94321 09876" },
            1,
          ),
          makeOrder(
            { id: "#VB-8485", customer: "Rahul Verma", time: "Ordered 6h ago", amount: "₹1,820", paymentMethod: "Prepaid", phone: "+91 76543 21098" },
            2,
          ),
        ],
        RETURNED,
      ),
      withStatus(
        [
          makeOrder(
            { id: "#VB-8480", customer: "Neha Gupta", time: "Ordered 9h ago", amount: "₹760", paymentMethod: "COD", phone: "+91 92109 87654" },
            0,
          ),
          makeOrder(
            { id: "#VB-8477", customer: "Suresh Pillai", time: "Ordered 11h ago", amount: "₹1,430", paymentMethod: "Prepaid", phone: "+91 91098 76543" },
            1,
          ),
          makeOrder(
            { id: "#VB-8473", customer: "Divya Krishnan", time: "Ordered 1 day ago", amount: "₹680", paymentMethod: "COD", phone: "+91 89765 43219" },
            2,
          ),
        ],
        RETURNED,
      ),
      withStatus(
        [
          makeOrder(
            { id: "#VB-8469", customer: "Rajesh Khanna", time: "Ordered 1 day ago", amount: "₹1,550", paymentMethod: "UPI Payment", phone: "+91 88123 45670" },
            0,
          ),
        ],
        RETURNED,
      ),
    ],
  },
];

// Expand the local fixtures to match each queue's advertised demo total, then
// paginate the actual records rather than using hand-authored three-item pages.
const QUEUE_TABS: TabConfig[] = SEED_TABS.flatMap((tab) =>
  tab.label === "Ship"
    ? [tab, {
        ...tab,
        ...TO_BE_DELIVERED,
        label: "To be delivered",
        pages: tab.pages.map((orders) => withStatus(orders, TO_BE_DELIVERED)),
      }]
    : [tab],
);

const TABS: TabConfig[] = QUEUE_TABS.map((tab) => {
  const seeds = tab.pages.flat();
  const firstGeneratedId = Math.min(...seeds.map((order) => Number(order.id.replace(/\D/g, "")))) - 1;
  const orders = Array.from({ length: tab.total }, (_, index): Order => {
    if (index < seeds.length) return seeds[index];
    return {
      ...seeds[index % seeds.length],
      id: `#VB-${firstGeneratedId - (index - seeds.length)}`,
    };
  });
  return {
    ...tab,
    pages: Array.from({ length: Math.ceil(orders.length / PAGE_SIZE) }, (_, index) =>
      orders.slice(index * PAGE_SIZE, (index + 1) * PAGE_SIZE),
    ),
  };
});

// Keep queue moves and counts atomic, including demo records sharing an ID.
function moveQueueOrder(tabs: TabConfig[], order: Order, from: string, to: string): TabConfig[] {
  return tabs.map((tab) => {
    if (tab.label !== from && tab.label !== to) return tab;
    const remaining = tab.pages.flat().filter((item) => item.id !== order.id);
    const orders = tab.label === to ? [order, ...remaining] : remaining;
    return {
      ...tab,
      total: orders.length,
      pages: Array.from({ length: Math.max(1, Math.ceil(orders.length / PAGE_SIZE)) }, (_, index) =>
        orders.slice(index * PAGE_SIZE, (index + 1) * PAGE_SIZE),
      ),
    };
  });
}

export function OrdersQueue() {
  const [tabs, setTabs] = useState(TABS);
  const [deliveryOrderId, setDeliveryOrderId] = useState<string | null>(null);
  const [activeTabLabel, setActiveTabLabel] = useState(TABS[0].label);
  const activeTab = tabs.find((tab) => tab.label === activeTabLabel) ?? TABS[0];

  const [page, setPage] = useState(1);
  const currentOrders = activeTab.pages[page - 1] ?? [];
  const pageNumbers = Array.from({ length: activeTab.pages.length }, (_, index) => index + 1)
    .filter((number) => number === 1 || number === activeTab.pages.length || Math.abs(number - page) <= 1);
  const [expandedId, setExpandedId] = useState<string | null>(currentOrders[0]?.id ?? null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPage(1);
  }, [activeTabLabel]);

  useEffect(() => {
    setExpandedId(currentOrders[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabLabel, page]);

  // Deep links (e.g. "View details" on a Dashboard notification) land here
  // with ?tab=Delivered so the right tab opens automatically.
  useEffect(() => {
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    if (tabParam && TABS.some((tab) => tab.label === tabParam)) {
      setActiveTabLabel(tabParam);
    }
  }, []);

  function assignReplacement(order: Order, details: Extract<ReturnResolution, { type: "replacement" }>) {
    const replacement: Order = {
      ...order,
      ...TO_BE_DELIVERED,
      statusTone: "positive",
      isReplacement: true,
      shipment: { method: "Self Delivery", driverName: details.driverName, driverPhone: details.driverPhone },
      deliveredAt: undefined,
    };
    setTabs((previous) => moveQueueOrder(previous, replacement, "Returned", "To be delivered"));
    setActiveTabLabel("To be delivered");
    setPage(1);
    setExpandedId(order.id);
    setDeliveryOrderId(order.id);
  }

  function markDelivered(order: Order, deliveredAt: string) {
    setTabs((previous) => moveQueueOrder(previous, { ...order, ...DELIVERED, deliveredAt }, "To be delivered", "Delivered"));
    setActiveTabLabel("Delivered");
    setPage(1);
    setExpandedId(order.id);
  }

  return (
    <div className="mt-8 flex flex-col gap-4 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[318px]">
          <Search
            className="pointer-events-none absolute left-[19px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#3E4A3C]"
            strokeWidth={2}
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Orders, Customers..."
            className="w-full rounded-full border border-[#BDCAB8]/30 bg-white py-[14px] pl-11 pr-4 text-base text-[#3E4A3C] outline-none placeholder:text-[#3E4A3C]/50 focus:border-[#F9A51A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {tabs.map((tab) => {
            const isActive = tab.label === activeTabLabel;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTabLabel(tab.label)}
                className={`cursor-pointer whitespace-nowrap rounded-xl px-6 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#F9A51A] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
                    : "bg-white text-[#3BB54A] hover:bg-[#F5F5F7]"
                }`}
              >
                {tab.label === "Returned" ? "Returned/ Replacement" : tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[1.1px] text-[#86868B]">
          Active Processing Queues
        </span>
        <span className="text-sm text-[#86868B]">
          Page {page} of {activeTab.pages.length}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {currentOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onReplacementAssigned={(details) => assignReplacement(order, details)}
            onDelivered={order.status === "To be delivered" ? (timestamp) => markDelivered(order, timestamp) : undefined}
            deliveryDetailsOpen={deliveryOrderId === order.id}
            onCloseDeliveryDetails={() => setDeliveryOrderId(null)}
            expanded={expandedId === order.id}
            onToggle={() =>
              setExpandedId((current) => (current === order.id ? null : order.id))
            }
          />
        ))}
      </div>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-lg font-medium text-[#6E7B6A]">
          Showing {activeTab.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + currentOrders.length} of {activeTab.total} orders
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#BDCAB8] bg-white text-[#171D15] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          {pageNumbers.map((pageNumber, index) => {
            const isActive = pageNumber === page;
            return (
              <Fragment key={pageNumber}>
                {index > 0 && pageNumber - pageNumbers[index - 1] > 1 && (
                  <span aria-hidden="true" className="px-1 text-sm text-[#86868B]">…</span>
                )}
                <button
                  aria-label={`Page ${pageNumber}`}
                  aria-current={isActive ? "page" : undefined}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#F9A51A] text-white"
                      : "border border-[#BDCAB8] bg-white text-[#171D15] hover:bg-[#F5F5F7]"
                  }`}
                >
                  {pageNumber}
                </button>
              </Fragment>
            );
          })}
          <button
            type="button"
            disabled={page === activeTab.pages.length}
            onClick={() => setPage((p) => Math.min(activeTab.pages.length, p + 1))}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#BDCAB8] bg-white text-[#171D15] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
