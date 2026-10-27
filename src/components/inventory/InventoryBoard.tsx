"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectDropdown, type SelectOption } from "@/components/ui/SelectDropdown";
import { STATUS_LABELS, type StockStatus } from "./productStockData";
import { StockDetailsGrid } from "./StockDetailsGrid";

const STATUS_OPTIONS: readonly SelectOption<StockStatus | "all">[] = [
  { value: "all", label: "All Statuses", tone: "neutral" },
  { value: "out", label: STATUS_LABELS.out, tone: "danger" },
  { value: "low", label: STATUS_LABELS.low, tone: "warning" },
  { value: "in", label: STATUS_LABELS.in, tone: "success" },
];

export function InventoryBoard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "all">("all");
  const [initialUpdateSku, setInitialUpdateSku] = useState<string | null>(null);

  // Deep links from the Dashboard (e.g. "View All" on Inventory Alerts, or a
  // "Stock Alert" notification) land here with ?status=&sku= so the
  // right filter/modal opens automatically.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get("status");
    const skuParam = params.get("sku");

    if (statusParam === "out" || statusParam === "low" || statusParam === "in") {
      setStatusFilter(statusParam);
    }
    if (skuParam) setInitialUpdateSku(skuParam);
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-4 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[318px]">
          <Search
            className="pointer-events-none absolute left-[19px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#3E4A3C]"
            strokeWidth={2}
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Products..."
            className="w-full rounded-full border border-[#BDCAB8]/30 bg-white py-[14px] pl-11 pr-4 text-base text-[#3E4A3C] outline-none placeholder:text-[#3E4A3C]/50 focus:border-[#F9A51A]"
          />
        </div>

        <SelectDropdown
          label="Stock status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
        />
      </div>

      <StockDetailsGrid
        search={search}
        statusFilter={statusFilter}
        initialUpdateSku={initialUpdateSku}
      />
    </div>
  );
}
