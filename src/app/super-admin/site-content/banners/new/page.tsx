"use client";

import { ArrowLeft, Check, ChevronDown, EyeOff, ShoppingCart, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { BannerScheduledModal } from "@/components/super-admin/content/BannerScheduledModal";
import { DateField } from "@/components/super-admin/content/DateField";
import { SaveDraftModal } from "@/components/super-admin/content/SaveDraftModal";

const PLACEMENTS = [
  "Homepage - Top Hero Section",
  "Homepage - Middle Promotion",
  "Shop - Category Sidebar",
  "Product Page - Bottom Banner",
];

function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function NewBannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"editor" | "preview" | "success">("editor");
  const [saveDraftOpen, setSaveDraftOpen] = useState(false);

  const [placement, setPlacement] = useState(PLACEMENTS[0]);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date(2026, 7, 1));
  const [endDate, setEndDate] = useState(new Date(2026, 7, 15));
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
  }

  if (step === "preview" || step === "success") {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
        <SuperAdminNavbar />

        <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setStep("editor")}
              aria-label="Back"
              className="mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-6 w-6" strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-[28px] font-bold text-black">Preview Before Publishing</h1>
              <p className="mt-1 text-sm text-[#6B7280]">Review Banners before making it live on the website.</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB]">
            <div className="flex items-center gap-4 border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
              </div>
              <span className="flex-1 rounded-md bg-white px-3 py-1 text-center text-xs text-[#9CA3AF]">
                vedabharath.com/home
              </span>
            </div>

            <div className="flex items-center justify-between px-8 py-5">
              <span className="text-lg font-bold text-[#F7931E]">
                VEDA<span className="text-[#22C55E]">BHARATH</span>
              </span>
              <nav className="flex items-center gap-8 text-sm font-medium text-black">
                <span>Home</span>
                <span className="text-[#9CA3AF]">Shop</span>
                <span className="text-[#9CA3AF]">Methodology</span>
                <span className="text-[#9CA3AF]">Blog</span>
              </nav>
              <ShoppingCart className="h-5 w-5 text-black" strokeWidth={2} />
            </div>

            <div
              className="relative mx-8 mb-8 flex h-[340px] flex-col justify-center overflow-hidden rounded-2xl px-10"
              style={{
                backgroundImage: imageUrl
                  ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.15)), url(${imageUrl})`
                  : "linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Exclusive Release</p>
              <h2 className="mt-2 text-4xl font-bold text-white">Monsoon Harvest 2026</h2>
              <span className="mt-4 w-fit rounded-lg bg-[#F7931E] px-5 py-2.5 text-sm font-bold text-white">
                Shop The Collection
              </span>
            </div>

            <div className="px-8 pb-10">
              <h3 className="text-center text-2xl font-bold text-black">Shop by Category</h3>
              <div className="mt-6 grid grid-cols-3 gap-6">
                {["Premium Basmati", "Whole Grains", "Artisan Spices"].map((category) => (
                  <div key={category} className="rounded-2xl bg-[#F9FAFB] p-4">
                    <div className="aspect-square rounded-xl bg-[#E5E7EB]" />
                    <p className="mt-3 text-center text-base font-semibold text-black">{category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-6">
            <button
              type="button"
              onClick={() => setStep("editor")}
              className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
            >
              Back to Editor
            </button>
            <button
              type="button"
              onClick={() => setStep("success")}
              className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Schedule Banner
            </button>
          </div>
        </main>

        <BannerScheduledModal
          open={step === "success"}
          onDone={() => router.push("/super-admin/site-content")}
          bannerGradient="linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)"
          imageUrl={imageUrl}
          startDateLabel={formatFullDate(startDate).toUpperCase()}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.push("/super-admin/site-content")}
            aria-label="Back"
            className="mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-black">Banner Management</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Manage The Banners of Your Website</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Upload Banners</p>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              handleFile(event.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-3 flex h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
              dragOver ? "border-[#F7931E] bg-[#FEF9F0]" : "border-[#E5C9A0] bg-[#FAFAF8]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            {imageUrl ? (
              <div className="group relative h-full w-full overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Banner preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-0 transition-opacity group-hover:opacity-100">
                    Click to Replace
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setImageUrl(null);
                  }}
                  aria-label="Remove banner image"
                  className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow transition-opacity hover:opacity-90"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-[#C79A5B]" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-[#374151]">Drag &amp; Drop Desktop Banner (1400x600)</p>
                <p className="mt-1 text-xs text-[#9CA3AF]">PNG, JPG, or SVG up to 10MB</p>
              </>
            )}
          </div>
        </div>

        <div className="relative mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Placement &amp; Dates</p>

          <div className="relative mt-3">
            <label className="text-sm font-semibold text-black">Where should this banner appear?</label>
            <button
              type="button"
              onClick={() => setPlacementOpen((prev) => !prev)}
              className="mt-1.5 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-left text-sm text-black outline-none focus:border-[#F7931E]"
            >
              {placement}
              <ChevronDown className={`h-4 w-4 text-[#9CA3AF] transition-transform ${placementOpen ? "rotate-180" : ""}`} strokeWidth={2} />
            </button>

            {placementOpen && (
              <div className="absolute left-0 top-full z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-[#F3F4F6] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                {PLACEMENTS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setPlacement(option);
                      setPlacementOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${
                      option === placement ? "bg-[#FEF3E2] font-semibold text-[#F7931E]" : "text-[#374151]"
                    }`}
                  >
                    {option}
                    {option === placement && <Check className="h-4 w-4" strokeWidth={2.5} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateField label="Start Date" value={startDate} onChange={setStartDate} />
            <DateField label="End Date" value={endDate} onChange={setEndDate} />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
          {imageUrl ? (
            <div className="relative flex h-[220px] flex-col justify-center px-8" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.15)), url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Live Preview</p>
              <h3 className="mt-2 text-2xl font-bold text-white">Your Banner, Live</h3>
            </div>
          ) : (
            <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center">
              <EyeOff className="h-6 w-6 text-[#9CA3AF]" strokeWidth={1.5} />
              <p className="text-base font-bold text-black">Live Preview Unavailable</p>
              <p className="max-w-[300px] text-sm text-[#9CA3AF]">
                Upload assets above to generate a real-time preview of your banner placement.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-6">
          <button
            type="button"
            onClick={() => setSaveDraftOpen(true)}
            className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => setStep("preview")}
            className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Preview
          </button>
        </div>
      </main>

      <SaveDraftModal
        open={saveDraftOpen}
        onKeepEditing={() => setSaveDraftOpen(false)}
        onSaveAsDraft={() => router.push("/super-admin/site-content?tab=Drafts")}
      />
    </div>
  );
}
