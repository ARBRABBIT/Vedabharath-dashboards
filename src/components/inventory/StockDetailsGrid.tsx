"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BAG_SIZES,
  INITIAL_PRODUCTS,
  STATUS_LABELS,
  stockPercent,
  stockStatus,
  type BagSize,
  type ProductStock,
  type StockStatus,
} from "./productStockData";
import { UpdateStockModal } from "./UpdateStockModal";

type StockDetailsGridProps = {
  search: string;
  statusFilter: StockStatus | "all";
  initialUpdateSku?: string | null;
};

const STATUS_STYLES: Record<StockStatus, { pill: string; bar: string; button: string }> = {
  out: {
    pill: "bg-[#FEE2E2] text-[#DC2626]",
    bar: "bg-[#E5E5E7]",
    button: "bg-[#3BB54A] text-white hover:bg-[#2f9d3d]",
  },
  low: {
    pill: "bg-[#FEF3E2] text-[#F7931E]",
    bar: "bg-[#F7931E]",
    button: "bg-[#F9A51A] text-white hover:bg-[#e6960f]",
  },
  in: {
    pill: "bg-[#EBF7EC] text-[#3BB54A]",
    bar: "bg-[#3BB54A]",
    button: "border border-[#BDCAB8] bg-white text-[#171D15] hover:bg-[#F5F5F7]",
  },
};

const CTA_LABEL: Record<StockStatus, string> = {
  out: "Update Now",
  low: "Update Stock",
  in: "Update Stock",
};

function ProductCard({ product, onUpdate }: { product: ProductStock; onUpdate: () => void }) {
  const status = stockStatus(product);
  const percent = stockPercent(product);
  const styles = STATUS_STYLES[status];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <Image
        src="/Warehouse/product.png"
        alt={product.name}
        width={200}
        height={240}
        className="mx-auto h-[220px] w-auto object-contain"
      />

      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-bold text-[#171D15]">{product.name}</span>
        <span
          className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.4px] ${styles.pill}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        {BAG_SIZES.map((size) => (
          <div key={size} className="flex flex-col gap-1 rounded-xl bg-[#F5F5F7] p-3">
            <dt className="text-xs font-semibold text-[#6E7B6A]">{size}kg</dt>
            <dd className="text-2xl font-bold text-[#171D15]">
              {product.bags[size].toLocaleString("en-IN")} <span className="text-sm font-medium text-[#86868B]">{product.bags[size] === 1 ? "bag" : "bags"}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between text-xs font-semibold text-[#86868B]">
        <span>Stock level</span>
        <span>{percent}%</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
        <div className={`h-full rounded-full ${styles.bar}`} style={{ width: `${percent}%` }} />
      </div>

      <button
        type="button"
        onClick={onUpdate}
        className={`w-full cursor-pointer rounded-xl py-2.5 text-sm font-bold transition-colors ${styles.button}`}
      >
        {CTA_LABEL[status]}
      </button>
    </div>
  );
}

export function StockDetailsGrid({ search, statusFilter, initialUpdateSku }: StockDetailsGridProps) {
  const [products, setProducts] = useState<ProductStock[]>(INITIAL_PRODUCTS);
  const [updateSku, setUpdateSku] = useState<string | null>(null);

  useEffect(() => {
    if (initialUpdateSku) setUpdateSku(initialUpdateSku);
  }, [initialUpdateSku]);

  const filtered = products.filter((product) => {
    const matchesSearch =
      search.trim() === "" || product.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || stockStatus(product) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleAdjust(sku: string, size: BagSize, delta: number) {
    setProducts((prev) =>
      prev.map((product) =>
        product.sku === sku && Number.isInteger(delta) && product.bags[size] + delta >= 0
          ? { ...product, bags: { ...product.bags, [size]: product.bags[size] + delta } }
          : product,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#86868B] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          No products match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.sku} product={product} onUpdate={() => setUpdateSku(product.sku)} />
          ))}
        </div>
      )}

      <UpdateStockModal
        products={products}
        initialSku={updateSku}
        open={updateSku !== null}
        onClose={() => setUpdateSku(null)}
        onAdjust={handleAdjust}
      />
    </div>
  );
}
