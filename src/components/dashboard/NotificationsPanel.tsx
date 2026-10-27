"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Archive, Check, Headphones, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ComponentType } from "react";
import { TicketReplyModal, type TicketSummary } from "./TicketReplyModal";

type Notification = {
  id: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  iconColor: string;
  iconBg: string;
  cardBg: string;
  cardBorder?: string;
  label: string;
  time: string;
  message: string;
  messageBold: boolean;
  action: string;
  actionColor: string;
  href?: string;
  read?: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "stock-alert",
    icon: Archive,
    iconColor: "text-[#F9A51A]",
    iconBg: "bg-[#D93025]/10",
    cardBg: "bg-[#FCE8E6]",
    cardBorder: "border border-[#F9D0CF]",
    label: "Stock Alert: Bahurupi Rice",
    time: "2m ago",
    message: "Bahurupi is currently at 0 kg.",
    messageBold: true,
    action: "Update Stock",
    actionColor: "text-black",
    href: "/inventory?view=details&status=out&sku=VB-BA-18",
  },
  {
    id: "urgent-ticket",
    icon: Headphones,
    iconColor: "text-[#1D1D1F]",
    iconBg: "bg-white shadow-sm",
    cardBg: "bg-[#F5F5F7]",
    label: "New Urgent Ticket: TKT-1042 (Divya Krishnan)",
    time: "1h ago",
    message: "Subject: Damaged/Broken seal.",
    messageBold: true,
    action: "Reply Now",
    actionColor: "text-[#3BB54A]",
  },
  {
    id: "order-delivered",
    icon: Check,
    iconColor: "text-[#3BB54A]",
    iconBg: "bg-[#3BB54A]/10",
    cardBg: "bg-[#F5F5F7]",
    label: "Order #VB-8490 Delivery Is Complete",
    time: "2h ago",
    message: "Divya Pillai's Order is Delivered by Delhivery Express.",
    messageBold: false,
    action: "View details",
    actionColor: "text-[#3BB54A]",
    href: "/orders?tab=Delivered",
  },
];

const URGENT_TICKET: TicketSummary = {
  id: "TKT-1042",
  customer: "Divya Krishnan",
  subject: "Damaged/Broken seal on arrival. Requesting an immediate replacement.",
  priority: "Urgent",
  category: "Technical",
};

type NotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
};

export function NotificationsPanel({ open, onClose, notifications, onMarkAsRead }: NotificationsPanelProps) {
  const router = useRouter();
  const [ticketOpen, setTicketOpen] = useState(false);

  function handleAction(item: Notification) {
    if (item.href) {
      router.push(item.href);
      onClose();
      return;
    }
    if (item.id === "urgent-ticket") {
      setTicketOpen(true);
      onClose();
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-50 mt-3 w-[300px] max-w-[88vw] rounded-2xl bg-white p-5 shadow-[0_32px_80px_rgba(0,0,0,0.12),0_2px_16px_rgba(0,0,0,0.04)] sm:w-[340px]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-[-0.36px] text-[#1D1D1F]">
                Operations Feed
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#E9F0E3] text-[#3E4A3C] transition-colors hover:bg-[#dbe6d2]"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-1">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAction(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleAction(item);
                    }
                  }}
                  className={`flex cursor-pointer flex-col gap-1.5 rounded-xl p-3 transition-all hover:brightness-[0.98] ${item.cardBg} ${item.cardBorder ?? ""} ${item.read ? "opacity-60 grayscale-[0.2]" : "opacity-100"}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
                    >
                      <item.icon className={`h-4 w-4 ${item.iconColor}`} strokeWidth={2} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs leading-[18px] text-[#86868B]">{item.label}</p>
                        <span className="shrink-0 text-[11px] leading-[18px] text-[#86868B]">
                          {item.time}
                        </span>
                      </div>
                      <p
                        className={`text-[13px] leading-[19px] text-[#1D1D1F] ${
                          item.messageBold ? "font-bold" : "font-normal"
                        }`}
                      >
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end items-center gap-3">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onMarkAsRead(item.id);
                        }}
                        className="cursor-pointer text-[12px] font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAction(item);
                      }}
                      className={`cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-opacity hover:opacity-70 ${item.actionColor}`}
                    >
                      {item.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TicketReplyModal
        ticket={URGENT_TICKET}
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
      />
    </>
  );
}
