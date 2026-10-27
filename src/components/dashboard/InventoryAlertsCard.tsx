import Image from "next/image";
import Link from "next/link";
import {
  INITIAL_PRODUCTS,
  stockStatus,
  stockQuantityKg,
  type ProductStock,
} from "@/components/inventory/productStockData";

const outOfStock = INITIAL_PRODUCTS.filter((product) => stockStatus(product) === "out");
const lowStock = INITIAL_PRODUCTS.filter((product) => stockStatus(product) === "low");

function AlertRow({ product, tone }: { product: ProductStock; tone: "out" | "low" }) {
  const isOut = tone === "out";
  return (
    <Link
      href={`/inventory?view=details&status=${tone}&sku=${product.sku}`}
      className={
        isOut
          ? "flex items-center justify-between rounded-xl bg-[#FEF2F2] p-2.5 transition-colors hover:bg-[#FDE3E3]"
          : "flex items-center justify-between gap-2.5 rounded-xl border border-[#F3F4F6] p-2.5 transition-colors hover:bg-[#FAFAFA]"
      }
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            isOut ? "bg-white" : "bg-[#FAFAFA]"
          }`}
        >
          <Image
            src="/Warehouse/product.png"
            alt=""
            width={40}
            height={40}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-[#111827]">{product.name}</p>
          <p className={`text-xs ${isOut ? "text-[#EF4444]" : "text-[#F97316]"}`}>
            {isOut ? "Out of stock" : `${stockQuantityKg(product)} kg Left`}
          </p>
        </div>
      </div>
      {isOut && (
        <span className="shrink-0 text-xs font-semibold text-[#EF4444]">
          {stockQuantityKg(product)} kg
        </span>
      )}
    </Link>
  );
}

export function InventoryAlertsCard() {
  return (
    <div className="flex-1 rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-black">Inventory Alerts</h3>
        <Link
          href="/inventory?view=details"
          className="cursor-pointer text-xs text-[#6B7280] transition-colors hover:text-[#111827]"
        >
          View All
        </Link>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
          <span className="text-sm font-medium text-[#111827]">Out of Stock ({outOfStock.length})</span>
        </div>

        {outOfStock.map((product) => (
          <AlertRow key={product.sku} product={product} tone="out" />
        ))}

        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F97316]" />
          <span className="text-sm font-medium text-[#111827]">Low Stock ({lowStock.length})</span>
        </div>

        {lowStock.map((product) => (
          <AlertRow key={product.sku} product={product} tone="low" />
        ))}
      </div>
    </div>
  );
}
