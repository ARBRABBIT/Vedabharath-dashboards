"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { PRODUCTS, type SuperAdminProduct } from "@/components/super-admin/products/productsData";
import { CUSTOMERS, INITIAL_HUBS, type Customer, type Hub } from "@/components/super-admin/users/usersData";

function WarehouseDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: Hub[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((h) => h.name === value);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border py-2.5 px-3.5 text-left text-xs transition ${
          open
            ? "border-[#F7931E] bg-white ring-2 ring-[#F7931E]/20"
            : "border-[#E5E7EB] bg-[#FAFAFA] hover:bg-white"
        }`}
      >
        {selected ? (
          <div className="min-w-0 pr-2">
            <span className="font-semibold text-[#1D1D1F] block truncate">{selected.name}</span>
            <span className="text-[11px] text-[#6E7B6A] block truncate">{selected.address}</span>
          </div>
        ) : (
          <span className="text-[#9CA3AF] font-normal">Select fulfillment warehouse...</span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8E8E93] transition-transform duration-200 ${
            open ? "rotate-180 text-[#F7931E]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 max-h-60 overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
          {options.map((hub) => {
            const isSelected = hub.name === value;
            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => {
                  onChange(hub.name);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                  isSelected
                    ? "bg-[#FFF8F0] text-[#F7931E]"
                    : "text-[#1D1D1F] hover:bg-[#F5F5F7]"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className={`font-semibold ${isSelected ? "text-[#F7931E]" : "text-[#1D1D1F]"}`}>
                    {hub.name}
                  </p>
                  <p className="text-[11px] text-[#6E7B6A] truncate">{hub.address}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-[#F7931E]" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductDropdown({
  value,
  onChange,
  products,
}: {
  value: string;
  onChange: (sku: string) => void;
  products: SuperAdminProduct[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = products.find((p) => p.sku === value) ?? products[0];

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex-1 min-w-[180px]" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-2.5 py-1.5 text-left text-xs font-medium transition ${
          open
            ? "border-[#F7931E] ring-1 ring-[#F7931E]"
            : "border-[#E5E7EB] hover:border-[#D1D5DB]"
        }`}
      >
        <span className="truncate text-[#1D1D1F]">
          {selected?.name} (Base ₹{selected?.price})
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#8E8E93] transition-transform ${
            open ? "rotate-180 text-[#F7931E]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
          {products.map((prod) => {
            const isSelected = prod.sku === value;
            return (
              <button
                key={prod.sku}
                type="button"
                onClick={() => {
                  onChange(prod.sku);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                  isSelected
                    ? "bg-[#FFF8F0] text-[#F7931E] font-semibold"
                    : "text-[#1D1D1F] hover:bg-[#F5F5F7]"
                }`}
              >
                <div>
                  <p className="font-semibold">{prod.name}</p>
                  <p className="text-[10px] text-[#8E8E93]">{prod.subtitle}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1D1D1F]">₹{prod.price}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[#F7931E]" strokeWidth={2.5} />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VariantDropdown({
  value,
  onChange,
  variants,
}: {
  value: string;
  onChange: (v: string) => void;
  variants: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-24 shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-2.5 py-1.5 text-left text-xs font-medium transition ${
          open
            ? "border-[#F7931E] ring-1 ring-[#F7931E]"
            : "border-[#E5E7EB] hover:border-[#D1D5DB]"
        }`}
      >
        <span className="text-[#1D1D1F] font-semibold">{value}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#8E8E93] transition-transform ${
            open ? "rotate-180 text-[#F7931E]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
          {variants.map((v) => {
            const isSelected = v === value;
            return (
              <button
                key={v}
                type="button"
                onClick={() => {
                  onChange(v);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                  isSelected
                    ? "bg-[#FFF8F0] text-[#F7931E] font-semibold"
                    : "text-[#1D1D1F] hover:bg-[#F5F5F7]"
                }`}
              >
                <span>{v}</span>
                {isSelected && <Check className="h-3 w-3 text-[#F7931E]" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type OrderItemEntry = {
  id: string;
  sku: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
};

type CreateOrderModalProps = {
  open: boolean;
  onClose: () => void;
  onOrderCreated?: (order: {
    orderId: string;
    customer: { name: string; email: string; phone: string; address: string };
    warehouse: string;
    items: OrderItemEntry[];
    total: number;
    paymentMethod: string;
  }) => void;
};

export function CreateOrderModal({ open, onClose, onOrderCreated }: CreateOrderModalProps) {
  // Mode: existing or new customer
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [isSelectingCustomer, setIsSelectingCustomer] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  // New customer form fields
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");

  // Selected warehouse
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("Prepaid (UPI)");

  // Order Items (starts empty)
  const [items, setItems] = useState<OrderItemEntry[]>([]);

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "success">("form");
  const [createdOrderSummary, setCreatedOrderSummary] = useState<{
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    warehouse: string;
    total: number;
  } | null>(null);

  // Reset form when modal opens: everything starts completely empty
  useEffect(() => {
    if (!open) return;
    setCustomerMode("existing");
    setIsSelectingCustomer(true);
    setCustomerSearch("");
    setSelectedCustomerId("");
    setNewCustomerName("");
    setNewCustomerEmail("");
    setNewCustomerPhone("");
    setNewCustomerAddress("");
    setSelectedWarehouse("");
    setPaymentMethod("Prepaid (UPI)");
    setItems([]);
    setErrorMessage(null);
    setStep("form");
    setCreatedOrderSummary(null);
  }, [open]);

  // Filtered existing customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return CUSTOMERS;
    const q = customerSearch.toLowerCase();
    return CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q),
    );
  }, [customerSearch]);

  const selectedCustomer = useMemo(
    () => CUSTOMERS.find((c) => c.id === selectedCustomerId) ?? null,
    [selectedCustomerId],
  );

  // Calculations
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );
  const deliveryFee = 0; // Free delivery
  const grandTotal = subtotal + deliveryFee;

  // Handlers for product items
  function handleProductChange(itemId: string, sku: string) {
    const prod = PRODUCTS.find((p) => p.sku === sku);
    if (!prod) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const variant = prod.variants[0] ?? "1kg";
        const price = variant === "5kg" ? Math.round(prod.price * 4.5) : prod.price;
        return {
          ...item,
          sku: prod.sku,
          name: prod.name,
          variant,
          price,
        };
      }),
    );
  }

  function handleVariantChange(itemId: string, variant: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const prod = PRODUCTS.find((p) => p.sku === item.sku);
        const basePrice = prod?.price ?? item.price;
        const price = variant === "5kg" ? Math.round(basePrice * 4.5) : basePrice;
        return { ...item, variant, price };
      }),
    );
  }

  function handleQtyChange(itemId: string, delta: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }),
    );
  }

  function handleAddItem() {
    const availableProd =
      PRODUCTS.find((p) => !items.some((it) => it.sku === p.sku)) ?? PRODUCTS[0];
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random()}`,
        sku: availableProd.sku,
        name: availableProd.name,
        variant: availableProd.variants[0] ?? "1kg",
        price: availableProd.price,
        qty: 1,
      },
    ]);
  }

  function handleRemoveItem(itemId: string) {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function handleCreateOrder() {
    setErrorMessage(null);

    // Validate customer
    let customerData = {
      name: "",
      email: "",
      phone: "",
      address: "",
    };

    if (customerMode === "existing") {
      if (!selectedCustomer) {
        setErrorMessage("Please select a valid customer.");
        return;
      }
      customerData = {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
      };
    } else {
      if (!newCustomerName.trim()) {
        setErrorMessage("Customer name is required.");
        return;
      }
      if (!newCustomerEmail.trim()) {
        setErrorMessage("Customer email is required.");
        return;
      }
      if (!newCustomerPhone.trim()) {
        setErrorMessage("Customer phone number is required.");
        return;
      }
      if (!newCustomerAddress.trim()) {
        setErrorMessage("Customer delivery address is required.");
        return;
      }
      customerData = {
        name: newCustomerName.trim(),
        email: newCustomerEmail.trim(),
        phone: newCustomerPhone.trim(),
        address: newCustomerAddress.trim(),
      };
    }

    // Validate warehouse
    if (!selectedWarehouse) {
      setErrorMessage("Please select a fulfillment warehouse.");
      return;
    }

    // Validate items
    if (items.length === 0) {
      setErrorMessage("Please select at least one product.");
      return;
    }

    const orderId = `VB-${Math.floor(8500 + Math.random() * 1000)}`;

    const summary = {
      orderId,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      customerAddress: customerData.address,
      warehouse: selectedWarehouse,
      total: grandTotal,
    };

    setCreatedOrderSummary(summary);
    setStep("success");

    if (onOrderCreated) {
      onOrderCreated({
        orderId,
        customer: customerData,
        warehouse: selectedWarehouse,
        items,
        total: grandTotal,
        paymentMethod,
      });
    }
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[740px]">
      {step === "success" && createdOrderSummary ? (
        <div className="flex flex-col items-center p-8 sm:p-10 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 16 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC] text-[#22C55E]"
          >
            <Check className="h-8 w-8 stroke-[2.5]" />
          </motion.div>

          <h2 className="mt-5 text-2xl font-bold text-[#1D1D1F]">Order Created Successfully!</h2>
          <p className="mt-1 text-sm text-[#6E7B6A]">
            The order has been placed and routed to the selected warehouse.
          </p>

          {/* Receipt card */}
          <div className="mt-6 w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-5 text-left text-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">Order ID</span>
              <span className="font-bold text-[#F7931E]">{createdOrderSummary.orderId}</span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-[#555]">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Customer:</span>
                <span className="font-semibold text-[#1D1D1F]">{createdOrderSummary.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Phone:</span>
                <span className="text-[#1D1D1F]">{createdOrderSummary.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Warehouse:</span>
                <span className="font-semibold text-[#1D1D1F]">{createdOrderSummary.warehouse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Total Amount:</span>
                <span className="text-base font-bold text-[#1D1D1F]">₹{createdOrderSummary.total.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-[#EAEAEA] text-[#71717A]">
                <span className="font-medium text-[#1D1D1F]">Shipping Address:</span>{" "}
                {createdOrderSummary.customerAddress}
              </div>
            </div>
          </div>

          <div className="mt-8 flex w-full max-w-md gap-3">
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setNewCustomerName("");
                setNewCustomerEmail("");
                setNewCustomerPhone("");
                setNewCustomerAddress("");
              }}
              className="flex-1 rounded-full border border-[#D1D5DB] py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#F3F4F6]"
            >
              Create Another Order
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full bg-[#F7931E] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E08217]"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col max-h-[86vh]">
          {/* Header */}
          <div className="border-b border-[#F0F0F2] px-7 py-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF6EE] text-[#F7931E]">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1D1D1F]">Create New Order</h2>
                <p className="text-xs text-[#8E8E93]">
                  Super Admin direct customer order placement & fulfillment dispatch
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-7 py-5 space-y-6">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Customer Selection */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6E7B6A]">
                  1. Customer Information <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  {customerMode === "existing" && selectedCustomer && !isSelectingCustomer && (
                    <button
                      type="button"
                      onClick={() => setIsSelectingCustomer(true)}
                      className="text-xs font-bold text-[#F7931E] hover:text-[#E08217] hover:underline transition cursor-pointer"
                    >
                      Change
                    </button>
                  )}
                  {customerMode === "existing" && isSelectingCustomer && selectedCustomer && (
                    <button
                      type="button"
                      onClick={() => setIsSelectingCustomer(false)}
                      className="text-xs font-medium text-[#8E8E93] hover:text-[#1D1D1F] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <div className="inline-flex rounded-full bg-[#F5F5F7] p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerMode("existing");
                        setIsSelectingCustomer(false);
                      }}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition ${
                        customerMode === "existing"
                          ? "bg-white text-[#1D1D1F] shadow-sm font-semibold"
                          : "text-[#8E8E93] hover:text-[#1D1D1F]"
                      }`}
                    >
                      <User className="h-3.5 w-3.5" />
                      Existing Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerMode("new")}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition ${
                        customerMode === "new"
                          ? "bg-white text-[#F7931E] shadow-sm font-semibold"
                          : "text-[#8E8E93] hover:text-[#1D1D1F]"
                      }`}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      + New Customer
                    </button>
                  </div>
                </div>
              </div>

              {customerMode === "existing" ? (
                isSelectingCustomer || !selectedCustomer ? (
                  /* Customer Search & Select list */
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search customer by name, email, or phone..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] py-2.5 pl-10 pr-4 text-xs text-[#1D1D1F] placeholder-[#9CA3AF] focus:border-[#F7931E] focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto rounded-xl border border-[#E5E7EB] p-2 bg-[#FAFAFA]">
                      {filteredCustomers.length === 0 ? (
                        <div className="p-4 text-center">
                          <p className="text-xs text-[#8E8E93]">No customer found with that query.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomerMode("new");
                              setNewCustomerName(customerSearch);
                            }}
                            className="mt-2 text-xs font-semibold text-[#F7931E] hover:underline"
                          >
                            + Create &ldquo;{customerSearch}&rdquo; as New Customer
                          </button>
                        </div>
                      ) : (
                        filteredCustomers.map((cust) => {
                          const isSelected = cust.id === selectedCustomerId;
                          return (
                            <div
                              key={cust.id}
                              onClick={() => {
                                setSelectedCustomerId(cust.id);
                                setIsSelectingCustomer(false);
                              }}
                              className={`flex cursor-pointer items-center justify-between rounded-lg p-2.5 transition text-xs ${
                                isSelected
                                  ? "bg-white border border-[#F7931E] shadow-sm ring-1 ring-[#F7931E]"
                                  : "hover:bg-white border border-transparent"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <p className="font-semibold text-[#1D1D1F] truncate">{cust.name}</p>
                                <p className="text-[11px] text-[#6E7B6A] truncate">
                                  {cust.phone} • {cust.email}
                                </p>
                              </div>
                              {isSelected ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F7931E]" />
                              ) : (
                                <span className="text-[11px] font-semibold text-[#F7931E]">Select</span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : (
                  /* Customer Info in Fields with Change text on the right */
                  <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                          Customer Name
                        </label>
                        <div className="relative flex items-center">
                          <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                          <input
                            type="text"
                            readOnly
                            value={selectedCustomer.name}
                            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2 pl-10 pr-3.5 text-xs font-medium text-[#1D1D1F] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                          Phone Number
                        </label>
                        <div className="relative flex items-center">
                          <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                          <input
                            type="text"
                            readOnly
                            value={selectedCustomer.phone}
                            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2 pl-10 pr-3.5 text-xs font-medium text-[#1D1D1F] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                        <input
                          type="text"
                          readOnly
                          value={selectedCustomer.email}
                          className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2 pl-10 pr-3.5 text-xs font-medium text-[#1D1D1F] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                        Primary Delivery Address
                      </label>
                      <div className="relative flex items-start">
                        <MapPin className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-[#F7931E]" />
                        <textarea
                          rows={2}
                          readOnly
                          value={selectedCustomer.address}
                          className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white py-2 pl-10 pr-3.5 text-xs font-medium leading-relaxed text-[#1D1D1F] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* New Customer Form */
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Ananya Deshmukh"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:border-[#F7931E] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g., +91 98450 12345"
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:border-[#F7931E] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g., ananya@example.com"
                      value={newCustomerEmail}
                      onChange={(e) => setNewCustomerEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:border-[#F7931E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Flat 402, Green Valley Apartments, Jubilee Hills, Hyderabad - 500033"
                      value={newCustomerAddress}
                      onChange={(e) => setNewCustomerAddress(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:border-[#F7931E] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Warehouse Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E7B6A] mb-2">
                2. Select Fulfillment Warehouse <span className="text-red-500">*</span>
              </label>
              <WarehouseDropdown
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
                options={INITIAL_HUBS}
              />
            </div>

            {/* 3. Product Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6E7B6A]">
                  3. Select Products & Quantity <span className="text-red-500">*</span>
                </label>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#F7931E] hover:text-[#E08217] transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Product
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D1D5DB] bg-[#FAFAFA] py-6 px-4 text-center">
                  <Package className="h-6 w-6 text-[#9CA3AF] mb-1.5" />
                  <p className="text-xs font-semibold text-[#1D1D1F]">No products selected</p>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5">
                    Click &ldquo;+ Add Product&rdquo; to add rice products to this order.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#F7931E] shadow-sm hover:border-[#F7931E] transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((item) => {
                    const currentProd = PRODUCTS.find((p) => p.sku === item.sku);
                    const availableVariants = currentProd?.variants ?? ["1kg", "5kg"];

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3 text-xs"
                      >
                        {/* Product Custom Dropdown */}
                        <ProductDropdown
                          value={item.sku}
                          onChange={(sku) => handleProductChange(item.id, sku)}
                          products={PRODUCTS}
                        />

                        {/* Variant Custom Dropdown */}
                        <VariantDropdown
                          value={item.variant}
                          onChange={(v) => handleVariantChange(item.id, v)}
                          variants={availableVariants}
                        />

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2 py-1">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, -1)}
                            disabled={item.qty <= 1}
                            className="p-0.5 text-[#8E8E93] hover:text-[#1D1D1F] disabled:opacity-40"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-[#1D1D1F]">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="p-0.5 text-[#8E8E93] hover:text-[#1D1D1F]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price subtotal */}
                        <div className="min-w-[70px] text-right font-semibold text-[#1D1D1F]">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Remove product"
                          className="p-1 text-[#9CA3AF] hover:text-red-500 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Order calculation summary box */}
              <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-[#6E7B6A]">
                  <span>Items Subtotal</span>
                  <span className="font-medium text-[#1D1D1F]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6E7B6A]">
                  <span>Fulfillment & Delivery</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#EAEAEA] text-sm font-bold text-[#1D1D1F]">
                  <span>Total Amount</span>
                  <span className="text-[#F7931E]">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 4. Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E7B6A] mb-2">
                4. Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {["Prepaid (UPI)", "Cash on Delivery (COD)", "Card / Net Banking"].map((method) => {
                  const isSelected = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl border py-2 px-3 text-left font-medium transition ${
                        isSelected
                          ? "border-[#F7931E] bg-[#FFF8F0] text-[#F7931E] font-semibold"
                          : "border-[#E5E7EB] bg-[#FAFAFA] text-[#6E7B6A] hover:bg-white"
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#F0F0F2] px-7 py-4 flex items-center justify-between bg-white">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#D1D5DB] px-5 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F3F4F6] transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateOrder}
              className="inline-flex items-center gap-2 rounded-full bg-[#F7931E] px-6 py-2.5 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(247,147,30,0.35)] hover:bg-[#E08217] active:scale-95 transition cursor-pointer"
            >
              <Package className="h-4 w-4" />
              <span>{grandTotal > 0 ? `Create Order • ₹${grandTotal.toLocaleString()}` : "Create Order"}</span>
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

