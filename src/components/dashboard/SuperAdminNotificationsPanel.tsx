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

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-6 right-6 z-50 flex w-[400px] max-w-[88vw] flex-col rounded-3xl bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[26px] font-extrabold tracking-tight text-[#1D1D1F]">
                Notifications
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F0F0F2] text-[#1D1D1F] transition-colors hover:bg-[#E4E4E7]"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            <div className="mb-4 flex w-fit items-center gap-1 rounded-full bg-[#F5F5F7] p-1.5">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    activeFilter === filter
                      ? "bg-[#F9A51A] text-white"
                      : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="border-t border-[#EDEDEF]" />

            <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {visible.length === 0 && (
                <p className="py-6 text-center text-sm text-[#86868B]">No notifications here.</p>
              )}
              {visible.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl bg-[#F5F5F7] p-4 transition-opacity ${
                    item.read ? "opacity-60" : "opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#86868B]">
                      {item.label}
                    </span>
                    <span className="shrink-0 text-xs text-[#86868B]">{item.time}</span>
                  </div>
                  <p className="mt-1 text-[15px] font-bold leading-[21px] text-[#1D1D1F]">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-[#EDEDEF] pt-4 text-center">
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="cursor-pointer text-sm font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
