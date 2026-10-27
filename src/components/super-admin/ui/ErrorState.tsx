"use client";

import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while fetching the data for this page. This might be due to a temporary connection issue or a missing record.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
        <AlertTriangle className="h-6 w-6 text-[#EF4444]" strokeWidth={2} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mx-auto mt-1.5 max-w-[360px] text-sm leading-relaxed text-[#6B7280]">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Retry
        </button>
      )}
    </div>
  );
}
