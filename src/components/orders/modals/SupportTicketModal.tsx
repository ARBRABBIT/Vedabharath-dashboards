"use client";

import { Paperclip, Smile, X, Zap } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Order } from "../OrderCard";
import { ModalShell } from "./ModalShell";
import { PRIMARY_BUTTON, pillClasses, ticketId } from "./modalHelpers";

type SupportTicketModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onInitiateRefund: () => void;
};

const TEMPLATE_REPLY =
  "Hi, thanks for reaching out and sorry for the trouble! We've flagged this with our packaging team and are processing a replacement/refund for the affected item right away.";

const EMOJIS = ["😀", "😊", "😍", "👍", "🙏", "😢", "😡", "🎉", "✅", "❌", "📦", "🚚", "💰", "⏰", "👋", "😅"];

export function SupportTicketModal({ order, open, onClose, onInitiateRefund }: SupportTicketModalProps) {
  const [reply, setReply] = useState("");
  const [resolved, setResolved] = useState(false);
  const [sent, setSent] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstName = order.customer.split(" ")[0];

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[780px]">
      <div className="max-h-[92vh] overflow-y-auto p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[#171D15]">Reply to {ticketId(order.id)}</h2>
            <p className="text-sm font-semibold text-[#3BB54A]">
              {order.customer} • Order: {order.id.replace("#", "")}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className={pillClasses("green")}>Category: Return</span>
          <span className={pillClasses("blue")}>Priority: Urgent</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
              Customer Message
            </span>
            <p className="text-sm font-bold text-[#171D15]">
              {order.customer} <span className="font-semibold text-[#3BB54A]">• Order: {order.id}</span>
            </p>
            <div className="rounded-xl bg-[#F0F9F1] p-3.5">
              <p className="text-sm leading-[21px] text-[#3E4A3C]">
                Hello team, I received my order today but one of the rice packs has a broken seal.
                There&apos;s some spillage in the delivery box. Please let me know how to proceed with
                a replacement.
              </p>
            </div>
            <span className="text-xs text-[#86868B]">Today, 10:15 AM</span>
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
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                Your Reply
              </span>
              <button
                type="button"
                onClick={() => setReply(TEMPLATE_REPLY)}
                className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#3BB54A] hover:text-[#2f9d3d]"
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
                className="h-full w-full resize-none bg-transparent text-sm text-[#171D15] outline-none placeholder:text-[#86868B]"
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
                  className="cursor-pointer text-[#86868B] transition-colors hover:text-[#171D15]"
                >
                  <Paperclip className="h-4 w-4" strokeWidth={2} />
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setEmojiOpen((value) => !value)}
                    aria-label="Insert emoji"
                    title="Insert emoji"
                    className="cursor-pointer text-[#86868B] transition-colors hover:text-[#171D15]"
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
                    className="flex items-center gap-1.5 rounded-full bg-[#F5F5F7] py-1 pl-3 pr-1.5 text-xs font-medium text-[#171D15]"
                  >
                    {file.name}
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                      aria-label={`Remove ${file.name}`}
                      className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-[#86868B] hover:bg-[#e9e9ec] hover:text-[#171D15]"
                    >
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-[#F1F5F9] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#171D15]">
            <input
              type="checkbox"
              checked={resolved}
              onChange={(event) => setResolved(event.target.checked)}
              className="h-4 w-4 cursor-pointer accent-[#F7931E]"
            />
            Mark Ticket as Resolved
          </label>

          <div className="flex items-center gap-5">
            <button
              type="button"
              disabled={!reply.trim() || sent}
              onClick={() => setSent(true)}
              className="cursor-pointer text-sm font-semibold text-[#3BB54A] transition-colors hover:text-[#2f9d3d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sent ? "Reply Sent" : "Send Reply"}
            </button>
            <button type="button" onClick={onInitiateRefund} className={PRIMARY_BUTTON}>
              View Return / Replacement
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
