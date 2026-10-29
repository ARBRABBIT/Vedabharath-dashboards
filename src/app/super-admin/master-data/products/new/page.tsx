"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Droplet, Heart, Lightbulb, Plus, Search, ShieldCheck, Star, Tag, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { HealthBenefitsPickerModal } from "@/components/super-admin/masterdata/HealthBenefitsPickerModal";
import {
  HEALTH_BENEFIT_LIBRARY,
  INITIAL_TAGS,
  NUTRIENT_LIBRARY,
  TESTIMONIAL_LIBRARY,
} from "@/components/super-admin/masterdata/masterDataData";
import { NutrientsPickerModal } from "@/components/super-admin/masterdata/NutrientsPickerModal";
import { TestimonialsPickerModal } from "@/components/super-admin/masterdata/TestimonialsPickerModal";
import { PRODUCTS } from "@/components/super-admin/products/productsData";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { DatePicker } from "@/components/ui/DatePicker";

type WizardTab = "Basic Details" | "Cooking & benefits" | "Reviews & Offers";
type Variant = { id: string; qty: string; mrp: string; sellingPrice: string };
type NutritionRow = { id: string; name: string; value: string; unit: string };

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").toUpperCase();
}

const PREVIEW_BADGES = [
  { icon: Droplet, iconBg: "bg-[#EBF7EC]", iconColor: "text-[#22C55E]", label: "100% Natural" },
  { icon: ShieldCheck, iconBg: "bg-[#EFF6FF]", iconColor: "text-[#3B82F6]", label: "Antioxidants" },
  { icon: Heart, iconBg: "bg-[#FEF3E2]", iconColor: "text-[#F7931E]", label: "Diabetic Friendly" },
  { icon: ShieldCheck, iconBg: "bg-[#EBF7EC]", iconColor: "text-[#22C55E]", label: "High Fiber" },
];

function ProductTagDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (tag: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const baseTags = useMemo(() => {
    const list = [
      "Trending",
      "Best Seller",
      "Organic",
      "Healthy Choice",
      "Top Rated",
      "Premium",
      "Limited Edition",
      "Heritage Rice",
      "Lowest Ever",
      "Most Selling",
      ...INITIAL_TAGS.map((t) => t.name),
    ];
    return Array.from(new Set(list));
  }, []);

  const [customTags, setCustomTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const combined = [...baseTags, ...customTags];
    if (value && !combined.includes(value)) {
      combined.push(value);
    }
    return Array.from(new Set(combined));
  }, [baseTags, customTags, value]);

  const filteredTags = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allTags;
    return allTags.filter((t) => t.toLowerCase().includes(q));
  }, [allTags, search]);

  const canAddCustom =
    search.trim().length > 0 &&
    !allTags.some((t) => t.toLowerCase() === search.trim().toLowerCase());

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative mt-1.5" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-[42px] w-full cursor-pointer items-center justify-between rounded-xl border bg-white px-4 text-left text-sm transition ${
          open
            ? "border-[#F7931E] ring-2 ring-[#F7931E]/20"
            : "border-[#E5E7EB] hover:border-[#D1D5DB]"
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {value ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF8F0] px-2.5 py-1 text-xs font-semibold text-[#F7931E]">
              <Tag className="h-3 w-3" />
              {value}
            </span>
          ) : (
            <span className="text-[#9CA3AF]">Select product tag (e.g. Trending)</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8E8E93] transition-transform duration-200 ${
            open ? "rotate-180 text-[#F7931E]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 flex max-h-64 flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
          <div className="relative mb-2 shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search or type a new tag..."
              className="w-full rounded-xl bg-[#F5F5F7] py-2 pl-8 pr-3 text-xs outline-none placeholder:text-[#9CA3AF] focus:ring-1 focus:ring-[#F7931E]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
            {canAddCustom && (
              <button
                type="button"
                onClick={() => {
                  const newTag = search.trim();
                  setCustomTags((prev) => [...prev, newTag]);
                  onChange(newTag);
                  setSearch("");
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl bg-[#FFF8F0] px-3 py-2 text-left text-xs font-semibold text-[#F7931E] transition hover:bg-[#FEEFD9]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add &ldquo;{search.trim()}&rdquo; as new tag
              </button>
            )}

            {filteredTags.map((tag) => {
              const isSelected = value === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    onChange(isSelected ? "" : tag);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                    isSelected
                      ? "bg-[#FFF8F0] font-semibold text-[#F7931E]"
                      : "text-black hover:bg-[#F5F5F7]"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Tag className={`h-3 w-3 ${isSelected ? "text-[#F7931E]" : "text-[#9CA3AF]"}`} />
                    {tag}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[#F7931E]" strokeWidth={2.5} />}
                </button>
              );
            })}

            {filteredTags.length === 0 && !canAddCustom && (
              <p className="py-3 text-center text-xs text-[#9CA3AF]">No tags found</p>
            )}
          </div>

          {value && (
            <div className="mt-1 shrink-0 border-t border-[#F3F4F6] pt-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="w-full cursor-pointer py-1 text-center text-[11px] font-medium text-[#EF4444] transition hover:underline"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AddNewProductPage() {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"form" | "preview" | "success">("form");
  const [tab, setTab] = useState<WizardTab>("Basic Details");

  const [productName, setProductName] = useState("");
  const [productTag, setProductTag] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([
    { id: "v1", qty: "1 kg", mrp: "540", sellingPrice: "460" },
    { id: "v2", qty: "5 kg", mrp: "680", sellingPrice: "590" },
  ]);

  const [characteristics, setCharacteristics] = useState<string[]>([
    "Slender, fine grains",
    "Pearly white colour",
    "Naturally pleasant aroma",
    "Becomes soft and fluffy when cooked",
  ]);
  const [nutritionRows, setNutritionRows] = useState<NutritionRow[]>([]);
  const [cookingSteps, setCookingSteps] = useState(
    "1. Wash the rice 2-3 times.\n2. Add 2.5 cups of water for 1 cup of rice.\n3. Pressure cook for 3 whistles.",
  );
  const [hasMethod, setHasMethod] = useState(true);
  const [isEditingMethod, setIsEditingMethod] = useState(false);
  const [healthBenefitIds, setHealthBenefitIds] = useState<string[]>([]);

  const [testimonialIds, setTestimonialIds] = useState<string[]>([]);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerType, setOfferType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [editingSku, setEditingSku] = useState<string | null>(null);

  const [healthPickerOpen, setHealthPickerOpen] = useState(false);
  const [nutrientPickerOpen, setNutrientPickerOpen] = useState(false);
  const [testimonialPickerOpen, setTestimonialPickerOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editSku = params.get("edit");
    if (!editSku) return;
    const product = PRODUCTS.find((item) => item.sku === editSku);
    if (!product) return;
    setEditingSku(product.sku);
    setProductName(product.name);
    setShortDescription(product.subtitle);
    setFullDescription(product.description);
    setVariants(
      product.variants.map((qty, index) => ({
        id: `v${index + 1}`,
        qty,
        mrp: String(product.price),
        sellingPrice: String(product.price),
      })),
    );
  }, []);

  const selectedHealthBenefits = HEALTH_BENEFIT_LIBRARY.filter((item) => healthBenefitIds.includes(item.id));
  const selectedTestimonials = TESTIMONIAL_LIBRARY.filter((item) => testimonialIds.includes(item.id));

  function handleImageSelect(files: FileList | null) {
    if (!files) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
  }

  function addVariant() {
    setVariants((prev) => [...prev, { id: `v${prev.length + 1}-${Date.now()}`, qty: "", mrp: "", sellingPrice: "" }]);
  }

  function addCharacteristic() {
    setCharacteristics((prev) => [...prev, ""]);
  }

  function applyNutrients(ids: string[]) {
    const rows = ids.map((id) => {
      const lib = NUTRIENT_LIBRARY.find((item) => item.id === id)!;
      const existing = nutritionRows.find((row) => row.id === id);
      return existing ?? { id, name: lib.name, value: "0", unit: lib.unit.replace(/[()]/g, "") };
    });
    setNutritionRows(rows);
  }

  const TABS: WizardTab[] = ["Basic Details", "Cooking & benefits", "Reviews & Offers"];

  if (step === "preview" || step === "success") {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
        <SuperAdminNavbar />

        <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setStep("form")}
              aria-label="Back"
              className="mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-6 w-6" strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-[28px] font-bold text-black">Preview Before Publishing</h1>
              <p className="mt-1 text-sm text-[#6B7280]">Review all product information before making it live on the website.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="sm:w-[260px] sm:shrink-0">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-[#F5F5F7]">
                    {images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Image src="/Warehouse/product.png" alt="" width={260} height={260} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg bg-[#F5F5F7]">
                        {images[index] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={images[index]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Image src="/Warehouse/product.png" alt="" width={80} height={80} className="h-full w-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-black">{productName || "Navara Rice"}</h2>
                    {productTag && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8F0] px-2.5 py-0.5 text-xs font-semibold text-[#F7931E]">
                        <Tag className="h-3 w-3" />
                        {productTag}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-[#F7931E] text-[#F7931E]" strokeWidth={0} />
                    ))}
                    4.8 (126 reviews)
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-bold text-black">₹{variants[0]?.sellingPrice || "299"}</span>
                    <span className="text-sm text-[#9CA3AF]">/ kg</span>
                    <span className="rounded-full bg-[#EBF7EC] px-2.5 py-1 text-xs font-bold text-[#22C55E]">In Stock</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
                    {fullDescription || "Navara Rice is a premium red rice variety known for its rich nutrition, unique taste and traditional heritage. Grown naturally without chemicals, it's perfect for a healthy lifestyle."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {PREVIEW_BADGES.map((badge) => (
                      <div key={badge.label} className="flex w-16 flex-col items-center gap-1.5 text-center">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${badge.iconBg}`}>
                          <badge.icon className={`h-4 w-4 ${badge.iconColor}`} strokeWidth={2} />
                        </span>
                        <p className="text-[10px] font-bold uppercase leading-tight text-[#6B7280]">{badge.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-lg font-bold text-black">Variants &amp; Inventory</h3>
              <div className="mt-3 flex flex-col gap-2">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3">
                    <div>
                      <p className="text-sm font-semibold text-black">{variant.qty} Pack</p>
                      <p className="text-xs text-[#9CA3AF]">₹{variant.sellingPrice} per unit</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#22C55E]">{index === 0 ? 24 : 8} Units</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">In Stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-lg font-bold text-black">Characteristics</h3>
              <div className="mt-3 flex flex-col gap-2">
                {characteristics.filter(Boolean).map((item, index) => (
                  <p key={index} className="flex items-start gap-2 text-sm text-[#374151]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" strokeWidth={2.5} />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-lg font-bold text-black">Nutritional Value (Per 100 g)</h3>
              <div className="mt-3 flex flex-col divide-y divide-[#F3F4F6]">
                {nutritionRows.map((row) => (
                  <div key={row.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-[#6B7280]">{row.name}</span>
                    <span className="font-semibold text-black">
                      {row.value} {row.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-lg font-bold text-black">Key Health Benefits</h3>
              <div className="mt-3 flex flex-col gap-3">
                {selectedHealthBenefits.map((item) => (
                  <p key={item.id} className="text-sm text-[#6B7280]">
                    {item.description}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">Featured Reviews</h3>
                {selectedTestimonials.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Scroll reviews left"
                      onClick={() => reviewsScrollRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      aria-label="Scroll reviews right"
                      onClick={() => reviewsScrollRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
              {selectedTestimonials.length > 0 ? (
                <div ref={reviewsScrollRef} className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto scroll-smooth">
                  {selectedTestimonials.map((review) => (
                    <div key={review.id} className="w-[240px] shrink-0 rounded-2xl bg-[#F9FAFB] p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-xs font-semibold text-white">
                          {initials(review.name)}
                        </div>
                        <p className="text-sm font-semibold text-black">{review.name}</p>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">&quot;{review.text}&quot;</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-[#9CA3AF]">No testimonials selected yet.</p>
              )}
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-lg font-bold text-black">Cooking Instructions</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#374151]">{cookingSteps}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-6">
            <button
              type="button"
              onClick={() => router.push("/super-admin/master-data/products?tab=Drafts")}
              className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => setStep("success")}
              className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Publish Product
            </button>
          </div>
        </main>

        {step === "success" && (
          <SuccessOverlay
            productName={productName || "Navara Rice"}
            price={variants[0]?.sellingPrice || "299"}
            imageUrl={images[0]}
            onDone={() => router.push("/super-admin/master-data/products")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title={editingSku ? "Edit Product Details" : "Add New Product"}
          subtitle="Add all the basic details of your new rice product"
          backHref={editingSku ? `/super-admin/products/${editingSku}` : "/super-admin/master-data/products"}
        />

        <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          {TABS.map((option) => (
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

        {tab === "Basic Details" && (
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
                <h2 className="text-xl font-bold text-black">Product Information</h2>
                <span className="text-sm text-[#9CA3AF]">Section 1 of 3</span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-black">Product Name *</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    placeholder="e.g. Organic Ashwagandha Powder"
                    className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-black">Product Tag</label>
                  <ProductTagDropdown value={productTag} onChange={setProductTag} />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-black">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  placeholder="Brief tagline for the product list..."
                  className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-black">Full Description</label>
                <textarea
                  value={fullDescription}
                  onChange={(event) => setFullDescription(event.target.value)}
                  placeholder="Describe the health benefits, origin, and detailed usage..."
                  rows={5}
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-black">Product Images</label>
                <div className="mt-1.5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex h-[120px] w-[120px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#E5E7EB] text-[#9CA3AF] hover:border-[#F7931E]"
                  >
                    <Upload className="h-5 w-5" strokeWidth={1.5} />
                    <span className="text-xs font-medium">Upload images</span>
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => handleImageSelect(event.target.files)}
                  />
                  {images.map((url, index) => (
                    <div key={index} className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                        className="absolute right-1.5 top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow"
                      >
                        <X className="h-3 w-3" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#9CA3AF]">Recommended size: 1200 x 1200px. Maximum 6 images.</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-black">Variants &amp; Pricing</h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#EBF7EC] px-3 py-1.5 text-xs font-bold text-[#22C55E] hover:opacity-80"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Add Variant
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#9CA3AF]">Add different quantities and pricing.</p>

                <div className="mt-3 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  <span>Variant (Qty)</span>
                  <span>M.R.P (₹)</span>
                  <span>Selling Price (₹)</span>
                  <span />
                </div>
                {variants.map((variant) => (
                  <div key={variant.id} className="mt-2 grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2">
                    <input
                      type="text"
                      value={variant.qty}
                      onChange={(event) => setVariants((prev) => prev.map((v) => (v.id === variant.id ? { ...v, qty: event.target.value } : v)))}
                      className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]"
                    />
                    <input
                      type="text"
                      value={variant.mrp}
                      onChange={(event) => setVariants((prev) => prev.map((v) => (v.id === variant.id ? { ...v, mrp: event.target.value } : v)))}
                      className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]"
                    />
                    <input
                      type="text"
                      value={variant.sellingPrice}
                      onChange={(event) => setVariants((prev) => prev.map((v) => (v.id === variant.id ? { ...v, sellingPrice: event.target.value } : v)))}
                      className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]"
                    />
                    <button
                      type="button"
                      onClick={() => setVariants((prev) => prev.filter((v) => v.id !== variant.id))}
                      className="cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-[28px] bg-[#F9FAFB] p-6">
                <p className="flex items-center gap-2 text-sm font-bold text-[#22C55E]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EBF7EC]">
                    <Lightbulb className="h-3.5 w-3.5 text-[#22C55E]" strokeWidth={2} />
                  </span>
                  Variant Guidelines
                </p>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-[#374151]">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#374151]" strokeWidth={2} />
                    Ensure variant names describe weight or size clearly.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#374151]" strokeWidth={2} />
                    Prices should include all applicable taxes.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#374151]" strokeWidth={2} />
                    Quantities below 10 will trigger a low-stock alert.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "Cooking & benefits" && (
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
                <h3 className="text-xl font-bold text-black">1. Characteristics</h3>
                <span className="text-sm text-[#9CA3AF]">Section 2 of 3</span>
              </div>
              <p className="mt-3 text-sm text-[#6B7280]">List the key characteristics or qualities of this rice.</p>
              <div className="mt-4 flex flex-col gap-2.5">
                {characteristics.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(event) =>
                        setCharacteristics((prev) => prev.map((c, i) => (i === index ? event.target.value : c)))
                      }
                      className="flex-1 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
                    />
                    <button
                      type="button"
                      onClick={() => setCharacteristics((prev) => prev.filter((_, i) => i !== index))}
                      className="cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCharacteristic}
                  className="mt-1 cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]"
                >
                  + Add another characteristic
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-xl font-bold text-black">2. Nutritional Value (Per 100 g)</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Add the nutritional value of this rice.</p>

              {nutritionRows.length > 0 && (
                <div className="mt-4 grid grid-cols-[1.2fr_0.8fr_0.8fr_auto] gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  <span>Nutrient</span>
                  <span>Value</span>
                  <span>Mes</span>
                  <span>Action</span>
                </div>
              )}
              {nutritionRows.map((row) => (
                <div key={row.id} className="mt-2 grid grid-cols-[1.2fr_0.8fr_0.8fr_auto] items-center gap-2">
                  <input
                    type="text"
                    value={row.name}
                    readOnly
                    className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-black outline-none"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(event) => setNutritionRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, value: event.target.value } : r)))}
                    className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]"
                  />
                  <input
                    type="text"
                    value={row.unit}
                    onChange={(event) => setNutritionRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, unit: event.target.value } : r)))}
                    className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]"
                  />
                  <button
                    type="button"
                    onClick={() => setNutritionRows((prev) => prev.filter((r) => r.id !== row.id))}
                    className="cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setNutrientPickerOpen(true)}
                className="mt-4 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]"
              >
                + Add Another Nutrient
              </button>
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-xl font-bold text-black">4. Cooking Instructions</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Detailed steps on how to cook the rice perfectly.</p>

              {hasMethod ? (
                <div className="mt-4 rounded-2xl bg-[#F9FAFB] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-black">Traditional Pressure Cooker</p>
                    <button
                      type="button"
                      onClick={() => {
                        setHasMethod(false);
                        setIsEditingMethod(false);
                      }}
                      className="cursor-pointer text-xs font-bold text-[#EF4444] hover:opacity-80"
                    >
                      REMOVE METHOD
                    </button>
                  </div>

                  {isEditingMethod ? (
                    <textarea
                      value={cookingSteps}
                      onChange={(event) => setCookingSteps(event.target.value)}
                      rows={4}
                      autoFocus
                      onBlur={() => setIsEditingMethod(false)}
                      className="mt-3 w-full resize-none rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#374151] outline-none focus:border-[#F7931E]"
                    />
                  ) : (
                    <p className="mt-3 whitespace-pre-line rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm leading-relaxed text-[#374151]">
                      {cookingSteps}
                    </p>
                  )}

                  {!isEditingMethod && (
                    <button
                      type="button"
                      onClick={() => setIsEditingMethod(true)}
                      className="mt-3 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]"
                    >
                      Edit Cooking Method
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setHasMethod(true)}
                  className="mt-4 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]"
                >
                  + Add Cooking Method
                </button>
              )}
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <h3 className="text-xl font-bold text-black">3. Key Health Benefits</h3>
              <p className="mt-1 text-sm text-[#6B7280]">What makes this rice healthy for consumers?</p>

              <div className="mt-4 flex flex-col gap-2.5">
                {selectedHealthBenefits.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-2 rounded-xl border border-[#E5E7EB] px-4 py-3">
                    <p className="text-sm text-[#374151]">{item.description}</p>
                    <button
                      type="button"
                      onClick={() => setHealthBenefitIds((prev) => prev.filter((id) => id !== item.id))}
                      className="shrink-0 cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setHealthPickerOpen(true)}
                className="mt-4 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]"
              >
                + Add more health benefits
              </button>
            </div>
          </div>
        )}

        {tab === "Reviews & Offers" && (
          <div className="mt-5 flex flex-col gap-6">
            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
                <div>
                  <h3 className="text-xl font-bold text-black">Customer Testimonials</h3>
                  <p className="mt-1 text-sm text-[#6B7280]">Add real customer reviews and build trust.</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#9CA3AF]">Section 3 of 3</span>
                  <button
                    type="button"
                    onClick={() => setTestimonialPickerOpen(true)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#EBF7EC] px-4 py-2 text-sm font-bold text-[#22C55E] hover:opacity-80"
                  >
                    Add Testimonial
                    <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {selectedTestimonials.length > 0 && (
                <div className="mt-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  <span className="w-[220px] text-center">Customer</span>
                  <span className="w-[260px] text-center">Testimonial</span>
                  <span className="w-[160px] text-center">Rating</span>
                  <span className="w-[160px] text-center">Action</span>
                </div>
              )}
              <div className="mt-2 flex flex-col gap-3">
                {selectedTestimonials.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-black/[0.08] p-4">
                    <div className="flex w-[220px] shrink-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-xs font-semibold text-[#22C55E]">
                        {initials(item.name)}
                      </div>
                      <span className="text-sm font-semibold text-black">{item.name}</span>
                    </div>
                    <div className="flex w-[260px] shrink-0 items-center">
                      <p className="line-clamp-3 text-sm text-[#6B7280]">{item.text}</p>
                    </div>
                    <span className="flex w-[160px] shrink-0 items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className={`h-3.5 w-3.5 ${index < Math.round(item.rating) ? "fill-[#F7931E] text-[#F7931E]" : "text-[#E5E7EB]"}`} strokeWidth={0} />
                      ))}
                    </span>
                    <div className="flex w-[160px] shrink-0 items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setTestimonialIds((prev) => prev.filter((id) => id !== item.id))}
                        className="cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border-2 border-black/[0.04] bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black">Offers &amp; Discounts</h3>
                  <p className="mt-1 text-sm text-[#6B7280]">Create offers or discounts for this product.</p>
                </div>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#EBF7EC] px-4 py-2 text-sm font-bold text-[#22C55E] hover:opacity-80"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  Add Offer
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Offer Title *</label>
                    <input
                      type="text"
                      value={offerTitle}
                      onChange={(event) => setOfferTitle(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Offer Type *</label>
                    <select
                      value={offerType}
                      onChange={(event) => setOfferType(event.target.value)}
                      className="mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
                    >
                      <option>Percentage</option>
                      <option>Flat Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Discount Value</label>
                    <div className="relative mt-1.5">
                      <input
                        type="text"
                        value={discountValue}
                        onChange={(event) => setDiscountValue(event.target.value)}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Start Date *</label>
                    <div className="mt-1.5">
                      <DatePicker
                        value={offerStartDate}
                        onChange={setOfferStartDate}
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">End Date *</label>
                    <div className="mt-1.5">
                      <DatePicker
                        value={offerEndDate}
                        onChange={setOfferEndDate}
                        minDate={offerStartDate}
                        align="right"
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Min. Order Value (₹) (Optional)</label>
                    <input
                      type="text"
                      value={minOrder}
                      onChange={(event) => setMinOrder(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Offer Description (Optional)</label>
                  <textarea
                    value={offerDescription}
                    onChange={(event) => setOfferDescription(event.target.value.slice(0, 200))}
                    rows={3}
                    maxLength={200}
                    className="mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]"
                  />
                  <p className="mt-1 text-right text-xs text-[#9CA3AF]">{offerDescription.length}/200</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {formError && (
          <p className="mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#EF4444]">{formError}</p>
        )}

        <div className="mt-6 flex items-center justify-end gap-6">
          <button
            type="button"
            onClick={() => router.push("/super-admin/master-data/products?tab=Drafts")}
            className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => {
              if (tab === "Basic Details") {
                if (!productName.trim()) {
                  setFormError("Product Name is required before continuing.");
                  return;
                }
                setFormError(null);
                setTab("Cooking & benefits");
              } else if (tab === "Cooking & benefits") {
                setFormError(null);
                setTab("Reviews & Offers");
              } else {
                const offerStarted = offerTitle.trim() || offerStartDate || offerEndDate;
                if (offerStarted && (!offerTitle.trim() || !offerStartDate || !offerEndDate)) {
                  setFormError("Offer Title, Start Date, and End Date are required to add an offer.");
                  return;
                }
                setFormError(null);
                setStep("preview");
              }
            }}
            className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {tab === "Reviews & Offers" ? "Preview" : "Next"}
          </button>
        </div>
      </main>

      <HealthBenefitsPickerModal
        open={healthPickerOpen}
        onClose={() => setHealthPickerOpen(false)}
        selectedIds={healthBenefitIds}
        onApply={setHealthBenefitIds}
      />
      <NutrientsPickerModal
        open={nutrientPickerOpen}
        onClose={() => setNutrientPickerOpen(false)}
        selectedIds={nutritionRows.map((row) => row.id)}
        onApply={applyNutrients}
      />
      <TestimonialsPickerModal
        open={testimonialPickerOpen}
        onClose={() => setTestimonialPickerOpen(false)}
        selectedIds={testimonialIds}
        onApply={setTestimonialIds}
      />
    </div>
  );
}

function SuccessOverlay({
  productName,
  price,
  imageUrl,
  onDone,
}: {
  productName: string;
  price: string;
  imageUrl?: string;
  onDone: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[440px] rounded-[24px] bg-white p-8 text-center shadow-[0_32px_80px_rgba(0,0,0,0.12)]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
          >
            <Check className="h-7 w-7 text-[#F7931E]" strokeWidth={3} />
          </motion.div>
        </motion.div>
        <h2 className="mt-4 text-xl font-bold text-black">Product Published Successfully</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Your product is now live on the website and visible to customers.
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#F3F4F6] p-3 text-left">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <Image src="/Warehouse/product.png" alt="" width={48} height={48} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-black">{productName}</p>
            <p className="text-xs text-[#9CA3AF]">₹{price} / kg</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#EBF7EC] px-2.5 py-1 text-[10px] font-bold text-[#22C55E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            Live
          </span>
        </div>

        <button
          type="button"
          onClick={onDone}
          className="mt-5 w-full cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
