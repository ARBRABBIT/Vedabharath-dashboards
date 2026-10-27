"use client";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface DatePickerProps {
  value?: string; // Format: "YYYY-MM-DD"
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  align?: "left" | "right";
  className?: string;
  id?: string;
}

function parseYMD(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [year, month, day] = parts;
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? null : d;
}

function formatToYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(dateStr?: string): string {
  const parsed = parseYMD(dateStr);
  if (!parsed) return "";
  const d = String(parsed.getDate()).padStart(2, "0");
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const y = parsed.getFullYear();
  return `${d}/${m}/${y}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  error = false,
  disabled = false,
  minDate,
  maxDate,
  align = "left",
  className = "",
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseYMD(value);
  const today = new Date();

  // Current calendar view (year and month)
  const [viewYear, setViewYear] = useState(() => selectedDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selectedDate?.getMonth() ?? today.getMonth());

  // Update view month/year if value changes externally while closed
  useEffect(() => {
    if (selectedDate && !open) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value, open]);

  // Handle click outside
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Prev / Next month handlers
  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  }

  // Build calendar matrix (Sunday to Saturday)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  type DayCell = {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    dateStr: string;
  };

  const days: DayCell[] = [];

  // Trailing days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthIndex = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYearIndex = viewMonth === 0 ? viewYear - 1 : viewYear;
    days.push({
      day,
      month: prevMonthIndex,
      year: prevYearIndex,
      isCurrentMonth: false,
      dateStr: formatToYMD(new Date(prevYearIndex, prevMonthIndex, day)),
    });
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
      dateStr: formatToYMD(new Date(viewYear, viewMonth, day)),
    });
  }

  // Leading days of next month to complete standard 6-row or 5-row grid
  const remainingCells = (7 - (days.length % 7)) % 7;
  const totalCellsNeeded = days.length + remainingCells < 35 ? 35 : days.length + remainingCells;
  const nextMonthFiller = totalCellsNeeded - days.length;
  for (let i = 1; i <= nextMonthFiller; i++) {
    const nextMonthIndex = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYearIndex = viewMonth === 11 ? viewYear + 1 : viewYear;
    days.push({
      day: i,
      month: nextMonthIndex,
      year: nextYearIndex,
      isCurrentMonth: false,
      dateStr: formatToYMD(new Date(nextYearIndex, nextMonthIndex, i)),
    });
  }

  function handleSelectDate(dateStr: string) {
    onChange(dateStr);
    setOpen(false);
  }

  function handleSelectToday() {
    const todayStr = formatToYMD(today);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onChange(todayStr);
    setOpen(false);
  }

  function handleClear() {
    onChange("");
    setOpen(false);
  }

  const isTodayDate = (dateStr: string) => dateStr === formatToYMD(today);
  const isSelectedDate = (dateStr: string) => Boolean(value && dateStr === value);

  const isDateDisabled = (dateStr: string) => {
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const displayText = formatDisplay(value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-left text-sm transition-colors outline-none ${
          disabled ? "cursor-not-allowed bg-[#F9FAFB] opacity-60" : "hover:border-[#D1D5DB]"
        } ${
          open
            ? "border-[#F7931E] ring-2 ring-[#FEF3E2]"
            : error
              ? "border-[#EF4444]"
              : "border-[#E5E7EB]"
        }`}
      >
        <span className={displayText ? "font-medium text-black" : "text-[#9CA3AF]"}>
          {displayText || placeholder}
        </span>
        <CalendarIcon
          className={`h-4 w-4 shrink-0 transition-colors ${open ? "text-[#F7931E]" : "text-[#9CA3AF]"}`}
          strokeWidth={1.8}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full z-50 mt-1.5 w-[280px] rounded-2xl border border-[#F3F4F6] bg-white p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-bold text-[#1F2937]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#FEF3E2] hover:text-[#F7931E]"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#FEF3E2] hover:text-[#F7931E]"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 pt-1 text-center">
            {WEEKDAYS.map((weekday, idx) => (
              <span key={idx} className="text-[11px] font-bold text-[#9CA3AF]">
                {weekday}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="mt-1.5 grid grid-cols-7 gap-1">
            {days.map((item, index) => {
              const selected = isSelectedDate(item.dateStr);
              const isCurrentDay = isTodayDate(item.dateStr);
              const disabledCell = isDateDisabled(item.dateStr);

              return (
                <button
                  key={`${item.dateStr}-${index}`}
                  type="button"
                  disabled={disabledCell}
                  onClick={() => handleSelectDate(item.dateStr)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                    disabledCell
                      ? "cursor-not-allowed text-[#E5E7EB] opacity-40"
                      : selected
                        ? "bg-[#F7931E] font-bold text-white shadow-[0_2px_8px_rgba(247,147,30,0.35)]"
                        : isCurrentDay
                          ? "border border-[#F7931E] font-semibold text-[#F7931E] hover:bg-[#FEF3E2]"
                          : item.isCurrentMonth
                            ? "cursor-pointer text-[#374151] hover:bg-[#FEF3E2] hover:text-[#F7931E]"
                            : "cursor-pointer text-[#D1D5DB] hover:bg-[#F9FAFB] hover:text-[#9CA3AF]"
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Footer: Clear and Today */}
          <div className="mt-3 flex items-center justify-between border-t border-[#F3F4F6] pt-2.5">
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer text-xs font-semibold text-[#9CA3AF] transition-colors hover:text-[#EF4444]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSelectToday}
              className="cursor-pointer text-xs font-bold text-[#F7931E] transition-colors hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
