"use client";

import { Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { MasterProduct } from "@/components/super-admin/masterdata/masterDataData";

type StockStatusModalProps = {
  product: MasterProduct | null;
  open: boolean;
  onClose: () => void;
};

export function StockStatusModal({ product, open, onClose }: StockStatusModalProps) {
  const [variant1Status, setVariant1Status] = useState("In Stock");
  const [variant2Status, setVariant2Status] = useState("Out of Stock");
  const [discountType, setDiscountType] = useState<"Coupon" | "Percentage">("Coupon");

  if (!product) return null;

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[560px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black">Stock Status</h2>

        <div className="mt-4 flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]">
            <Image src="/Warehouse/product.png" alt="" width={64} height={64} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-base font-bold text-black">{product.name}</p>
            <p className="text-sm text-[#9CA3AF]">{product.description}</p>
          </div>
        </div>

        <p className="mt-5 text-base font-bold text-black">Quantity &amp; Stock</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Variant</label>
            <input
              type="text"
              defaultValue="2 kg"
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Status</label>
            <select
              value={variant1Status}
              onChange={(event) => setVariant1Status(event.target.value)}
              className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]"
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>Low Stock</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Variant</label>
            <input
              type="text"
              defaultValue="5 kg"
              className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Status</label>
            <select
              value={variant2Status}
              onChange={(event) => setVariant2Status(event.target.value)}
              className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]"
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>Low Stock</option>
            </select>
          </div>
        </div>

        <p className="mt-5 text-base font-bold text-black">Apply Discount / Coupon</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#374151]">Discount Type</label>
            <select
              value={discountType}
              onChange={(event) => setDiscountType(event.target.value as "Coupon" | "Percentage")}
              className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]"
            >
              <option>Coupon</option>
              <option>Percentage</option>
            </select>
          </div>

          {discountType === "Coupon" ? (
            <div>
              <label className="text-xs font-semibold text-[#374151]">Coupon Code</label>
              <select className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]">
                <option value="">Select coupon</option>
                <option>FESTIVE10</option>
                <option>FREESHIP</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-[#374151]">Discount Value &amp; Max Discount</label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative w-full">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0"
                    className="w-full rounded-xl border border-[#E5E7EB] py-2.5 pl-4 pr-7 text-sm text-black outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">%</span>
                </div>
                <input
                  type="number"
                  min={0}
                  placeholder="₹ Max"
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#374151]">Start Date</label>
            <input
              type="date"
              className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151]">End Date</label>
            <input
              type="date"
              className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F0FDF4] p-3 text-sm text-[#22C55E]">
          <Tag className="h-4 w-4 shrink-0" strokeWidth={2} />
          Customers will get 10% off on all variants during this period.
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[#E5E7EB] px-8 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Update
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
