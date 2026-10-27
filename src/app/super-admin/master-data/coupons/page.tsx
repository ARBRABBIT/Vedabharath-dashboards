"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { EditOfferModal } from "@/components/super-admin/offers/EditOfferModal";
import { LaunchOfferModal } from "@/components/super-admin/offers/LaunchOfferModal";
import { OFFERS, statusPillClasses, type Offer } from "@/components/super-admin/offers/offersData";
import { FilterDropdown } from "@/components/super-admin/ui/FilterDropdown";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const PAGE_SIZE = 5;
type StatusFilter = "All Statuses" | Offer["status"];

export default function CouponsPage() {
  const [offers, setOffers] = useState<Offer[]>(OFFERS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Statuses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [launchOpen, setLaunchOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  function handleSaveOffer(updated: Offer) {
    setOffers((prev) => prev.map((offer) => (offer.id === updated.id ? updated : offer)));
  }

  const filtered = useMemo(() => {
    return offers.filter((offer) => {
      const isCoupon = offer.type === "Coupon";
      const matchesStatus = statusFilter === "All Statuses" ? true : offer.status === statusFilter;
      const matchesSearch =
        offer.name.toLowerCase().includes(search.toLowerCase()) ||
        offer.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        offer.discount.toLowerCase().includes(search.toLowerCase());
      return isCoupon && matchesStatus && matchesSearch;
    });
  }, [offers, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Coupons"
          subtitle="Track the performance of all your coupon campaigns and offers"
          backHref="/super-admin/master-data"
          right={
            <div className="rounded-full border border-[#E5E7EB] bg-white">
              <FilterDropdown
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value as StatusFilter);
                  setPage(1);
                }}
                options={[
                  { value: "All Statuses", label: "All Statuses" },
                  { value: "Active", label: "Active" },
                  { value: "Scheduled", label: "Scheduled" },
                  { value: "Completed", label: "Completed" },
                ]}
              />
            </div>
          }
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#6B7280]">
            All Coupons ({filtered.length})
          </p>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search Coupons..."
                className="w-[200px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E] sm:w-[240px]"
              />
            </div>
            <button
              type="button"
              onClick={() => setLaunchOpen(true)}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add New Coupon
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Discount</th>
                  <th className="px-4 py-4">Period</th>
                  <th className="px-4 py-4">Orders</th>
                  <th className="px-4 py-4">Revenue</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-[#9CA3AF]">
                      No coupons found.
                    </td>
                  </tr>
                )}
                {pageItems.map((offer) => (
                  <tr key={offer.id} className="border-b border-[#F3F4F6] last:border-none">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-black">{offer.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{offer.subtitle}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-[#EBF7EC] px-2.5 py-1 text-xs font-semibold text-[#22C55E]">
                        {offer.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold text-black">{offer.discount}</p>
                      <p className="text-xs text-[#9CA3AF]">{offer.discountNote}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black">{offer.period}</p>
                      <p className="text-xs text-[#9CA3AF]">{offer.duration}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-black">{offer.orders.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-black">₹{offer.revenue.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusPillClasses(offer.status)}`}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingOffer(offer)}
                        className="cursor-pointer rounded-full border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                      >
                        Edit Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#F3F4F6] px-6 py-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              itemLabel="coupons"
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

      <LaunchOfferModal
        open={launchOpen}
        onClose={() => setLaunchOpen(false)}
        defaultOfferType="coupon"
      />

      <EditOfferModal
        offer={editingOffer}
        open={editingOffer !== null}
        onClose={() => setEditingOffer(null)}
        onSave={handleSaveOffer}
      />
    </div>
  );
}
