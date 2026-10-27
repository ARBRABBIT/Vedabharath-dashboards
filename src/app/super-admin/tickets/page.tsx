"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { SUPPORT_TICKETS, priorityPillClasses, type SupportTicket } from "@/components/super-admin/tickets/ticketsData";
import { TicketReplyModal } from "@/components/super-admin/tickets/TicketReplyModal";
import { FilterDropdown } from "@/components/super-admin/ui/FilterDropdown";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";

type CategoryFilter = "All Tickets" | SupportTicket["category"];
type PriorityFilter = "Urgent" | "Medium" | "Low" | "All Priorities";

export default function ActiveSupportTicketsPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All Tickets");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("Urgent");
  const [search, setSearch] = useState("");
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);

  const filtered = useMemo(() => {
    return SUPPORT_TICKETS.filter((ticket) => {
      if (categoryFilter !== "All Tickets" && ticket.category !== categoryFilter) return false;
      if (priorityFilter !== "All Priorities" && ticket.priority !== priorityFilter) return false;
      if (
        search &&
        !ticket.customer.toLowerCase().includes(search.toLowerCase()) &&
        !ticket.id.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [categoryFilter, priorityFilter, search]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader title="Active Support Tickets" subtitle="Resolve The Customer Queries" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <FilterDropdown
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value as CategoryFilter)}
              options={["All Tickets", "BILLING", "TECHNICAL", "PACKING", "DELIVERY"].map((option) => ({
                value: option,
                label: option,
              }))}
              highlight={categoryFilter !== "All Tickets"}
            />
            <FilterDropdown
              value={priorityFilter}
              onChange={(value) => setPriorityFilter(value as PriorityFilter)}
              options={["All Priorities", "Urgent", "Medium", "Low"].map((option) => ({
                value: option,
                label: option,
              }))}
              highlight={priorityFilter !== "All Priorities"}
            />
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Tickets..."
              className="w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-[#9CA3AF]">No tickets found.</p>
          )}
          {filtered.map((ticket) => (
            <div key={ticket.id} className="flex flex-col gap-3 rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Ticket ID</p>
                  <p className="text-sm font-bold text-[#F7931E]">#{ticket.id}</p>
                </div>
                <span className="inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-semibold text-[#374151]">
                  {ticket.category}
                </span>
              </div>

              <span
                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${priorityPillClasses(ticket.priority)}`}
              >
                {ticket.priority}
              </span>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#374151]">
                  {ticket.customer
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <p className="text-sm font-semibold text-black">{ticket.customer}</p>
              </div>

              <p className="line-clamp-2 text-sm text-[#6B7280]">{ticket.subject}</p>

              <button
                type="button"
                onClick={() => setActiveTicket(ticket)}
                className="mt-1 w-fit cursor-pointer self-center rounded-full bg-[#F7931E] px-10 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Reply
              </button>
            </div>
          ))}
        </div>
      </main>

      <TicketReplyModal ticket={activeTicket} open={activeTicket !== null} onClose={() => setActiveTicket(null)} />
    </div>
  );
}
