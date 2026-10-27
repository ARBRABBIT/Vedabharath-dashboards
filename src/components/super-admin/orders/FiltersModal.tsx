"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";

export type OrderFilters = {
  products: string[];
  statuses: string[];
  methods: string[];
  warehouses: string[];
  dateQuick: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

export const EMPTY_FILTERS: OrderFilters = {
  products: [],
  statuses: [],
  methods: [],
  warehouses: [],
  dateQuick: null,
  dateFrom: null,
  dateTo: null,
};

type Tab = "Product" | "Status" | "Method" | "Warehouse" | "Date";
const TABS: Tab[] = ["Product", "Status", "Method", "Warehouse", "Date"];

export const DEFAULT_WAREHOUSES = [
  "Whitefield Distribution Hub",
  "Gachibowli Distribution Hub",
  "Kukatpally Distribution Hub",
  "Secunderabad Distribution Hub",
  "HSR Layout Distribution Hub",
  "Indiranagar Distribution Hub",
];

type FiltersModalProps = {
  open: boolean;
  onClose: () => void;
  products: string[];
  statuses: string[];
  methods: string[];
  warehouses?: string[];
  value: OrderFilters;
  onApply: (filters: OrderFilters) => void;
};

const QUICK_SELECTS = ["Today", "Last 7 Days", "This Month"];
const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthWeeks(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; inCurrentMonth: boolean }[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - firstWeekday + 1 + i), inCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inCurrentMonth: true });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, nextDay), inCurrentMonth: false });
    nextDay += 1;
  }

  const weeks: { date: Date; inCurrentMonth: boolean }[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition-colors ${
        checked ? "border-[#F7931E] bg-white text-[#F7931E]" : "border-[#F3F4F6] bg-white text-[#374151] hover:border-[#E5E7EB]"
      }`}
    >
      {label}
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
          checked ? "bg-[#F7931E]" : "border-2 border-[#D1D5DB]"
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

export function FiltersModal({
  open,
  onClose,
  products,
  statuses,
  methods,
  warehouses = DEFAULT_WAREHOUSES,
  value,
  onApply,
}: FiltersModalProps) {
  const [tab, setTab] = useState<Tab>("Product");
  const [draft, setDraft] = useState<OrderFilters>(value);
  const [viewMonth, setViewMonth] = useState(() => (value.dateFrom ? new Date(value.dateFrom) : new Date()));
  const today = toISODate(new Date());

  function toggle(list: string[], item: string) {
    return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
  }

  function quickSelectRange(option: string): { from: string; to: string } {
    const now = new Date();
    if (option === "Today") {
      return { from: toISODate(now), to: toISODate(now) };
    }
    if (option === "Last 7 Days") {
      const start = new Date(now);
      start.setDate(start.getDate() - 6);
      return { from: toISODate(start), to: toISODate(now) };
    }
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: toISODate(start), to: toISODate(end) };
  }

  function handleClear() {
    setDraft(EMPTY_FILTERS);
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[700px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#F7931E]">Filters</h2>

        <div className="mt-4 flex gap-5">
          <div className="w-[140px] shrink-0">
            <div className="flex flex-col gap-1">
              {TABS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTab(option)}
                  className={`cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                    tab === option ? "bg-[#F7931E] text-white" : "text-[#F7931E]/80 hover:bg-[#FEF3E2]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[280px] flex-1">
            {tab === "Product" && (
              <div className="flex flex-col gap-3">
                {products.map((product) => (
                  <CheckRow
                    key={product}
                    label={product}
                    checked={draft.products.includes(product)}
                    onToggle={() => setDraft((prev) => ({ ...prev, products: toggle(prev.products, product) }))}
                  />
                ))}
              </div>
            )}

            {tab === "Status" && (
              <div className="flex flex-col gap-3">
                {statuses.map((status) => (
                  <CheckRow
                    key={status}
                    label={status}
                    checked={draft.statuses.includes(status)}
                    onToggle={() => setDraft((prev) => ({ ...prev, statuses: toggle(prev.statuses, status) }))}
                  />
                ))}
              </div>
            )}

            {tab === "Method" && (
              <div className="flex flex-col gap-3">
                {methods.map((method) => (
                  <CheckRow
                    key={method}
                    label={method}
                    checked={draft.methods.includes(method)}
                    onToggle={() => setDraft((prev) => ({ ...prev, methods: toggle(prev.methods, method) }))}
                  />
                ))}
              </div>
            )}

            {tab === "Warehouse" && (
              <div className="flex flex-col gap-3">
                {warehouses.map((warehouse) => (
                  <CheckRow
                    key={warehouse}
                    label={warehouse}
                    checked={draft.warehouses.includes(warehouse)}
                    onToggle={() => setDraft((prev) => ({ ...prev, warehouses: toggle(prev.warehouses, warehouse) }))}
                  />
                ))}
              </div>
            )}

            {tab === "Date" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-black">
                      {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#374151]"
                      >
                        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#374151]"
                      >
                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold text-[#9CA3AF]">
                    {WEEKDAYS.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  {getMonthWeeks(viewMonth).map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 text-center text-xs">
                      {week.map((cell, dayIndex) => {
                        const iso = toISODate(cell.date);
                        const isStart = draft.dateFrom === iso;
                        const isEnd = draft.dateTo === iso;
                        const inRange =
                          draft.dateFrom && draft.dateTo && iso > draft.dateFrom && iso < draft.dateTo;
                        const isToday = iso === today;
                        return (
                          <button
                            key={dayIndex}
                            type="button"
                            onClick={() =>
                              setDraft((prev) => {
                                if (!prev.dateFrom || (prev.dateFrom && prev.dateTo)) {
                                  return { ...prev, dateFrom: iso, dateTo: null, dateQuick: null };
                                }
                                if (iso < prev.dateFrom) {
                                  return { ...prev, dateFrom: iso, dateTo: prev.dateFrom, dateQuick: null };
                                }
                                return { ...prev, dateTo: iso, dateQuick: null };
                              })
                            }
                            className={`relative flex h-7 w-full cursor-pointer items-center justify-center py-0.5 ${
                              inRange ? "bg-[#FEF3E2]" : ""
                            } ${isStart && draft.dateTo ? "rounded-l-full bg-[#FEF3E2]" : ""} ${
                              isEnd && draft.dateFrom !== draft.dateTo ? "rounded-r-full bg-[#FEF3E2]" : ""
                            }`}
                          >
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                                isStart || isEnd
                                  ? "bg-[#F7931E] font-semibold text-white"
                                  : cell.inCurrentMonth
                                    ? "text-[#374151] hover:bg-[#FEF3E2]"
                                    : "text-[#D1D5DB] hover:bg-[#F9FAFB]"
                              } ${isToday && !isStart && !isEnd ? "ring-1 ring-[#F7931E]" : ""}`}
                            >
                              {cell.date.getDate()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="w-[140px] shrink-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Quick Selects</p>
                  <div className="mt-2 flex flex-col gap-1">
                    {QUICK_SELECTS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (draft.dateQuick === option) {
                            setDraft((prev) => ({ ...prev, dateQuick: null, dateFrom: null, dateTo: null }));
                            return;
                          }
                          const range = quickSelectRange(option);
                          setDraft((prev) => ({ ...prev, dateQuick: option, dateFrom: range.from, dateTo: range.to }));
                          setViewMonth(new Date(range.to));
                        }}
                        className={`cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          draft.dateQuick === option ? "bg-[#FEF3E2] font-semibold text-[#F7931E]" : "text-[#374151] hover:bg-[#F9FAFB]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {(draft.dateQuick || draft.dateFrom) && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">Selected</p>
                      <p className="text-sm font-semibold text-[#F7931E]">
                        {draft.dateQuick ??
                          (draft.dateFrom &&
                            (draft.dateTo && draft.dateTo !== draft.dateFrom
                              ? `${formatShortDate(draft.dateFrom)} - ${formatShortDate(draft.dateTo)}`
                              : formatShortDate(draft.dateFrom)))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#F3F4F6] pt-5">
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer text-sm font-semibold text-[#F7931E] hover:text-[#e07f0e]"
          >
            Clear Filters
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
