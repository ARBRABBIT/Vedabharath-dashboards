"use client";

import { ChevronDown, FileText, Filter, MapPin, Phone, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { DEFAULT_WAREHOUSES, EMPTY_FILTERS, FiltersModal, type OrderFilters } from "@/components/super-admin/orders/FiltersModal";
import { OrderDetailModal } from "@/components/super-admin/orders/OrderDetailModal";
import { INITIAL_ORDERS, statusPillClasses, type Order } from "@/components/super-admin/orders/ordersData";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const STATUS_OPTIONS = ["To Be Packed", "Ship", "Exception", "Delivered", "Returned"];
const METHOD_OPTIONS = ["UPI Payment", "Prepaid (UPI)", "Net Banking", "Card Payment", "COD"];
const PAGE_SIZE = 6;

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function UserManagementOrdersPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<OrderFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(INITIAL_ORDERS[0]?.id ?? null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);

  const productOptions = useMemo(
    () => Array.from(new Set(INITIAL_ORDERS.flatMap((order) => order.items.map((item) => item.name)))),
    [],
  );

  const filtered = useMemo(() => {
    return INITIAL_ORDERS.filter((order) => {
      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(order.status);
      const matchesMethod = filters.methods.length === 0 || filters.methods.includes(order.paymentMethod);
      const matchesProduct =
        filters.products.length === 0 || order.items.some((item) => filters.products.includes(item.name));
      const matchesWarehouse =
        filters.warehouses.length === 0 ||
        (order.warehouse && filters.warehouses.includes(order.warehouse));
      const matchesDate = (() => {
        if (!filters.dateFrom) return true;
        const placedOn = new Date();
        placedOn.setDate(placedOn.getDate() - order.daysAgo);
        const iso = toISODate(placedOn);
        const to = filters.dateTo ?? filters.dateFrom;
        return iso >= filters.dateFrom && iso <= to;
      })();
      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod &&
        matchesProduct &&
        matchesWarehouse &&
        matchesDate
      );
    });
  }, [search, filters]);

  const activeFilterCount =
    filters.statuses.length +
    filters.methods.length +
    filters.products.length +
    filters.warehouses.length +
    (filters.dateQuick || filters.dateFrom ? 1 : 0);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title={
            <>
              User Management - <span className="font-normal">Orders</span>
            </>
          }
          subtitle="Track, manage, and process every order without the clutter"
          backHref="/super-admin/users"
          right={
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
                  placeholder="Search Orders, Customers..."
                  className="w-[240px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                />
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={2} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F7931E] px-1 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          }
        />

        <div className="mt-6 flex flex-col gap-4">
          {filtered.length === 0 && (
            <p className="rounded-[28px] border-2 border-black/[0.04] bg-white py-10 text-center text-sm text-[#9CA3AF]">
              No orders found.
            </p>
          )}

          {pageItems.map((order) => {
            const expanded = expandedId === order.id;
            return (
              <div key={order.id} className="overflow-hidden rounded-[28px] border-2 border-black/[0.04] bg-white">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#F7931E]">#{order.id}</p>
                    <p className="text-sm font-semibold text-black">{order.customer}</p>
                    <p className="text-xs text-[#9CA3AF]">{order.placedAt}</p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-sm font-bold text-black">₹{order.amount.toLocaleString()}</p>
                    <p className="text-xs text-[#9CA3AF]">{order.paymentMethod}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${statusPillClasses(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#9CA3AF] transition-transform ${expanded ? "rotate-180" : ""}`}
                      strokeWidth={2}
                    />
                  </div>
                </button>

                {expanded && (
                  <div className="grid grid-cols-1 gap-4 border-t border-[#F3F4F6] p-5 sm:grid-cols-[280px_1fr_auto]">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Customer Details</p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#374151]">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-[#F7931E]" strokeWidth={2} />
                        {order.phone}
                      </div>
                      <div className="mt-1 flex max-w-[260px] items-start gap-2 text-sm leading-relaxed text-[#374151]">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F7931E]" strokeWidth={2} />
                        {order.address}
                      </div>
                      {order.warehouse && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[#EFF6E9] px-2 py-1 text-[11px] font-semibold text-[#006E1F]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                          {order.warehouse}
                        </div>
                      )}
                    </div>
                    <div className="sm:border-x sm:border-[#F3F4F6] sm:pl-2 sm:pr-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Ordered Items</p>
                      <div className="mt-2 flex flex-col gap-2">
                        {order.items.map((item) => (
                          <div key={item.name} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Image
                                src="/Warehouse/product.png"
                                alt=""
                                width={32}
                                height={32}
                                className="h-8 w-8 shrink-0 rounded-md object-cover"
                              />
                              <div>
                                <p className="text-sm text-black">{item.name}</p>
                                <p className="text-xs text-[#9CA3AF]">{item.variant}</p>
                                {item.outOfStock && (
                                  <p className="text-xs font-semibold text-[#EF4444]">
                                    OUT OF STOCK - 0 Units Available
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-black">x{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-2 sm:pl-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Quick Actions</p>
                      <button
                        type="button"
                        onClick={() => setViewingOrder(order)}
                        className="flex w-[220px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl bg-[#F7931E] px-5 py-2.5 text-left text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <FileText className="h-4 w-4 shrink-0" strokeWidth={2} />
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="orders"
            onPageChange={setPage}
          />
        </div>
      </main>

      <FiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        products={productOptions}
        statuses={STATUS_OPTIONS}
        methods={METHOD_OPTIONS}
        warehouses={DEFAULT_WAREHOUSES}
        value={filters}
        onApply={setFilters}
      />

      <OrderDetailModal order={viewingOrder} open={viewingOrder !== null} onClose={() => setViewingOrder(null)} />
    </div>
  );
}
