import { Tag } from "lucide-react";
import Link from "next/link";

const OFFERS = [
  { code: "FESTIVE20", desc: "20% off on all orders", daysLeft: "3 Days Left" },
  { code: "HEALTH10", desc: "10% off above ₹999", daysLeft: "7 Days Left" },
  { code: "HEALTH10", desc: "10% off above ₹999", daysLeft: "7 Days Left" },
  { code: "HEALTH10", desc: "10% off above ₹999", daysLeft: "7 Days Left" },
];

export function ActiveOffersCard() {
  return (
    <div className="flex h-[380px] flex-[0.9] flex-col rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6">
      <div className="flex shrink-0 items-center justify-between">
        <h3 className="text-xl font-semibold text-black">Active Offers</h3>
        <Link href="/super-admin/offers" className="cursor-pointer text-xs text-[#6B7280] hover:text-black">
          View All
        </Link>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3 scrollbar-hide overflow-y-auto pr-1">
        {OFFERS.map((offer, index) => (
          <div
            key={`${offer.code}-${index}`}
            className="flex shrink-0 items-center justify-between gap-3 rounded-2xl bg-[#FAFAFA] p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                <Tag className="h-4 w-4 text-[#F7931E]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">{offer.code}</p>
                <p className="text-xs text-[#9CA3AF]">{offer.desc}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#F7931E]">
              {offer.daysLeft}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
