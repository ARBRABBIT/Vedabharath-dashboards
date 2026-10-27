"use client";

import { Check } from "lucide-react";
import { ModalShell } from "@/components/orders/modals/ModalShell";

type BannerScheduledModalProps = {
  open: boolean;
  onDone: () => void;
  bannerGradient: string;
  imageUrl?: string | null;
  startDateLabel: string;
};

export function BannerScheduledModal({ open, onDone, bannerGradient, imageUrl, startDateLabel }: BannerScheduledModalProps) {
  return (
    <ModalShell open={open} onClose={onDone} maxWidth="max-w-[440px]">
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]">
          <Check className="h-7 w-7 text-[#22C55E]" strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-black">Banner Scheduled Successfully</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            Your Banner Will be live on the website and visible to customers From{" "}
            <span className="font-bold text-black">{startDateLabel}</span>
          </p>
        </div>

        <div
          className="relative h-[110px] w-full overflow-hidden rounded-2xl border border-[#E5E7EB]"
          style={imageUrl ? undefined : { backgroundImage: bannerGradient }}
        >
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Scheduled banner" className="h-full w-full object-cover" />
          )}
        </div>

        <button
          type="button"
          onClick={onDone}
          className="mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Done
        </button>
      </div>
    </ModalShell>
  );
}
