"use client";

import { ArrowRight, Check, Search, Star } from "lucide-react";
import { useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { TESTIMONIAL_LIBRARY } from "@/components/super-admin/masterdata/masterDataData";

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").toUpperCase();
}

type TestimonialsPickerModalProps = {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
};

export function TestimonialsPickerModal({ open, onClose, selectedIds, onApply }: TestimonialsPickerModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const [sortMode, setSortMode] = useState<"All Ratings" | "Recent">("All Ratings");

  const visible = TESTIMONIAL_LIBRARY
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortMode === "Recent") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });

  const recentlySelected = selected
    .slice(-3)
    .reverse()
    .map((id) => TESTIMONIAL_LIBRARY.find((item) => item.id === id))
    .filter((item): item is (typeof TESTIMONIAL_LIBRARY)[number] => Boolean(item));

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[940px]">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-black">Select Testimonials</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Curate your top customer stories for the product page.</p>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer names or keywords..."
            className="w-full rounded-full bg-[#F5F5F7] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]"
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(["All Ratings", "Recent"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSortMode(option)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  sortMode === option ? "bg-[#F7931E] text-white" : "bg-[#F3F4F6] font-medium text-[#374151] hover:bg-[#E5E7EB]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected([]);
              setSortMode("All Ratings");
              setSearch("");
            }}
            className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
          >
            Reset filters
          </button>
        </div>

        <div className="mt-4 grid max-h-[420px] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
          {visible.map((item) => {
            const checked = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`relative rounded-2xl border-2 p-4 text-left transition-colors ${
                  checked ? "border-[#F7931E] bg-white" : "border-[#F3F4F6] bg-white hover:border-[#E5E7EB]"
                }`}
              >
                <span
                  className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full ${
                    checked ? "bg-[#F7931E]" : "border-2 border-[#D1D5DB]"
                  }`}
                >
                  {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white">
                    {initials(item.name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{item.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-3 w-3 ${index < Math.round(item.rating) ? "fill-[#F7931E] text-[#F7931E]" : "text-[#E5E7EB]"}`}
                            strokeWidth={0}
                          />
                        ))}
                      </span>
                      {item.date}
                    </div>
                  </div>
                </div>
                <p className="mt-3 pr-6 text-sm leading-relaxed text-[#374151]">&quot;{item.text}&quot;</p>
                {item.verified && (
                  <span className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#F7931E]">
                    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#F7931E]">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                    VERIFIED
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#F3F4F6] pt-5">
          <div className="flex items-center gap-2 text-sm text-[#374151]">
            {recentlySelected.length > 0 && (
              <span className="flex -space-x-2">
                {recentlySelected.map((item) => (
                  <span
                    key={item.id}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#F7931E] text-[10px] font-semibold text-white"
                  >
                    {initials(item.name)}
                  </span>
                ))}
              </span>
            )}
            <span className="font-semibold text-black">{selected.length} selected</span>
          </div>
          <div className="flex items-center gap-3">
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
              className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F7931E] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Add to Product Page
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
