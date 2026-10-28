"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Category = "Products" | "Offers" | "Reviews" | "Traffic";

export type SuperAdminNotification = {
  id: string;
  label: string;
  time: string;
  message: string;
  category: Category;
  read: boolean;
};

export const INITIAL_SUPER_ADMIN_NOTIFICATIONS: SuperAdminNotification[] = [
  {
    id: "low-stock",
    label: "LOW STOCK",
    time: "Now",
    message: "Kaattu Rice 5kg variant is running low",
    category: "Products",
    read: false,
  },
  {
    id: "product-update",
    label: "PRODUCT UPDATE",
    time: "2 min ago",
    message: "Navara Rice stock updated to 240 units",
    category: "Products",
    read: false,
  },
  {
    id: "offer-alert",
    label: "OFFER ALERT",
    time: "10:45 AM",
    message: "FESTIVE20 campaign expires tomorrow",
    category: "Offers",
    read: false,
  },
  {
    id: "customer-review",
    label: "CUSTOMER REVIEW",
    time: "Today",
    message: "New 5-star review received from Priya Sharma",
    category: "Reviews",
    read: false,
  },
  {
    id: "traffic-update",
    label: "TRAFFIC UPDATE",
    time: "Mon",
    message: "Website traffic increased by 18% this week",
    category: "Traffic",
    read: false,
  },
];

const FILTERS: Array<"All" | Category> = ["All", "Products", "Offers", "Reviews"];

type SuperAdminNotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
  notifications: SuperAdminNotification[];
  onMarkAllAsRead: () => void;
};

export function SuperAdminNotificationsPanel({
  open,
  onClose,
  notifications,
  onMarkAllAsRead,
}: SuperAdminNotificationsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");

  const visible =
    activeFilter === "All"
      ? notifications
      : notifications.filter((item) => item.category === activeFilter);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-full z-50 mt-2.5 flex w-[340px] max-w-[90vw] flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1D1D1F]">
              Notifications
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280] transition-colors hover:bg-[#E5E7EB] hover:text-black"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>

          <div className="mb-3 flex w-fit items-center gap-1 rounded-full bg-[#F5F5F7] p-1">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  activeFilter === filter
                    ? "bg-[#F9A51A] text-white shadow-xs"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="border-t border-[#EDEDEF]" />

          <div className="mt-3 flex max-h-[360px] flex-col gap-2.5 overflow-y-auto pr-1">
            {visible.length === 0 && (
              <p className="py-6 text-center text-xs text-[#86868B]">No notifications here.</p>
            )}
            {visible.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl bg-[#F9FAFB] p-3 transition-colors hover:bg-[#F3F4F6] ${
                  item.read ? "opacity-60" : "opacity-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4px] text-[#86868B]">
                    {item.label}
                  </span>
                  <span className="shrink-0 text-[11px] text-[#86868B]">{item.time}</span>
                </div>
                <p className="mt-1 text-xs font-bold leading-snug text-[#1D1D1F]">
                  {item.message}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-[#EDEDEF] pt-3 text-center">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="cursor-pointer text-xs font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
            >
              Mark all as read
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
