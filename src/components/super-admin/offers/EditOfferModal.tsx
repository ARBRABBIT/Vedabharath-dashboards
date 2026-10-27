"use client";

import { useEffect, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Offer } from "@/components/super-admin/offers/offersData";

type EditOfferModalProps = {
  offer: Offer | null;
  open: boolean;
  onClose: () => void;
  onSave: (offer: Offer) => void;
};

export function EditOfferModal({ offer, open, onClose, onSave }: EditOfferModalProps) {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountNote, setDiscountNote] = useState("");
  const [status, setStatus] = useState<Offer["status"]>("Active");

  useEffect(() => {
    if (!open || !offer) return;
    setName(offer.name);
    setSubtitle(offer.subtitle);
    setDiscount(offer.discount);
    setDiscountNote(offer.discountNote);
    setStatus(offer.status);
  }, [open, offer]);

  if (!offer) return null;

  function handleSave() {
    if (!offer) return;
    onSave({
      ...offer,
      name: name.trim(),
      subtitle: subtitle.trim(),
      discount: discount.trim(),
      discountNote: discountNote.trim(),
      status,
    });
    onClose();
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[480px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black">Edit Offer Details</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Update the campaign shown in your active offers list.</p>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#374151]">Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151]">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#374151]">Discount</label>
              <input
                type="text"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#374151]">Discount Note</label>
              <input
                type="text"
                value={discountNote}
                onChange={(event) => setDiscountNote(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151]">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as Offer["status"])}
              className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
            >
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
