"use client";

import { Paperclip, Smile, X, Zap } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { priorityPillClasses, type SupportTicket } from "@/components/super-admin/tickets/ticketsData";
import { SelectTemplateModal } from "@/components/super-admin/tickets/SelectTemplateModal";

const EMOJIS = ["😀", "😊", "😍", "👍", "🙏", "😢", "😡", "🎉", "✅", "❌", "📦", "🚚", "💰", "⏰", "👋", "😅"];

type TicketReplyModalProps = {
  ticket: SupportTicket | null;
  open: boolean;
  onClose: () => void;
};

export function TicketReplyModal({ ticket, open, onClose }: TicketReplyModalProps) {
  const [reply, setReply] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!ticket) return null;

  const firstName = ticket.customer.split(" ")[0];

  function handleClose() {
    setReply("");
    setAttachments([]);
    setSent(false);
    onClose();
  }

  return (
    <>
      <ModalShell open={open} onClose={handleClose} maxWidth="max-w-[780px]">
        <div className="max-h-[92vh] overflow-y-auto p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4 pr-10">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-black">Reply to #{ticket.id}</h2>
              <p className="text-sm font-semibold text-[#22C55E]">
                {ticket.customer} • Order: {ticket.order}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-semibold text-[#374151]">
              Category: {ticket.category.charAt(0) + ticket.category.slice(1).toLowerCase()}
            </span>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityPillClasses(ticket.priority)}`}>
              Priority: {ticket.priority}
            </span>
          </div>

          {sent ? (
            <div className="mt-6 rounded-2xl bg-[#F0FDF4] p-6 text-center">
              <p className="text-sm font-semibold text-[#22C55E]">Reply sent to {ticket.customer}.</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#9CA3AF]">
                  Customer Message
                </span>
                <p className="text-sm font-bold text-black">
                  {ticket.customer} <span className="font-semibold text-[#22C55E]">• Order: {ticket.order}</span>
                </p>
                <div className="rounded-xl bg-[#F0FDF4] p-3.5">
                  <p className="text-sm leading-[21px] text-[#374151]">{ticket.message}</p>
                </div>
                <span className="text-xs text-[#9CA3AF]">{ticket.time}</span>
                <div className="flex gap-2">
                  {[0, 1, 2].map((index) => (
                    <Image
                      key={index}
                      src="/Warehouse/product.png"
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 shrink-0 rounded-lg border border-[#F1F5F9] object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#9CA3AF]">
                    Your Reply
                  </span>
                  <button
                    type="button"
                    onClick={() => setTemplateOpen(true)}
                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#22C55E] hover:text-[#1ea34d]"
                  >
                    <Zap className="h-3.5 w-3.5" strokeWidth={2} />
                    Use Template
                  </button>
                </div>
                <div className="relative flex-1 rounded-xl border border-[#E5E5E7] p-3">
                  <textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder={`Type your response to ${firstName} here...`}
                    rows={7}
                    className="h-full w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-[#9CA3AF]"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const files = Array.from(event.target.files ?? []);
                      setAttachments((prev) => [...prev, ...files]);
                      event.target.value = "";
                    }}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Attach file"
                      title="Attach file"
                      className="cursor-pointer text-[#9CA3AF] transition-colors hover:text-black"
                    >
                      <Paperclip className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setEmojiOpen((value) => !value)}
                        aria-label="Insert emoji"
                        title="Insert emoji"
                        className="cursor-pointer text-[#9CA3AF] transition-colors hover:text-black"
                      >
                        <Smile className="h-4 w-4" strokeWidth={2} />
                      </button>
                      {emojiOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setEmojiOpen(false)} />
                          <div className="absolute bottom-7 right-0 z-20 grid w-[232px] grid-cols-6 gap-1 rounded-xl border border-[#E5E5E7] bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setReply((prev) => prev + emoji);
                                  setEmojiOpen(false);
                                }}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg transition-colors hover:bg-[#F5F5F7]"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <span
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-1.5 rounded-full bg-[#F5F5F7] py-1 pl-3 pr-1.5 text-xs font-medium text-black"
                      >
                        {file.name}
                        <button
                          type="button"
                          onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                          aria-label={`Remove ${file.name}`}
                          className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#e9e9ec] hover:text-black"
                        >
                          <X className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!sent && (
            <div className="mt-6 flex flex-col gap-4 border-t border-[#F1F5F9] pt-5 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reply.trim()}
                onClick={() => setSent(true)}
                className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send Reply
              </button>
            </div>
          )}
        </div>
      </ModalShell>

      <SelectTemplateModal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onApply={(template) => {
          setReply(template.preview);
          setTemplateOpen(false);
        }}
      />
    </>
  );
}
