"use client";

import { Calendar, Check, ChevronDown, Clock, Eye, EyeOff, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { categoryPillClasses, INITIAL_DRAFTS } from "@/components/super-admin/drafts/draftsData";
import { ConfirmModal } from "@/components/super-admin/masterdata/ConfirmModal";
import {
  INITIAL_PRODUCTS,
  tagToneClasses,
  type MasterProduct,
} from "@/components/super-admin/masterdata/masterDataData";
import { ProductRowMenu } from "@/components/super-admin/masterdata/ProductRowMenu";
import { RelocationConfirmModal } from "@/components/super-admin/masterdata/RelocationConfirmModal";
import { StockStatusModal } from "@/components/super-admin/masterdata/StockStatusModal";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";

type Tab = "Published" | "Out of Stock" | "Low Stock" | "Drafts";

function positionLabel(grid: number) {
  return `Row ${grid}`;
}

export default function MasterDataProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [tab, setTab] = useState<Tab>("Published");
  const [search, setSearch] = useState("");
  const [stockProduct, setStockProduct] = useState<MasterProduct | null>(null);
  const [visibilityTarget, setVisibilityTarget] = useState<MasterProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MasterProduct | null>(null);
  const [relocationTarget, setRelocationTarget] = useState<{ product: MasterProduct; newGrid: number } | null>(null);
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "Published" || tabParam === "Out of Stock" || tabParam === "Low Stock" || tabParam === "Drafts") {
      setTab(tabParam);
      window.history.replaceState(null, "", "/super-admin/master-data/products");
    }
  }, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesTab = tab === "Drafts" ? product.isDraft : product.status === tab && !product.isDraft;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [products, tab, search]);

  const filteredDrafts = useMemo(
    () => drafts.filter((draft) => draft.title.toLowerCase().includes(search.toLowerCase())),
    [drafts, search],
  );

  function handleDeleteDraft(id: string) {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
  }

  function toggleVisibility(product: MasterProduct) {
    setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, visible: !item.visible } : item)));
    setVisibilityTarget(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Products"
          subtitle="Add all the basic details of your new rice product"
          backHref="/super-admin/master-data"
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            {(["Published", "Out of Stock", "Low Stock", "Drafts"] as Tab[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTab(option)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === option ? "bg-[#F7931E] text-white" : "text-[#374151] hover:text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
              />
            </div>
            <Link
              href="/super-admin/master-data/products/new"
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Product
            </Link>
          </div>
        </div>

        {tab === "Drafts" ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDrafts.length === 0 && (
              <p className="col-span-full rounded-[28px] border-2 border-black/[0.04] bg-white py-10 text-center text-sm text-[#9CA3AF]">
                No drafts found.
              </p>
            )}
            {filteredDrafts.map((draft) => (
              <div key={draft.id} className="flex flex-col rounded-[28px] border-2 border-black/[0.04] bg-white p-5">
                <div className="flex items-start justify-between">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryPillClasses(draft.category)}`}>
                    {draft.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteDraft(draft.id)}
                    aria-label="Delete draft"
                    className="cursor-pointer text-[#9CA3AF] transition-colors hover:text-[#EF4444]"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                <h3 className="mt-3 text-base font-bold text-black">{draft.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#6B7280]">{draft.description}</p>

                <div className="mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                    {draft.savedAgo.includes("day") ? (
                      <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                    {draft.savedAgo}
                  </span>
                  {draft.resumeHref ? (
                    <Link
                      href={draft.resumeHref}
                      className="cursor-pointer whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                    >
                      Resume Edit
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2 text-xs font-bold text-white opacity-40">
                      Resume Edit
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="mt-5 flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="rounded-[28px] border-2 border-black/[0.04] bg-white py-10 text-center text-sm text-[#9CA3AF]">
              No products found.
            </p>
          )}
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-8 rounded-2xl border-2 border-black/[0.04] bg-white p-4"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]">
                <Image
                  src="/Warehouse/product.png"
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-[220px] flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-black">{product.name}</p>
                  {product.isDraft && (
                    <span className="rounded-md bg-[#F3F4F6] px-1.5 py-0.5 text-[10px] font-bold text-[#6B7280]">
                      DRAFT
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-[#9CA3AF]">{product.description}</p>
              </div>

              <div className="w-[110px] shrink-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Price</p>
                <p className="text-sm font-bold text-black">₹{product.price}/per KG</p>
              </div>

              <div className="w-[120px] shrink-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Product Tag</p>
                <span className={`mt-0.5 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tagToneClasses(product.tagTone)}`}>
                  {product.tag}
                </span>
              </div>

              <div className="w-[130px] shrink-0">
                <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Storefront Grid</p>
                <GridSelect
                  value={product.storefrontGrid}
                  onChange={(grid) => setRelocationTarget({ product, newGrid: grid })}
                />
              </div>

              <div className="shrink-0 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Visibility</p>
                <button
                  type="button"
                  onClick={() => setVisibilityTarget(product)}
                  className={`relative mt-1 flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                    product.visible ? "bg-[#F7931E]" : "bg-[#E5E7EB]"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      product.visible ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <ProductRowMenu
                onStockStatus={() => setStockProduct(product)}
                onEditDetails={() => {}}
                onDelete={() => setDeleteTarget(product)}
              />
            </div>
          ))}
        </div>
        )}
      </main>

      <StockStatusModal product={stockProduct} open={stockProduct !== null} onClose={() => setStockProduct(null)} />

      <ConfirmModal
        open={visibilityTarget !== null}
        onClose={() => setVisibilityTarget(null)}
        icon={visibilityTarget?.visible ? EyeOff : Eye}
        iconBg={visibilityTarget?.visible ? "bg-[#FEF3E2]" : "bg-[#FEF3E2]"}
        iconColor="text-[#F7931E]"
        title={visibilityTarget?.visible ? "Hide Product from Storefront?" : "Publish Product to Storefront?"}
        description={
          visibilityTarget?.visible
            ? `Unpublishing '${visibilityTarget?.name}' will remove it immediately from the public website grid. Customers will not be able to order this item until re-enabled.`
            : `Publishing '${visibilityTarget?.name}' will make it immediately visible on the public website grid. Customers will be able to order this item once again.`
        }
        noteIcon={visibilityTarget?.visible ? EyeOff : Eye}
        noteText={
          visibilityTarget
            ? `Storefront Grid Slot 'Row ${visibilityTarget.storefrontGrid}' will ${visibilityTarget.visible ? "show as empty" : "be restored"}.`
            : undefined
        }
        cancelLabel={visibilityTarget?.visible ? "Keep Live" : "Keep Hidden"}
        onCancel={() => setVisibilityTarget(null)}
        confirmLabel={visibilityTarget?.visible ? "Unpublish Product" : "Publish Product"}
        onConfirm={() => visibilityTarget && toggleVisibility(visibilityTarget)}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        icon={Trash2}
        iconBg="bg-[#FEF2F2]"
        iconColor="text-[#EF4444]"
        title="Delete this product?"
        description={`This will permanently remove '${deleteTarget?.name}' from your catalog. This action cannot be undone.`}
        cancelLabel="Cancel"
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete Product"
        onConfirm={handleDelete}
      />

      <RelocationConfirmModal
        open={relocationTarget !== null}
        onClose={() => setRelocationTarget(null)}
        productName={relocationTarget?.product.name ?? ""}
        fromLabel={relocationTarget ? positionLabel(relocationTarget.product.storefrontGrid) : ""}
        toLabel={relocationTarget ? positionLabel(relocationTarget.newGrid) : ""}
        onConfirm={() => {
          if (!relocationTarget) return;
          const { product, newGrid } = relocationTarget;
          setProducts((prev) =>
            prev.map((item) => (item.id === product.id ? { ...item, storefrontGrid: newGrid } : item)),
          );
          setRelocationTarget(null);
        }}
      />
    </div>
  );
}

function GridSelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative mt-0.5" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[33px] w-14 cursor-pointer items-center justify-between rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] px-2.5 text-sm font-semibold text-[#1D1D1F] outline-none focus:border-[#F7931E]"
      >
        {value}
        <ChevronDown className="h-3 w-3 shrink-0 text-[#6B7280]" strokeWidth={2.5} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1.5 w-[100px] overflow-hidden rounded-xl border border-[#F3F4F6] bg-white py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
          {Array.from({ length: 6 }).map((_, index) => {
            const option = index + 1;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${
                  option === value ? "font-semibold text-[#F7931E]" : "text-[#374151]"
                }`}
              >
                {option}
                {option === value && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
