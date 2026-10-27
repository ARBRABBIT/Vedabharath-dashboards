"use client";

import { Check, Search } from "lucide-react";
import { useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { HEALTH_BENEFIT_LIBRARY } from "@/components/super-admin/masterdata/masterDataData";

type HealthBenefitsPickerModalProps = {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
};

export function HealthBenefitsPickerModal({ open, onClose, selectedIds, onApply }: HealthBenefitsPickerModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(selectedIds);

  const visible = HEALTH_BENEFIT_LIBRARY.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[620px]">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-black">Health Benefits</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Tailor your product profile by selecting key nutritional components.</p>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for a health benefits"
            className="w-full rounded-full border border-[#E5E7EB] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
          />
        </div>

        <div className="mt-4 flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
          {visible.map((item) => {
            const checked = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`flex items-center justify-between gap-4 rounded-2xl border-2 p-4 text-left transition-colors ${
                  checked ? "border-[#F7931E] bg-white" : "border-[#F3F4F6] bg-white hover:border-[#E5E7EB]"
                }`}
              >
                <div>
                  <p className="text-base font-bold text-black">{item.name}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{item.description}</p>
                </div>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    checked ? "bg-[#F7931E]" : "border-2 border-[#D1D5DB]"
                  }`}
                >
                  {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[#E5E7EB] px-8 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(selected);
              onClose();
            }}
            className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Add Selected ({selected.length})
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
