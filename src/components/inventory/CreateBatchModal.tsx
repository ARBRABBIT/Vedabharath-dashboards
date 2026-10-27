"use client";

import { Image as ImageIcon, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/orders/modals/modalHelpers";
import { PURITY_GRADES, WAREHOUSES, type Batch } from "./inventoryData";

type CreateBatchModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (batch: Batch) => void;
};

const EMPTY_FORM = {
  preArrivalYears: "",
  warehouseAgingYears: "",
  rackLocation: "",
  farmName: "",
  address: "",
  managerName: "",
  contactNumber: "",
  moisturePercent: "",
  purityGrade: "",
};

export function CreateBatchModal({ open, onClose, onCreate }: CreateBatchModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setPhotoPreview(null);
    }
  }, [open]);

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCreate() {
    if (!form.farmName.trim() || !form.rackLocation.trim()) return;

    const preArrivalYears = Number(form.preArrivalYears) || 0;
    const warehouseAgingYears = Number(form.warehouseAgingYears) || 0;

    const batch: Batch = {
      id: `#B-${Math.floor(1000 + Math.random() * 9000)}`,
      farm: form.farmName,
      farmAddress: form.address || "Address not provided",
      farmOwner: form.managerName || "Unassigned",
      farmPhone: form.contactNumber || "—",
      photo: photoPreview ?? "/Warehouse/dashboard-banner.png",
      inwardDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      preArrivalYears,
      warehouseAgingYears,
      ageYears: preArrivalYears + warehouseAgingYears,
      warehouse: WAREHOUSES[0],
      rack: form.rackLocation,
      quantityKg: 0,
      variety: "Unassigned",
      moisturePercent: Number(form.moisturePercent) || 0,
      purityGrade: form.purityGrade || PURITY_GRADES[0],
    };

    onCreate(batch);
    onClose();
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[900px]">
      <div className="max-h-[92vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-5 pr-10">
          <h2 className="text-xl font-bold text-[#171D15]">Create New Batch</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                <span className="h-3.5 w-0.5 rounded-full bg-[#F7931E]" />
                Batch Configuration
              </span>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">
                    Pre-Arrival Maturation (Years)
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    value={form.preArrivalYears}
                    onChange={(event) => update("preArrivalYears", event.target.value)}
                    placeholder="e.g., 0.5"
                    className="w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">
                    Warehouse Aging Phase (Years)
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    value={form.warehouseAgingYears}
                    onChange={(event) => update("warehouseAgingYears", event.target.value)}
                    placeholder="e.g., 1.3"
                    className="w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-[#171D15]">Initial Rack Location</span>
                <input
                  type="text"
                  value={form.rackLocation}
                  onChange={(event) => update("rackLocation", event.target.value)}
                  placeholder="Enter Zone & Rack..."
                  className="w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                <span className="h-3.5 w-0.5 rounded-full bg-[#3BB54A]" />
                Harvest Origin
              </span>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-[#171D15]">Farm Name</span>
                <input
                  type="text"
                  value={form.farmName}
                  onChange={(event) => update("farmName", event.target.value)}
                  placeholder="Enter farm unit name..."
                  className="w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-[#171D15]">Location / Address</span>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]" strokeWidth={2} />
                  <input
                    type="text"
                    value={form.address}
                    onChange={(event) => update("address", event.target.value)}
                    placeholder="Enter full address..."
                    className="w-full rounded-xl border border-[#E5E5E7] py-3 pl-10 pr-4 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]"
                  />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">Unit Manager</span>
                  <input
                    type="text"
                    value={form.managerName}
                    onChange={(event) => update("managerName", event.target.value)}
                    placeholder="Enter manager name..."
                    className="w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">Contact Number</span>
                  <input
                    type="text"
                    value={form.contactNumber}
                    onChange={(event) => update("contactNumber", event.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setPhotoPreview(URL.createObjectURL(file));
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-[260px] w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-[#D9D9DE] bg-[#FAFAFA] transition-colors hover:border-[#F9A51A]"
            >
              {photoPreview ? (
                <Image src={photoPreview} alt="Unit preview" fill className="object-cover" unoptimized />
              ) : (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#86868B] shadow-sm">
                    <ImageIcon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-bold text-[#171D15]">Upload Unit Photo</span>
                  <span className="text-xs text-[#86868B]">PNG, JPG up to 10MB</span>
                </>
              )}
            </button>

            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                <span className="h-3.5 w-0.5 rounded-full bg-[#F7931E]" />
                Quality Assurance Metrics
              </span>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">Moisture Content (%)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={form.moisturePercent}
                    onChange={(event) => update("moisturePercent", event.target.value)}
                    placeholder="0.0%"
                    className="w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">Purity Grade</span>
                  <select
                    value={form.purityGrade}
                    onChange={(event) => update("purityGrade", event.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]"
                  >
                    <option value="" disabled>
                      Select Grade...
                    </option>
                    {PURITY_GRADES.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancel
          </button>
          <button type="button" onClick={handleCreate} className={PRIMARY_BUTTON}>
            Create
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
