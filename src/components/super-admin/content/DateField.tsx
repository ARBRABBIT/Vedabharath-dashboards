"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatLabel(date: Date) {
  return `${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()}`;
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number; inMonth: boolean; date: Date }> = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, inMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, inMonth: true, date: new Date(year, month, day) });
  }
  while (cells.length % 7 !== 0 || cells.length < 35) {
    const next = cells.length - (startOffset + daysInMonth) + 1;
    cells.push({ day: next, inMonth: false, date: new Date(year, month + 1, next) });
  }
  return cells;
}

type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

export function DateField({ label, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(value));
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const cells = buildCalendarDays(viewDate.getFullYear(), viewDate.getMonth());

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="text-sm font-semibold text-black">{label}</label>
      <button
        type="button"
        onClick={() => {
          setViewDate(new Date(value));
          setOpen((prev) => !prev);
        }}
        className="mt-1.5 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-left text-sm text-black outline-none focus:border-[#F7931E]"
      >
        {formatLabel(value)}
        <Calendar className="h-4 w-4 text-[#9CA3AF]" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-[300px] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-black">
              {MONTH_NAMES[viewDate.getMonth()].slice(0, 3)} {viewDate.getFullYear()}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F5F5F7]"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F5F5F7]"
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
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
            {cells.map((cell, index) => {
              const selected = cell.date.toDateString() === value.toDateString();
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onChange(cell.date)}
                  className={`mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full ${
                    selected
                      ? "bg-[#F7931E] font-bold text-white"
                      : cell.inMonth
                        ? "text-[#374151] hover:bg-[#F5F5F7]"
                        : "text-[#D1D5DB]"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#F3F4F6] pt-3">
            <p className="text-sm font-bold text-black">
              {MONTH_NAMES[value.getMonth()]} {value.getDate()}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
