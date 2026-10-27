"use client";

import {
  BadgeCheck,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  Sprout,
  User,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/orders/modals/modalHelpers";
import { PURITY_GRADES, agingTone, dossierStatusLabel, type Batch } from "./inventoryData";

type BatchDossierModalProps = {
  batch: Batch | null;
  open: boolean;
  onClose: () => void;
  onSave: (batch: Batch) => void;
};

type EditableFields = {
  preArrivalYears: string;
  warehouseAgingYears: string;
  rack: string;
  moisturePercent: string;
  purityGrade: string;
};

function toEditable(batch: Batch): EditableFields {
  return {
    preArrivalYears: String(batch.preArrivalYears),
    warehouseAgingYears: String(batch.warehouseAgingYears),
    rack: batch.rack,
    moisturePercent: String(batch.moisturePercent.toFixed(1)),
    purityGrade: batch.purityGrade,
  };
}

export function BatchDossierModal({ batch, open, onClose, onSave }: BatchDossierModalProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [fields, setFields] = useState<EditableFields | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && batch) {
      setMode("view");
      setFields(toEditable(batch));
      setPhoto(batch.photo);
    }
  }, [open, batch]);

  if (!batch || !fields) return null;

  const preArrival = Number(fields.preArrivalYears) || 0;
  const warehouseAging = Number(fields.warehouseAgingYears) || 0;
  const totalAge = preArrival + warehouseAging;

  function handleSave() {
    if (!batch || !fields) return;
    onSave({
      ...batch,
      preArrivalYears: preArrival,
      warehouseAgingYears: warehouseAging,
      ageYears: totalAge,
      rack: fields.rack,
      moisturePercent: Number(fields.moisturePercent) || 0,
      purityGrade: fields.purityGrade,
      photo: photo ?? batch.photo,
    });
    onClose();
  }

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-[900px]">
      <div className="max-h-[92vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-5 pr-10">
          <h2 className="text-xl font-bold text-[#171D15]">Batch {batch.id} Dossier</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {mode === "view" ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-[#3BB54A]">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-[#3BB54A]">
                    {dossierStatusLabel(batch.ageYears)}
                  </span>
                  <span className="text-sm text-[#6E7B6A]">
                    <span className="font-bold text-[#171D15]">
                      {batch.quantityKg.toLocaleString()} kg
                    </span>{" "}
                    currently stored in {batch.rack}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                  Aging Lifecycle
                </span>
                <div className="flex flex-col gap-3 rounded-xl bg-[#F5F5F7] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6E7B6A]">Pre-Arrival Maturation</span>
                    <span className="font-bold text-[#171D15]">
                      {batch.preArrivalYears.toFixed(1)} Years
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6E7B6A]">Warehouse Aging Phase</span>
                    <span className="font-bold text-[#171D15]">
                      {batch.warehouseAgingYears.toFixed(1)} Years
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E5E5E7] pt-3 text-sm">
                    <span className="font-bold text-[#171D15]">Total Rice Age</span>
                    <span className={`font-bold ${agingTone(batch.ageYears) === "green" ? "text-[#3BB54A]" : "text-[#F7931E]"}`}>
                      {batch.ageYears.toFixed(1)} Years
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                  Harvest Origin
                </span>
                <div className="flex flex-col gap-2 rounded-xl border border-[#F1F5F9] p-4">
                  <span className="text-base font-bold text-[#171D15]">{batch.farm}</span>
                  <span className="flex items-start gap-2 text-sm text-[#3E4A3C]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F9A51A]" strokeWidth={2} />
                    {batch.farmAddress}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-[#3E4A3C]">
                    <User className="h-4 w-4 shrink-0 text-[#F9A51A]" strokeWidth={2} />
                    Owner: {batch.farmOwner}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-[#3E4A3C]">
                    <Phone className="h-4 w-4 shrink-0 text-[#F9A51A]" strokeWidth={2} />
                    {batch.farmPhone}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                  Batch Configuration
                </span>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">
                    Pre-Arrival Maturation (Years)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={fields.preArrivalYears}
                      onChange={(event) =>
                        setFields((prev) => prev && { ...prev, preArrivalYears: event.target.value })
                      }
                      className="w-full rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]"
                    />
                    <Clock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]" strokeWidth={2} />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">
                    Warehouse Aging Phase (Years)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={fields.warehouseAgingYears}
                      onChange={(event) =>
                        setFields((prev) => prev && { ...prev, warehouseAgingYears: event.target.value })
                      }
                      className="w-full rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]"
                    />
                    <WarehouseIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]" strokeWidth={2} />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-[#171D15]">Rack Location</span>
                  <div className="relative">
                    <select
                      value={fields.rack}
                      onChange={(event) => setFields((prev) => prev && { ...prev, rack: event.target.value })}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]"
                    >
                      <option value={batch.rack}>{batch.rack}</option>
                      {["Zone A - Rack 01", "Zone B - Rack 05", "Zone C - Rack 09"]
                        .filter((rack) => rack !== batch.rack)
                        .map((rack) => (
                          <option key={rack} value={rack}>
                            {rack}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]" strokeWidth={2} />
                  </div>
                </label>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                  Harvest Origin (Read-Only)
                </span>
                <div className="flex items-center gap-3 rounded-xl bg-[#F0F9F1] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-[#3BB54A]">
                    <Sprout className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#171D15]">{batch.farm} Unit 01</span>
                    <span className="flex items-center gap-1.5 text-xs text-[#6E7B6A]">
                      <User className="h-3 w-3" strokeWidth={2} />
                      Manager: {batch.farmOwner}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[#6E7B6A]">
                      <MapPin className="h-3 w-3" strokeWidth={2} />
                      {batch.farmAddress.split(",").slice(-2).join(",").trim()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-2xl">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setPhoto(URL.createObjectURL(file));
                }}
              />
              <Image
                src={photo ?? batch.photo}
                alt={batch.farm}
                width={520}
                height={320}
                unoptimized={photo?.startsWith("blob:")}
                className={`h-[260px] w-full object-cover object-right ${mode === "view" ? "border-2 border-[#3B82F6]" : ""}`}
              />
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 left-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#171D15] shadow-sm hover:bg-white"
                >
                  <Camera className="h-3.5 w-3.5 text-[#3BB54A]" strokeWidth={2} />
                  Change Photo
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
                Quality Assurance{mode === "edit" ? " Metrics" : ""}
              </span>
              {mode === "view" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F5F5F7] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#86868B]">
                      Moisture Content
                    </span>
                    <p className="text-xl font-bold text-[#171D15]">{batch.moisturePercent.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-xl bg-[#F5F5F7] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#86868B]">
                      Purity Grade
                    </span>
                    <p className="flex items-center gap-1.5 text-xl font-bold text-[#171D15]">
                      {batch.purityGrade}
                      <BadgeCheck className="h-4 w-4 text-[#3BB54A]" strokeWidth={2} />
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-[#171D15]">Moisture Content (%)</span>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={fields.moisturePercent}
                        onChange={(event) =>
                          setFields((prev) => prev && { ...prev, moisturePercent: event.target.value })
                        }
                        className="w-full rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]"
                      />
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#F7931E]">
                        %
                      </span>
                    </div>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-[#171D15]">Purity Grade</span>
                    <div className="relative">
                      <select
                        value={fields.purityGrade}
                        onChange={(event) =>
                          setFields((prev) => prev && { ...prev, purityGrade: event.target.value })
                        }
                        className="w-full cursor-pointer appearance-none rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]"
                      >
                        {PURITY_GRADES.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                      <BadgeCheck className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]" strokeWidth={2} />
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancel
          </button>
          {mode === "view" ? (
            <button type="button" onClick={() => setMode("edit")} className={PRIMARY_BUTTON}>
              Adjust Stock
            </button>
          ) : (
            <button type="button" onClick={handleSave} className={PRIMARY_BUTTON}>
              Save
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
