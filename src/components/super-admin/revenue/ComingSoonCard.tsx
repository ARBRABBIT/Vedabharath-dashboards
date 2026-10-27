import { Rocket } from "lucide-react";

export function ComingSoonCard() {
  return (
    <div className="mx-6 flex max-w-[380px] flex-col items-center gap-4 rounded-[32px] border-2 border-black/[0.04] bg-white p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]">
        <Rocket className="h-7 w-7 text-[#F7931E]" strokeWidth={2} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-black">Coming in Version 2.0</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          This dashboard is currently being optimized for regional intelligence. Revenue tracking and
          settlement forecasts will be fully accessible in the upcoming v2.0 release.
        </p>
      </div>
    </div>
  );
}
