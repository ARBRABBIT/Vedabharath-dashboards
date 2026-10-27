import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-[#F9A51A] text-white hover:bg-[#e6960f]",
  secondary:
    "border border-[#E4E4E7] bg-white text-[#1A1C1D] hover:bg-[#F3F3F5]",
};

export const BUTTON_BASE_CLASSES =
  "w-full rounded-full py-[18px] text-base font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

export function Button({
  className = "",
  variant = "primary",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 ${BUTTON_BASE_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-[18px] w-[18px] animate-spin" strokeWidth={2.5} />}
      {children}
    </button>
  );
}
