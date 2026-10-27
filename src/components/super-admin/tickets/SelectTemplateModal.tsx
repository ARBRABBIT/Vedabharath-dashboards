"use client";

import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { TEMPLATES, TEMPLATE_CATEGORIES, type ReplyTemplate } from "@/components/super-admin/tickets/templatesData";

type SelectTemplateModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (template: ReplyTemplate) => void;
};

export function SelectTemplateModal({ open, onClose, onApply }: SelectTemplateModalProps) {
  const [category, setCategory] = useState<ReplyTemplate["category"]>("Order Issues");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const template of TEMPLATES) map.set(template.category, (map.get(template.category) ?? 0) + 1);
    return map;
  }, []);

  const visible = TEMPLATES.filter(
    (template) =>
      template.category === category &&
      (template.title.toLowerCase().includes(search.toLowerCase()) ||
        template.preview.toLowerCase().includes(search.toLowerCase())),
  );

  function handleApply() {
    const template = TEMPLATES.find((item) => item.id === selectedId);
    if (template) onApply(template);
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[820px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black">Select Response Template</h2>
        <p className="mt-1 text-sm text-[#6B7280]">{TEMPLATES.length} Pre-saved templates available</p>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-full border border-[#E5E7EB] py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
          />
        </div>

        <div className="mt-4 flex gap-5">
          <div className="w-[160px] shrink-0">
            <div className="flex flex-col gap-1">
              {TEMPLATE_CATEGORIES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    category === option
                      ? "bg-[#F0FDF4] text-[#22C55E]"
                      : "text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {option} ({counts.get(option) ?? 0})
                </button>
              ))}
            </div>
          </div>

          <div className="grid max-h-[360px] flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {visible.map((template) => {
              const selected = selectedId === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedId(template.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-4 text-left transition-colors ${
                    selected ? "border-[#22C55E] bg-[#F0FDF4]" : "border-[#F3F4F6] bg-white hover:border-[#E5E7EB]"
                  }`}
                >
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <p className="pr-6 text-sm font-semibold text-black">{template.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#9CA3AF]">{template.preview}</p>
                </button>
              );
            })}
            {visible.length === 0 && (
              <p className="col-span-2 py-10 text-center text-sm text-[#9CA3AF]">No templates found.</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedId}
            onClick={handleApply}
            className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply Template
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
