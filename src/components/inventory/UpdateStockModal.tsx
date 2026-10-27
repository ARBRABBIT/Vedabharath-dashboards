"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/orders/modals/modalHelpers";
import { SelectDropdown, type SelectOption } from "@/components/ui/SelectDropdown";
import type { BagSize, ProductStock } from "./productStockData";

const BAG_OPTIONS: readonly SelectOption<"1" | "5">[] = [
  { value: "1", label: "1kg bag" },
  { value: "5", label: "5kg bag" },
];

type UpdateStockModalProps = {
  products: ProductStock[];
  initialSku: string | null;
  open: boolean;
  onClose: () => void;
  onAdjust: (sku: string, size: BagSize, delta: number) => void;
};

export function UpdateStockModal({ products, initialSku, open, onClose, onAdjust }: UpdateStockModalProps) {
  const [adjustment, setAdjustment] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState("5");
  const [bagSize, setBagSize] = useState<"1" | "5">("1");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) {
      setAdjustment("add");
      setQuantity("5");
      setBagSize("1");
      setNotes("");
      setConfirmed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialSku]);

  const product = products.find((item) => item.sku === initialSku);
  const notesRequired = adjustment === "remove";
  const size = Number(bagSize) as BagSize;
  const bagCount = Number(quantity);
  const availableBags = product?.bags[size] ?? 0;
  const exceedsStock = adjustment === "remove" && bagCount > availableBags;
  const canSubmit = Number.isSafeInteger(bagCount) && bagCount > 0 && !exceedsStock && (!notesRequired || notes.trim() !== "");

  function handleSubmit() {
    if (!product || !canSubmit) return;
    const delta = adjustment === "add" ? Number(quantity) : -Number(quantity);
    onAdjust(product.sku, size, delta);
    setConfirmed(true);
  }

  if (!product) return null;

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[680px]">
      <div className="max-h-[85vh] overflow-y-auto p-7 sm:p-8">
        {confirmed ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF7EC]">
              <Check className="h-6 w-6 text-[#3BB54A]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-[#1D1D1F]">Stock Updated</h2>
              <p className="text-sm leading-[22px] text-[#86868B]">
                {quantity || 0} × {bagSize}kg bags {adjustment === "add" ? "added to" : "removed from"}{" "}
                <span className="font-bold text-[#171D15]">{product.name}</span>.
              </p>
            </div>
            <button type="button" onClick={onClose} className={PRIMARY_BUTTON}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 border-b border-[#F1F5F9] pb-5 pr-10">
              <h2 className="text-xl font-bold text-[#171D15]">Update Stock</h2>
              <p className="text-sm text-[#6E7B6A]">Manual global inventory correction</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="stock-product" className="text-sm font-semibold text-[#171D15]">Product</label>
                  <input
                    id="stock-product"
                    type="text"
                    readOnly
                    value={product.name}
                    className="w-full cursor-default rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none focus-visible:ring-2 focus-visible:ring-[#F7931E]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="stock-bag-size" className="text-sm font-semibold text-[#171D15]">Pack Size</label>
                  <SelectDropdown id="stock-bag-size" label="Pack size" appearance="field" value={bagSize} onChange={setBagSize} options={BAG_OPTIONS} />
                  <p className="text-xs text-[#6E7B6A]">{availableBags} {bagSize}kg bags available</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">Adjustment Type</span>
                  <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#E5E5E7]">
                    <button
                      type="button"
                      onClick={() => setAdjustment("add")}
                      className={`cursor-pointer py-3 text-sm font-bold transition-colors ${
                        adjustment === "add" ? "bg-white text-[#3BB54A]" : "bg-[#F5F5F7] text-[#86868B]"
                      }`}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustment("remove")}
                      className={`cursor-pointer border-l border-[#E5E5E7] py-3 text-sm font-bold transition-colors ${
                        adjustment === "remove" ? "bg-white text-[#3BB54A]" : "bg-[#F5F5F7] text-[#86868B]"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">Number of Bags</span>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      max={adjustment === "remove" ? availableBags : undefined}
                      aria-invalid={exceedsStock}
                      aria-describedby={exceedsStock ? "stock-quantity-error" : undefined}
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      className="w-full rounded-xl bg-[#F5F5F7] py-3 pl-4 pr-14 text-sm font-semibold text-[#171D15] outline-none"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#86868B]">
                      bags
                    </span>
                  </div>
                  {exceedsStock && <span id="stock-quantity-error" role="alert" className="text-xs text-[#DC2626]">Only {availableBags} bags available for this pack size.</span>}
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-[#171D15]">
                  Warehouse Notes <span className="font-normal text-[#86868B]">({notesRequired ? "Mandatory" : "Optional"})</span>
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={
                    adjustment === "add"
                      ? "e.g., Received additional units from weekly farm shipment..."
                      : "e.g., Found damaged seals during morning QA check..."
                  }
                  rows={8}
                  className="h-full w-full resize-none rounded-xl bg-[#F5F5F7] p-4 text-sm text-[#171D15] outline-none placeholder:text-[#86868B]"
                />
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6">
              <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`${PRIMARY_BUTTON} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {adjustment === "add" ? "Add Stock" : "Remove Stock"}
              </button>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}
