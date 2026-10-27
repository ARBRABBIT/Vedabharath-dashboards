import { Star } from "lucide-react";

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const fillAmount = Math.max(0, Math.min(1, rating - index));
        return (
          <span key={index} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-[#E5E7EB]" style={{ width: size, height: size }} strokeWidth={0} fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillAmount * 100}%` }}>
              <Star className="text-[#F7931E]" style={{ width: size, height: size }} strokeWidth={0} fill="currentColor" />
            </span>
          </span>
        );
      })}
    </div>
  );
}
