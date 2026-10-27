"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useId, useState, type InputHTMLAttributes } from "react";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  icon: LucideIcon;
  id?: string;
};

export function TextField({
  label,
  icon: Icon,
  type = "text",
  id,
  className = "",
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold text-[#3D4949]">
        {label}
      </label>
      <div className="flex w-full items-center gap-[18px] rounded-full bg-[#F3F3F5] px-6 py-[18px] focus-within:ring-2 focus-within:ring-[#F9A51A]/40">
        <Icon className="h-[18px] w-[18px] shrink-0 text-[#6D7A7A]" strokeWidth={2} />
        <input
          id={inputId}
          type={isPassword ? (visible ? "text" : "password") : type}
          className={`w-full min-w-0 bg-transparent text-base text-[#1A1C1D] outline-none placeholder:text-[#6D7A7A]/50 ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="shrink-0 text-[#6D7A7A] transition-colors hover:text-[#3D4949]"
            aria-label={visible ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? (
              <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} />
            ) : (
              <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
