"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

type ProductRowMenuProps = {
  onStockStatus: () => void;
  onEditDetails: () => void;
  onDelete: () => void;
};

export function ProductRowMenu({ onStockStatus, onEditDetails, onDelete }: ProductRowMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="More actions"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F5F5F7]"
      >
        <MoreVertical className="h-4 w-4" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-[180px] overflow-hidden rounded-xl border border-[#F3F4F6] bg-white py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onStockStatus();
            }}
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB]"
          >
            Stock Status
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEditDetails();
            }}
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB]"
          >
            Edit Product Details
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2]"
          >
            Delete Product
          </button>
        </div>
      )}
    </div>
  );
}
