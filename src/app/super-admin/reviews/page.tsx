"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { CUSTOMER_REVIEWS } from "@/components/super-admin/reviews/reviewsData";
import { StarRating } from "@/components/super-admin/reviews/StarRating";
import { FilterDropdown } from "@/components/super-admin/ui/FilterDropdown";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const PAGE_SIZE = 5;
type VisibilityFilter = "All" | "Live" | "Hidden";
type RatingFilter = "All Ratings" | "5" | "4" | "3" | "2" | "1";

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState(CUSTOMER_REVIEWS);
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("All");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("All Ratings");
  const [productFilter, setProductFilter] = useState("All Products");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const products = useMemo(
    () => ["All Products", ...Array.from(new Set(CUSTOMER_REVIEWS.map((review) => review.product)))],
    [],
  );

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      if (visibilityFilter === "Live" && !review.visible) return false;
      if (visibilityFilter === "Hidden" && review.visible) return false;
      if (ratingFilter !== "All Ratings" && Math.round(review.rating) !== Number(ratingFilter)) return false;
      if (productFilter !== "All Products" && review.product !== productFilter) return false;
      if (search && !review.customer.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [reviews, visibilityFilter, ratingFilter, productFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleVisibility(id: string) {
    setReviews((prev) =>
      prev.map((review) => (review.id === id ? { ...review, visible: !review.visible } : review)),
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader title="Customer Reviews" subtitle="Monitor your product satisfaction" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <FilterDropdown
              value={ratingFilter}
              onChange={(value) => {
                setRatingFilter(value as RatingFilter);
                setPage(1);
              }}
              options={[
                { value: "All Ratings", label: "All Ratings" },
                { value: "5", label: "5 Stars" },
                { value: "4", label: "4 Stars" },
                { value: "3", label: "3 Stars" },
                { value: "2", label: "2 Stars" },
                { value: "1", label: "1 Star" },
              ]}
              highlight={ratingFilter !== "All Ratings"}
            />
            <FilterDropdown
              value={productFilter}
              onChange={(value) => {
                setProductFilter(value);
                setPage(1);
              }}
              options={products.map((product) => ({ value: product, label: product }))}
              highlight={productFilter !== "All Products"}
            />
            <FilterDropdown
              value={visibilityFilter}
              onChange={(value) => {
                setVisibilityFilter(value as VisibilityFilter);
                setPage(1);
              }}
              options={[
                { value: "All", label: "All" },
                { value: "Live", label: "Live" },
                { value: "Hidden", label: "Hidden" },
              ]}
              highlight={visibilityFilter !== "All"}
            />
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
            />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Rating</th>
                  <th className="px-4 py-4">Review</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#9CA3AF]">
                      No reviews found.
                    </td>
                  </tr>
                )}
                {pageItems.map((review) => (
                  <tr key={review.id} className="border-b border-[#F3F4F6] last:border-none">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white">
                          {review.customer
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">{review.customer}</p>
                          <p className="text-xs text-[#9CA3AF]">{review.customerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black">{review.product}</p>
                      <p className="text-xs text-[#9CA3AF]">{review.sku}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StarRating rating={review.rating} />
                      <p className="mt-0.5 text-xs font-semibold text-black">{review.rating.toFixed(1)}</p>
                    </td>
                    <td className="max-w-[260px] px-4 py-4 text-sm text-[#6B7280]">{review.review}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black">{review.date}</p>
                      <p className="text-xs text-[#9CA3AF]">{review.time}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                          Visibility
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleVisibility(review.id)}
                          aria-label="Toggle visibility"
                          className={`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                            review.visible ? "bg-[#F7931E]" : "bg-[#E5E7EB]"
                          }`}
                        >
                          <span
                            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                              review.visible ? "translate-x-[22px]" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#F3F4F6] px-6 pb-6 pt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              itemLabel="reviews"
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
