"use client";

import Link from "next/link";
import { useState } from "react";
import { TicketReplyModal, type TicketSummary } from "@/components/dashboard/TicketReplyModal";

type SupportTicket = TicketSummary & {
  order: string;
  priorityLabel: string;
  time: string;
  quote: string;
};

const TICKETS: SupportTicket[] = [
  {
    id: "TKT-0205-1",
    customer: "Meera Nair",
    order: "VB-8501",
    priorityLabel: "NORMAL",
    priority: "Medium",
    category: "DELIVERY",
    time: "09:42 AM",
    subject: "#TKT-0205 - Delivery delay...",
    quote: "\"My order status has been showing...\"",
  },
  {
    id: "TKT-0205-2",
    customer: "Meera Nair",
    order: "VB-8501",
    priorityLabel: "NORMAL",
    priority: "Medium",
    category: "DELIVERY",
    time: "09:42 AM",
    subject: "#TKT-0205 - Delivery delay...",
    quote: "\"My order status has been showing...\"",
  },
  {
    id: "TKT-0205-3",
    customer: "Meera Nair",
    order: "VB-8501",
    priorityLabel: "NORMAL",
    priority: "Medium",
    category: "DELIVERY",
    time: "09:42 AM",
    subject: "#TKT-0205 - Delivery delay...",
    quote: "\"My order status has been showing...\"",
  },
];

export function ActiveSupportTicketsCard() {
  const [activeTicket, setActiveTicket] = useState<TicketSummary | null>(null);

  return (
    <div className="flex h-[380px] flex-1 flex-col rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6">
      <div className="flex shrink-0 items-center justify-between">
        <h3 className="text-xl font-semibold text-black">Active Support Tickets</h3>
        <Link href="/super-admin/tickets" className="cursor-pointer text-xs text-[#6B7280] hover:text-black">
          View All
        </Link>
      </div>

      <div className="mt-4 flex flex-1 flex-col scrollbar-hide overflow-y-auto pr-1">
        {TICKETS.map((ticket, index) => (
          <div
            key={ticket.id}
            className={`flex shrink-0 items-start justify-between gap-4 py-4 ${
              index !== TICKETS.length - 1 ? "border-b border-[#F3F4F6]" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-black">{ticket.customer}</span>
                <span className="text-sm text-[#9CA3AF]">| Order: {ticket.order}</span>
                <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-semibold text-[#6B7280]">
                  {ticket.priorityLabel}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-black">{ticket.subject}</p>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">{ticket.quote}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="text-xs text-[#9CA3AF]">{ticket.time}</span>
              <button
                type="button"
                onClick={() => setActiveTicket(ticket)}
                className="cursor-pointer whitespace-nowrap rounded-lg bg-[#F7931E] px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      <TicketReplyModal
        ticket={activeTicket}
        open={activeTicket !== null}
        onClose={() => setActiveTicket(null)}
      />
    </div>
  );
}
