"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { FormModal } from "@/components/super-admin/masterdata/FormModal";
import { INITIAL_COUPONS, type Coupon } from "@/components/super-admin/masterdata/masterDataData";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { Pagination } from "@/components/super-admin/ui/Pagination";

const PAGE_SIZE = 10;

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const filtered = useMemo(
    () => coupons.filter((coupon) => coupon.code.toLowerCase().includes(search.toLowerCase())),
    [coupons, search],
  );
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSubmit(values: Record<string, string>) {
    if (!values.code?.trim()) return;
    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === editingCoupon.id ? { ...coupon, code: values.code, discount: values.discount ?? coupon.discount } : coupon,
        ),
      );
    } else {
      setCoupons((prev) => [
        {
          id: `c${prev.length + 1}-${Date.now()}`,
          code: values.code,
          subtitle: "New campaign",
          discount: values.discount ?? "50% off",
          maxDiscount: "Max discount ₹500",
        },
        ...prev,
      ]);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Coupons"
          subtitle="Add all the basic details of your new rice product"
          backHref="/super-admin/master-data"
          right={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add New Coupon
            </button>
          }
        />

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search Coupons"
            className="w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
          />
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center px-6 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            <span className="flex-1">Coupon Code</span>
            <span className="w-[220px]">Discount</span>
            <span className="w-[100px] text-right">Actions</span>
          </div>
          {pageItems.map((coupon) => (
            <div key={coupon.id} className="flex items-center rounded-2xl border-2 border-black/[0.04] bg-white px-6 py-5">
              <div className="flex-1">
                <p className="text-base font-bold text-black">{coupon.code}</p>
                <p className="text-sm text-[#9CA3AF]">{coupon.subtitle}</p>
              </div>
              <div className="w-[220px]">
                <p className="text-sm font-semibold text-black">{coupon.discount}</p>
                <p className="text-sm text-[#9CA3AF]">{coupon.maxDiscount}</p>
              </div>
              <div className="w-[100px] text-right">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(coupon)}
                  className="cursor-pointer rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            itemLabel="coupons"
            onPageChange={setPage}
          />
        </div>
      </main>

      <FormModal
        open={createOpen || editingCoupon !== null}
        onClose={() => {
          setCreateOpen(false);
          setEditingCoupon(null);
        }}
        title="Coupons"
        fields={[
          { key: "code", label: "Coupons Code", type: "text", placeholder: "FEUDU87" },
          { key: "discount", label: "Discount", type: "text", placeholder: "50% off" },
        ]}
        initialValues={editingCoupon ? { code: editingCoupon.code, discount: editingCoupon.discount } : undefined}
        submitLabel="Create coupons"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
