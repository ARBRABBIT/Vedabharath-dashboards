import { Star } from "lucide-react";
import Link from "next/link";

type Review = {
  name: string;
  productTag: string;
  text: string;
  avatarBg: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const REVIEWS: Review[] = [
  {
    name: "Priya Sharma",
    productTag: "DUDESHWAR",
    text: "Excellent quality Navara rice with authentic taste and freshness. Perfect packaging and fast delivery. Highly recommended for daily meals.",
    avatarBg: "bg-[#F7931E]",
  },
  {
    name: "Rahul Verma",
    productTag: "BLACK BURMA",
    text: "Excellent quality Navara rice with authentic taste and freshness. Perfect packaging and fast delivery. Highly recommended for daily meals.",
    avatarBg: "bg-[#2E7D32]",
  },
  {
    name: "Neha Kapoor",
    productTag: "CHINTHALURI SANNALU",
    text: "Excellent quality Navara rice with authentic taste and freshness. Perfect packaging and fast delivery. Highly recommended for daily meals.",
    avatarBg: "bg-[#3B82F6]",
  },
];

export function CustomerReviewsCard() {
  return (
    <div className="flex h-[380px] flex-[1.75] flex-col rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-black">Customer Reviews</h3>
        </div>
        <Link
          href="/super-admin/reviews"
          className="shrink-0 cursor-pointer text-xs text-[#6B7280] hover:text-black"
        >
          View All
        </Link>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3 scrollbar-hide overflow-y-auto pr-1">
        {REVIEWS.map((review) => (
          <div
            key={review.name}
            className="flex shrink-0 flex-col gap-3 rounded-2xl bg-[#FAFAFA] p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3 sm:w-[190px] sm:shrink-0">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${review.avatarBg}`}
              >
                {initials(review.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-black">{review.name}</p>
                <div className="mt-0.5 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-3 w-3 fill-[#F7931E] text-[#F7931E]"
                      strokeWidth={0}
                    />
                  ))}
                </div>
              </div>
            </div>

            <span className="flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#F3E7D0] bg-white px-2 py-0.5 text-center text-[10px] font-bold text-[#F7931E]">
              {review.productTag}
            </span>

            <p className="ml-12 text-left text-xs leading-relaxed text-[#6B7280] sm:w-[340px]">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
