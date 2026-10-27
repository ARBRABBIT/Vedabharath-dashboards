"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type FilterOption = { value: string; label: string };

type FilterDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  highlight?: boolean;
  icon?: ReactNode;
};

export function FilterDropdown({ value, onChange, options, highlight, icon }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full py-2 pl-5 pr-4 text-sm font-semibold transition-colors ${
          highlight ? "bg-[#F7931E] text-white" : "bg-transparent text-[#374151] hover:text-black"
        }`}
      >
        {icon}
        {selected?.label ?? value}
        <ChevronDown
          className={`h-4 w-4 shrink-0 ${highlight ? "text-white" : "text-[#6B7280]"}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 max-h-[280px] min-w-[180px] overflow-y-auto rounded-2xl bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${
                option.value === value ? "font-semibold text-black" : "text-[#374151]"
              }`}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && (
                <Check className="h-3.5 w-3.5 shrink-0 text-[#F7931E]" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
