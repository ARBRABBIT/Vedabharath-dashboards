"use client";

import { PackagePlus } from "lucide-react";
import { useState } from "react";
import { CreateOrderModal } from "./CreateOrderModal";

export function CreateOrderFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Create Order"
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2.5 rounded-full bg-[#F7931E] px-5 py-3 sm:px-6 sm:py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(247,147,30,0.4)] transition-all duration-200 hover:bg-[#E08217] hover:shadow-[0_14px_34px_rgba(247,147,30,0.5)] hover:scale-105 active:scale-95 cursor-pointer"
      >
        <PackagePlus className="h-5 w-5" strokeWidth={2.2} />
        <span>Create Order</span>
      </button>

      <CreateOrderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
