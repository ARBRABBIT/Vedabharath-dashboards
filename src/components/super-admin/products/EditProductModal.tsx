"use client";

import { useEffect, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";

export type ProductDetailsEdit = {
  name: string;
  description: string;
  price: number;
  inStock: boolean;
};

type EditProductModalProps = {
  open: boolean;
  onClose: () => void;
  initial: ProductDetailsEdit;
  onSave: (data: ProductDetailsEdit) => void;
};

export function EditProductModal({ open, onClose, initial, onSave }: EditProductModalProps) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(String(initial.price));
  const [inStock, setInStock] = useState(initial.inStock);

  useEffect(() => {
    if (!open) return;
    setName(initial.name);
    setDescription(initial.description);
    setPrice(String(initial.price));
    setInStock(initial.inStock);
  }, [open, initial]);

  function handleSave() {
    onSave({ name: name.trim(), description: description.trim(), price: Number(price) || 0, inStock });
    onClose();
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[520px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black">Edit Product Details</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Update the information shown on this product&apos;s page.</p>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#374151]">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#374151]">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#374151]">Current Price (₹/kg)</label>
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#374151]">Availability</label>
              <select
                value={inStock ? "in" : "out"}
                onChange={(event) => setInStock(event.target.value === "in")}
                className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
              >
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
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
