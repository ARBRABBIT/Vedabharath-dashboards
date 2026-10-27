"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, pillClasses } from "@/components/orders/modals/modalHelpers";

export type TicketSummary = {
  id: string;
  customer: string;
  subject: string;
  priority: "Urgent" | "Medium" | "Low";
  category: string;
};

type TicketReplyModalProps = {
  ticket: TicketSummary | null;
  open: boolean;
  onClose: () => void;
};

const PRIORITY_TONE: Record<TicketSummary["priority"], "red" | "orange" | "blue"> = {
  Urgent: "red",
  Medium: "orange",
  Low: "blue",
};

export function TicketReplyModal({ ticket, open, onClose }: TicketReplyModalProps) {
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setReply("");
      setSent(false);
    }
  }, [open, ticket?.id]);

  if (!ticket) return null;

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[560px]">
      <div className="p-7 sm:p-8">
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF7EC]">
              <Check className="h-6 w-6 text-[#3BB54A]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-[#1D1D1F]">Reply Sent</h2>
              <p className="text-sm leading-[22px] text-[#86868B]">
                Your reply to <span className="font-bold text-[#171D15]">{ticket.customer}</span> on{" "}
                {ticket.id} has been sent.
              </p>
            </div>
            <button type="button" onClick={onClose} className={PRIMARY_BUTTON}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 border-b border-[#F1F5F9] pb-5 pr-10">
              <h2 className="text-xl font-bold text-[#171D15]">Reply to {ticket.id}</h2>
              <p className="text-sm font-semibold text-[#3BB54A]">{ticket.customer}</p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className={pillClasses(PRIORITY_TONE[ticket.priority])}>
                Priority: {ticket.priority}
              </span>
              <span className={pillClasses("green")}>Category: {ticket.category}</span>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">Subject</span>
              <p className="rounded-xl bg-[#F0F9F1] p-3.5 text-sm leading-[21px] text-[#3E4A3C]">
                {ticket.subject}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                Your Reply
              </span>
              <textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder={`Type your response to ${ticket.customer.split(" ")[0]} here...`}
                rows={5}
                className="w-full resize-none rounded-xl border border-[#E5E5E7] p-3 text-sm text-[#171D15] outline-none placeholder:text-[#86868B] focus:border-[#F9A51A]"
              />
            </div>

            <div className="mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6">
              <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
                Cancel
              </button>
              <button
                type="button"
                disabled={!reply.trim()}
                onClick={() => setSent(true)}
                className={`${PRIMARY_BUTTON} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Send Reply
              </button>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}
