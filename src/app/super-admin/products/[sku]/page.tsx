"use client";

import { ChevronDown, Droplet, Leaf, Pencil, ShieldCheck, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { PageHeader } from "@/components/super-admin/ui/PageHeader";
import { PRODUCTS } from "@/components/super-admin/products/productsData";

const FEATURES = [
  { icon: Leaf, iconBg: "bg-[#EBF7EC]", iconColor: "text-[#22C55E]", title: "100% Natural", subtitle: "Pesticide free & organic" },
  { icon: ShieldCheck, iconBg: "bg-[#EFF6FF]", iconColor: "text-[#3B82F6]", title: "Antioxidants", subtitle: "Rich in proanthocyanidins" },
  { icon: ShieldCheck, iconBg: "bg-[#FEF3E2]", iconColor: "text-[#F7931E]", title: "Diabetic Friendly", subtitle: "Low Glycemic Index (GI)" },
  { icon: Droplet, iconBg: "bg-[#EFF6FF]", iconColor: "text-[#3B82F6]", title: "High Fiber", subtitle: "Easily digestible grains" },
];

const INITIAL_REVIEWS = [
  {
    id: "r1",
    name: "Ananya Sharma",
    time: "2 days ago",
    rating: 5,
    text: "The quality of this rice is exceptional. The grains are consistent and the aroma while cooking is authentic. It's become a staple for my family's Ayurvedic diet. Fast delivery and premium packaging too!",
    visible: true,
  },
  {
    id: "r2",
    name: "Dr. Rajesh Menon",
    time: "1 week ago",
    rating: 4,
    text: "Recommended for its medicinal properties. The stock is fresh and the nutritional values listed match the laboratory standard. Excellent service by Veda Bharath in sourcing authentic grains.",
    visible: true,
  },
  {
    id: "r3",
    name: "Priya Sharma",
    time: "1 week ago",
    rating: 5,
    text: "Excellent quality rice with authentic taste and freshness. Perfect packaging and fast delivery. Highly recommended for daily meals.",
    visible: true,
  },
  {
    id: "r4",
    name: "Karthik Iyer",
    time: "2 weeks ago",
    rating: 4,
    text: "Good quality overall, cooks up soft and fluffy. Delivery took a couple of days longer than expected but the product made up for it.",
    visible: true,
  },
  {
    id: "r5",
    name: "Meera Nair",
    time: "3 weeks ago",
    rating: 5,
    text: "Been buying this for months now, consistent quality every single time. The packaging keeps it fresh for a long time too.",
    visible: true,
  },
  {
    id: "r6",
    name: "Suresh Kumar",
    time: "1 month ago",
    rating: 3,
    text: "Decent rice, does the job. Wish it was slightly more affordable given the pack size, but quality is acceptable.",
    visible: true,
  },
];

export default function ProductDetailsPage() {
  const params = useParams<{ sku: string }>();
  const product = PRODUCTS.find((item) => item.sku === params.sku);

  if (!product) notFound();

  const [details] = useState({
    name: `Premium ${product.name}`,
    description: product.description,
    price: product.price,
    inStock: product.stock > 0,
  });
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  function toggleReviewVisibility(id: string) {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, visible: !review.visible } : review)));
  }

  const inStock = details.inStock;
  const kgStock = Math.max(4, Math.round(product.stock * 0.11));
  const bulkStock = Math.max(0, Math.round(product.stock * 0.015));
  const kgOrders = Math.round(product.orders * 0.57);
  const bulkOrders = product.orders - kgOrders;
  const revenue = ((product.price * product.orders) / 1000).toFixed(1);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <PageHeader
          title="Product details"
          subtitle="View comprehensive details and performance metrics of your product"
          backHref="/super-admin/products"
        />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:w-[320px] sm:shrink-0">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#F5F5F7]">
              <Image
                src="/Warehouse/product.png"
                alt={product.name}
                width={320}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-xl bg-[#F5F5F7]">
                  <Image
                    src="/Warehouse/product.png"
                    alt=""
                    width={70}
                    height={70}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-[32px] border-2 border-black/[0.04] bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  inStock ? "bg-[#EBF7EC] text-[#22C55E]" : "bg-[#FEF2F2] text-[#EF4444]"
                }`}
              >
                {inStock ? "IN STOCK" : "OUT OF STOCK"}
              </span>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Current Price</p>
                <p className="text-2xl font-bold text-[#22C55E]">
                  ₹{details.price} <span className="text-sm font-medium text-[#6B7280]">/kg</span>
                </p>
              </div>
            </div>

            <h2 className="mt-3 text-2xl font-bold text-black">{details.name}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">{details.description}</p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-3 rounded-2xl bg-[#F9FAFB] p-3.5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${feature.iconBg}`}
                  >
                    <feature.icon className={`h-4 w-4 ${feature.iconColor}`} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-black">{feature.title}</p>
                    <p className="text-xs text-[#9CA3AF]">{feature.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href={`/super-admin/master-data/products/new?edit=${product.sku}`}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Pencil className="h-4 w-4" strokeWidth={2} />
                Edit Product Details
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border-2 border-black/[0.04] bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black">Weekly Sales Performance</h3>
            <div className="relative">
              <select className="cursor-pointer appearance-none rounded-full bg-[#F3F4F6] py-1.5 pl-4 pr-8 text-xs font-medium text-[#374151] outline-none">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B7280]" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Product Orders</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[28px] font-bold text-black">{product.orders.toLocaleString()}</span>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-[#22C55E]">
                  <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />+{Math.abs(product.ordersDelta)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Total Revenue</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[28px] font-bold text-black">₹{revenue}K</span>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-[#22C55E]">
                  <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                  +8.4%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Best Selling Variant</p>
              <p className="mt-1 text-[28px] font-bold text-black">1Kg Pouch</p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white">
          <h3 className="px-6 pt-6 text-xl font-semibold text-black">Variants &amp; Stock Depth</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="bg-[#F9FAFB] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-3">Configuration</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Physical Stock</th>
                  <th className="px-4 py-3">Stock Status</th>
                  <th className="px-4 py-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#F3F4F6]">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-black">1kg Airtight Pouch</p>
                    <p className="text-xs text-[#9CA3AF]">SKU: {product.sku}-1KG</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-black">₹{(product.price * 1.15).toFixed(0)}.00</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-[#F7931E]">{kgStock} Units</p>
                    <div className="mt-1.5 h-1.5 w-[100px] overflow-hidden rounded-full bg-[#F3F4F6]">
                      <div className="h-full w-3/4 rounded-full bg-[#F7931E]" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        kgStock < 20 ? "bg-[#FEF2F2] text-[#EF4444]" : "bg-[#F3F4F6] text-[#374151]"
                      }`}
                    >
                      {kgStock < 20 ? "CRITICAL LOW" : "IN STOCK"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-black">{kgOrders.toLocaleString()}</p>
                    <p className="text-xs text-[#9CA3AF]">orders</p>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-black">5kg Bulk Catering Pack</p>
                    <p className="text-xs text-[#9CA3AF]">SKU: {product.sku}-5KG</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-black">₹{(product.price * 4.8).toFixed(0)}.00</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-[#EF4444]">{bulkStock} Units</p>
                    <div className="mt-1.5 h-1.5 w-[100px] overflow-hidden rounded-full bg-[#F3F4F6]">
                      <div className="h-full w-1/5 rounded-full bg-[#EF4444]" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-[#FEF2F2] px-2.5 py-1 text-[10px] font-bold text-[#EF4444]">
                      CRITICAL LOW
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-black">{bulkOrders.toLocaleString()}</p>
                    <p className="text-xs text-[#9CA3AF]">orders</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="h-2" />
        </div>

        <div className="mt-6 rounded-[32px] border-2 border-black/[0.04] bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black">Recent Customer Reviews</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-[#6B7280]">Average Rating:</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-[#F7931E] text-[#F7931E]" strokeWidth={0} />
                ))}
              </div>
              <span className="text-sm font-bold text-black">4.8</span>
              <span className="text-xs text-[#9CA3AF]">(124 reviews)</span>
            </div>
          </div>

          <div className="scrollbar-hide mt-4 flex max-h-[360px] flex-col gap-4 overflow-y-auto pr-1">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`shrink-0 rounded-2xl bg-[#F9FAFB] p-4 transition-opacity ${
                  review.visible ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white">
                      {review.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">{review.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{review.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-3 w-3 ${
                          index < review.rating ? "fill-[#F7931E] text-[#F7931E]" : "text-[#E5E7EB]"
                        }`}
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">{review.text}</p>

                <div className="mt-3 flex items-center justify-end gap-2 border-t border-black/5 pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    {review.visible ? "Visible" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleReviewVisibility(review.id)}
                    aria-label="Toggle review visibility"
                    className={`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                      review.visible ? "bg-[#F7931E]" : "bg-[#E5E7EB]"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        review.visible ? "translate-x-[22px]" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
