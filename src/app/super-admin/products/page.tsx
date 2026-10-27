
"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { FilterDropdown } from "@/components/super-admin/ui/FilterDropdown";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";
import { PRODUCTS, performanceTag, stockDotColor, tagPillClasses } from "@/components/super-admin/products/productsData";
""
const PAGE_SIZE = 5;

export default function TopSellingProductsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    return [...PRODUCTS].sort((a, b) => b.orders - a.orders);
  }, []);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Top Selling Products"
          subtitle="Track product sales, stock availability and active orders."
        />

        <div className="mt-6 flex items-center justify-end">
          <div className="rounded-full border border-[#E5E7EB] bg-white">
            <FilterDropdown
              value={dateRange}
              onChange={setDateRange}
              icon={<Calendar className="h-4 w-4 shrink-0 text-[#6B7280]" strokeWidth={2} />}
              options={[
                { value: "7", label: "Last 7 Days" },
                { value: "30", label: "Last 30 Days" },
                { value: "90", label: "Last 90 Days" },
              ]}
            />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Variants</th>
                  <th className="px-4 py-4">Stock Available</th>
                  <th className="px-4 py-4">Orders</th>
                  <th className="px-4 py-4">Sales Progress</th>
                  <th className="px-4 py-4">Product Tag</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((product, index) => {
                  const rank = (page - 1) * PAGE_SIZE + index + 1;
                  return (
                    <tr key={product.sku} className="border-b border-[#F3F4F6] last:border-none">
                      <td className="px-6 py-4 text-sm font-bold text-black">
                        {String(rank).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]">
                            <Image
                              src="/Warehouse/product.png"
                              alt=""
                              width={44}
                              height={44}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-black">{product.name}</p>
                            <p className="text-xs text-[#9CA3AF]">{product.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1.5">
                          {product.variants.map((variant) => (
                            <span
                              key={variant}
                              className="rounded-md bg-[#E5EEFF] px-2 py-1 text-[11px] font-medium text-[#374151]"
                            >
                              {variant}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-black">
                          <span className={`h-2 w-2 rounded-full ${stockDotColor(product.stock)}`} />
                          {product.stock.toLocaleString()} units
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-black">{product.orders.toLocaleString()}</p>
                        <p className={`text-xs ${product.ordersDelta >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                          {product.ordersDelta >= 0 ? "+" : ""}
                          {product.ordersDelta}% this week
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-black">{product.salesPercent}% Sold</p>
                        <div className="mt-1.5 h-1.5 w-[110px] overflow-hidden rounded-full bg-[#F3F4F6]">
                          <div
                            className="h-full rounded-full bg-[#F7931E]"
                            style={{ width: `${product.salesPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tagPillClasses(performanceTag(product.salesPercent))}`}
                        >
                          {performanceTag(product.salesPercent)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/super-admin/products/${product.sku}`}
                          className="inline-block cursor-pointer rounded-full bg-[#F7931E] px-5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#F3F4F6] px-6 pb-6 pt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={sorted.length}
              pageSize={PAGE_SIZE}
              itemLabel="products"
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
