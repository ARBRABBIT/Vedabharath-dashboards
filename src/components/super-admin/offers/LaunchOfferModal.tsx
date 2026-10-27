"use client";

import { ArrowLeft, Check, ChevronDown, Percent, Search, Ticket } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { PRODUCTS } from "@/components/super-admin/products/productsData";

type OfferType = "percentage" | "coupon";
type ApplyTarget = "all" | "limited";
type Step = "form" | "selectProducts" | "selectUsers" | "success";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const CUSTOMERS = [
  { id: "CUS-1089", name: "Suresh Kumar", mobile: "+91 90123 45678", orders: 3 },
  { id: "CUS-1045", name: "Priya Reddy", mobile: "+91 99887 76655", orders: 5 },
  { id: "CUS-1090", name: "Arjun Nair", mobile: "+91 90123 45699", orders: 2 },
  { id: "CUS-1122", name: "Anjali Patel", mobile: "+91 91234 56789", orders: 8 },
  { id: "CUS-1156", name: "Vikram Singh", mobile: "+91 93012 34567", orders: 4 },
  { id: "CUS-1180", name: "Neha Agarwal", mobile: "+91 98701 23456", orders: 3 },
];

const SAMPLE_PRODUCTS = PRODUCTS.slice(0, 6).map((product) => ({
  sku: product.sku,
  name: `${product.name} ${product.variants[product.variants.length - 1]}`,
  variant: product.variants[product.variants.length - 1],
  price: product.price,
}));

type LaunchOfferModalProps = {
  open: boolean;
  onClose: () => void;
  defaultOfferType?: OfferType;
};

export function LaunchOfferModal({ open, onClose, defaultOfferType = "percentage" }: LaunchOfferModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [offerType, setOfferType] = useState<OfferType>(defaultOfferType);
  const [applyTarget, setApplyTarget] = useState<ApplyTarget>("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscountValue, setMaxDiscountValue] = useState("");
  const [coupon, setCoupon] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function reset() {
    setStep("form");
    setOfferType(defaultOfferType);
    setApplyTarget("all");
    setSelectedProducts([]);
    setSelectedCustomers([]);
    setProductSearch("");
    setCustomerSearch("");
    setDiscountValue("");
    setMinOrderValue("");
    setMaxDiscountValue("");
    setCoupon("");
    setStartDate("");
    setEndDate("");
    setErrors({});
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleLaunch() {
    const nextErrors: Record<string, boolean> = {};
    if (offerType === "percentage") {
      if (!discountValue.trim()) nextErrors.discountValue = true;
      if (!maxDiscountValue.trim()) nextErrors.maxDiscountValue = true;
    } else {
      if (!coupon) nextErrors.coupon = true;
    }
    if (!startDate) nextErrors.startDate = true;
    if (!endDate) nextErrors.endDate = true;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep("success");
  }

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()),
  );
  const filteredCustomers = CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.mobile.includes(customerSearch),
  );

  if (step === "selectProducts") {
    return (
      <ModalShell open={open} onClose={handleClose} maxWidth="max-w-[680px]">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#374151] hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Back
            </button>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-[#E5E7EB] py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
            />
          </div>

          <div className="mt-4 flex max-h-[360px] flex-col gap-1 overflow-y-auto">
            {filteredProducts.map((product) => {
              const checked = selectedProducts.includes(product.sku);
              return (
                <button
                  key={product.sku}
                  type="button"
                  onClick={() =>
                    setSelectedProducts((prev) =>
                      checked ? prev.filter((sku) => sku !== product.sku) : [...prev, product.sku],
                    )
                  }
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-[#F9FAFB]"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                      checked ? "border-[#F7931E] bg-[#F7931E]" : "border-[#D1D5DB]"
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#F5F5F7]">
                    <Image
                      src="/Warehouse/product.png"
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-black">{product.name}</p>
                    <p className="text-xs text-[#9CA3AF]">SKU: {product.sku}</p>
                  </div>
                  <div className="shrink-0 text-right text-sm text-[#6B7280]">
                    <p>{product.variant}</p>
                    <p className="font-semibold text-black">₹{product.price}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-4">
            <p className="text-sm text-[#374151]">
              <span className="font-semibold text-black">{selectedProducts.length} Selected</span>{" "}
              <button
                type="button"
                onClick={() => setSelectedProducts([])}
                className="cursor-pointer text-[#9CA3AF] hover:text-black"
              >
                Clear All
              </button>
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </ModalShell>
    );
  }

  if (step === "selectUsers") {
    return (
      <ModalShell open={open} onClose={handleClose} maxWidth="max-w-[720px]">
        <div className="p-6">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#374151] hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back
          </button>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              placeholder="Search By Number"
              className="w-full rounded-full border border-[#E5E7EB] py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
            />
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[460px]">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  <th className="w-8 py-2" />
                  <th className="py-2">Customer Name</th>
                  <th className="py-2">Customer ID</th>
                  <th className="py-2">Mobile Number</th>
                  <th className="py-2 text-right">Orders</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const checked = selectedCustomers.includes(customer.id);
                  return (
                    <tr
                      key={customer.id}
                      onClick={() =>
                        setSelectedCustomers((prev) =>
                          checked ? prev.filter((id) => id !== customer.id) : [...prev, customer.id],
                        )
                      }
                      className="cursor-pointer border-t border-[#F3F4F6] hover:bg-[#F9FAFB]"
                    >
                      <td className="py-2.5">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${
                            checked ? "border-[#F7931E] bg-[#F7931E]" : "border-[#D1D5DB]"
                          }`}
                        >
                          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-[11px] font-semibold text-white">
                            {initials(customer.name)}
                          </div>
                          <span className="text-sm font-medium text-black">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-sm text-[#6B7280]">{customer.id}</td>
                      <td className="py-2.5 text-sm text-[#6B7280]">{customer.mobile}</td>
                      <td className="py-2.5 text-right text-sm text-black">{customer.orders} Orders</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-4">
            <p className="text-sm text-[#374151]">
              <span className="font-semibold text-black">{selectedCustomers.length} Selected</span>{" "}
              <button
                type="button"
                onClick={() => setSelectedCustomers([])}
                className="cursor-pointer text-[#9CA3AF] hover:text-black"
              >
                Clear All
              </button>
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </ModalShell>
    );
  }

  if (step === "success") {
    return (
      <ModalShell open={open} onClose={handleClose} maxWidth="max-w-[420px]">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]">
            <Check className="h-7 w-7 text-[#22C55E]" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Offer Launched Successfully!</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">
              Your {offerType === "coupon" ? "coupon code" : "percentage discount"} offer is now live and
              ready for {applyTarget === "all" ? (offerType === "coupon" ? "all users" : "all products") : "the selected " + (offerType === "coupon" ? "users" : "products")}.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell open={open} onClose={handleClose} maxWidth="max-w-[560px]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black">Launch Offer</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Create a discount or coupon offer and apply it to products.</p>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Offer Type</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOfferType("percentage")}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
              offerType === "percentage" ? "border-[#22C55E] bg-[#F0FDF4]" : "border-[#F3F4F6] bg-white"
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white">
              <Percent className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-black">Percentage Discount</span>
              <span className="block text-xs text-[#9CA3AF]">Offer discount in percentage</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setOfferType("coupon")}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
              offerType === "coupon" ? "border-[#22C55E] bg-[#F0FDF4]" : "border-[#F3F4F6] bg-white"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                offerType === "coupon" ? "bg-[#22C55E] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
              }`}
            >
              <Ticket className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-black">Coupon Code</span>
              <span className="block text-xs text-[#9CA3AF]">Offer discount using coupon code</span>
            </span>
          </button>
        </div>

        {offerType === "percentage" ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#374151]">Discount Value</label>
              <div className="relative mt-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={discountValue}
                  onChange={(event) => {
                    const val = event.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                    setDiscountValue(val);
                  }}
                  placeholder="e.g. 20"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-[#F7931E] ${
                    errors.discountValue ? "border-[#EF4444]" : "border-[#E5E7EB]"
                  }`}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">
                  %
                </span>
              </div>
              {errors.discountValue && <p className="mt-1 text-xs text-[#EF4444]">Discount value is required.</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-[#374151]">Minimum Order Value (Optional)</label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(event) => setMinOrderValue(event.target.value)}
                placeholder="e.g. 500"
                className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-[#374151]">Maximum Discount Value</label>
              <input
                type="text"
                value={maxDiscountValue}
                onChange={(event) => setMaxDiscountValue(event.target.value)}
                placeholder="e.g. ₹ 200"
                className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-[#F7931E] ${
                  errors.maxDiscountValue ? "border-[#EF4444]" : "border-[#E5E7EB]"
                }`}
              />
              {errors.maxDiscountValue && (
                <p className="mt-1 text-xs text-[#EF4444]">Maximum discount value is required.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#374151]">Coupon</label>
              <select
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                className={`mt-1.5 w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-[#F7931E] ${
                  errors.coupon ? "border-[#EF4444]" : "border-[#E5E7EB]"
                }`}
              >
                <option value="">Select a coupon</option>
                <option value="FEV243">FEV243</option>
                <option value="SAVE10">SAVE10</option>
                <option value="WELCOME5">WELCOME5</option>
              </select>
              {errors.coupon && <p className="mt-1 text-xs text-[#EF4444]">Please select a coupon.</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-[#374151]">Minimum Order Value (Optional)</label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(event) => setMinOrderValue(event.target.value)}
                placeholder="e.g. 500"
                className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
              />
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Start Date</label>
            <div className="relative mt-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className={`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E] ${
                  errors.startDate ? "border-[#EF4444]" : "border-[#E5E7EB]"
                }`}
              />
            </div>
            {errors.startDate && <p className="mt-1 text-xs text-[#EF4444]">Start date is required.</p>}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">End Date</label>
            <div className="relative mt-1.5">
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className={`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E] ${
                  errors.endDate ? "border-[#EF4444]" : "border-[#E5E7EB]"
                }`}
              />
            </div>
            {errors.endDate && <p className="mt-1 text-xs text-[#EF4444]">End date is required.</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Apply Offers To
          </label>
          <div className="relative mt-1.5">
            <select
              value={applyTarget}
              onChange={(event) => setApplyTarget(event.target.value as ApplyTarget)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]"
            >
              <option value="all">All {offerType === "coupon" ? "Users" : "Products"}</option>
              <option value="limited">{offerType === "coupon" ? "Users" : "Limited Products"}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          </div>

          {applyTarget === "limited" && (
            <button
              type="button"
              onClick={() => setStep(offerType === "coupon" ? "selectUsers" : "selectProducts")}
              className="mt-2 cursor-pointer text-sm font-semibold text-[#F7931E] hover:text-[#e07f0e]"
            >
              {offerType === "coupon"
                ? selectedCustomers.length > 0
                  ? `${selectedCustomers.length} users selected · Change`
                  : "Select Users"
                : selectedProducts.length > 0
                  ? `${selectedProducts.length} products selected · Change`
                  : "Select Products"}
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Launch Offer
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
