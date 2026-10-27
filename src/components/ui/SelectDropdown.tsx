"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
  disabled?: boolean;
};

type SelectDropdownProps<T extends string> = {
  label: string;
  id?: string;
  appearance?: "filter" | "field";
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

const TONE_STYLES = {
  neutral: { trigger: "bg-white", dot: "bg-[#86868B]" },
  success: { trigger: "bg-[#EBF7EC]", dot: "bg-[#3BB54A]" },
  warning: { trigger: "bg-[#FEF3E2]", dot: "bg-[#F7931E]" },
  danger: { trigger: "bg-[#FEE2E2]", dot: "bg-[#DC2626]" },
} as const;

/** Single-value design-system select for short, non-searchable option lists. */
export function SelectDropdown<T extends string>({
  label,
  id: triggerId,
  appearance = "filter",
  value,
  options,
  onChange,
  disabled = false,
}: SelectDropdownProps<T>) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];
  const enabledIndices = options.flatMap((option, index) => option.disabled ? [] : [index]);
  const isOpen = open && !disabled && enabledIndices.length > 0;
  const tone = TONE_STYLES[selected?.tone ?? "neutral"];

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.focus({ preventScroll: true });
    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen]);

  function show(index = Math.max(0, selectedIndex)) {
    if (disabled || enabledIndices.length === 0) return;
    searchRef.current = { text: "", time: 0 };
    setActiveIndex(options[index] && !options[index].disabled ? index : enabledIndices[0]);
    setOpen(true);
  }

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  }

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    close(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => enabledIndices[(enabledIndices.indexOf(index) + 1) % enabledIndices.length]);
        return;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => enabledIndices[(enabledIndices.indexOf(index) - 1 + enabledIndices.length) % enabledIndices.length]);
        return;
      case "Home":
      case "End":
        event.preventDefault();
        setActiveIndex(event.key === "Home" ? enabledIndices[0] : enabledIndices[enabledIndices.length - 1]);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(activeIndex);
        return;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close(true);
        return;
      case "Tab":
        // Return to the trigger before the browser advances to the next control.
        close(true);
        return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = event.timeStamp;
      const previous = searchRef.current;
      const text = (now - previous.time < 500 ? previous.text : "") + event.key.toLowerCase();
      searchRef.current = { text, time: now };
      const query = [...text].every((character) => character === text[0]) ? text[0] : text;
      for (let offset = 1; offset <= options.length; offset++) {
        const index = (activeIndex + offset) % options.length;
        if (!options[index].disabled && options[index].label.toLowerCase().startsWith(query)) {
          setActiveIndex(index);
          break;
        }
      }
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${appearance === "filter" ? "sm:w-auto" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
    >
      <button
        ref={triggerRef}
        id={triggerId ?? `${id}-trigger`}
        type="button"
        disabled={disabled || enabledIndices.length === 0}
        aria-label={`${label}: ${selected?.label ?? "Select an option"}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${id}-listbox` : undefined}
        onClick={() => isOpen ? close() : show()}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            show(event.key === "Home" ? enabledIndices[0] : event.key === "End" ? enabledIndices[enabledIndices.length - 1] : Math.max(0, selectedIndex));
          }
        }}
        className={`flex ${appearance === "field" ? "min-h-14" : "min-h-11"} w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold text-[#171D15] transition-colors duration-150 hover:border-[#BDCAB8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9A51A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${appearance === "field" ? "bg-[#F5F5F7]" : `sm:min-w-[190px] ${tone.trigger}`} ${isOpen ? "border-[#F9A51A]" : "border-[#BDCAB8]/30"}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {appearance === "filter" && <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />}
          <span className="truncate">{selected?.label ?? "Select an option"}</span>
        </span>
        <ChevronDown aria-hidden="true" strokeWidth={2} className={`h-4 w-4 shrink-0 text-[#6E7B6A] transition-transform duration-150 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          aria-activedescendant={options[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="absolute right-0 top-full z-20 mt-2 max-h-[280px] w-full min-w-[200px] max-w-[calc(100vw-48px)] overflow-y-auto overscroll-contain rounded-2xl border border-[#BDCAB8]/30 bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                onPointerMove={() => { if (!option.disabled) setActiveIndex(index); }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                className={`flex min-h-11 items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 ${option.disabled ? "cursor-not-allowed text-[#86868B]" : "cursor-pointer text-[#171D15]"} ${isSelected ? "bg-[#FEF3E2] font-semibold" : "font-medium"} ${!option.disabled && activeIndex === index ? "ring-1 ring-inset ring-[#F9A51A]/40" : ""} ${!option.disabled && !isSelected && activeIndex === index ? "bg-[#F5F5F7]" : ""}`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  {appearance === "filter" && <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${TONE_STYLES[option.tone ?? "neutral"].dot}`} />}
                  <span className="truncate">{option.label}</span>
                </span>
                {option.disabled && <span className="shrink-0 rounded-full bg-[#F5F5F7] px-2 py-1 text-[10px] font-semibold text-[#6E7B6A]">Unavailable</span>}
                {isSelected && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[#F7931E]" strokeWidth={2.5} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
