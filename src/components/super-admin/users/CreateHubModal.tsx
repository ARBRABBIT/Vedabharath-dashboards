"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import type { Admin, Hub } from "@/components/super-admin/users/usersData";
import {
  WAREHOUSE_PRESETS,
  WarehouseLocationMapModal,
  WarehouseMapInlinePicker,
} from "./WarehouseLocationMapModal";

export type HubFormData = {
  name: string;
  zone: string;
  address: string;
  adminId: string;
  coordinates?: string;
  geoTags?: string;
};

type CreateHubModalProps = {
  open: boolean;
  onClose: () => void;
  initial?: Hub | null;
  admins?: Admin[];
  onSave: (data: HubFormData) => void;
};

export function CreateHubModal({ open, onClose, initial, admins = [], onSave }: CreateHubModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [geoTags, setGeoTags] = useState("");
  const [adminId, setAdminId] = useState("");
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    const defaultPreset = WAREHOUSE_PRESETS[0];
    setAddress(initial?.facilityAddress ?? defaultPreset.fullAddress);
    setCoordinates(defaultPreset.coordinates);
    setGeoTags(defaultPreset.geoTags);
    setAdminId(admins.find((admin) => admin.hubId === initial?.id)?.id ?? "");
    setError(false);
    setStep("form");
    setMapModalOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  function handleCreate() {
    if (!name.trim() || !address.trim()) {
      setError(true);
      return;
    }

    const zoneName = address.toLowerCase().includes("bangalore")
      ? address.toLowerCase().includes("south") || address.toLowerCase().includes("electronic")
        ? "South Bangalore"
        : "North Bangalore"
      : address.toLowerCase().includes("hyderabad")
        ? "Hyderabad"
        : "Regional Hub";

    onSave({
      name: name.trim(),
      zone: zoneName,
      address: address.trim(),
      adminId,
      coordinates: coordinates.trim(),
      geoTags: geoTags.trim(),
    });
    setStep("success");
  }

  if (step === "success") {
    return (
      <ModalShell open={open} onClose={onClose} maxWidth="max-w-[420px]">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
            >
              <Check className="h-7 w-7 text-[#22C55E]" strokeWidth={3} />
            </motion.div>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-black">{initial ? "Warehouse Updated" : "Warehouse Created"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              <span className="font-semibold text-black">{name.trim()}</span>{" "}
              {initial ? "has been updated successfully." : "has been registered and is now active."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <>
      <ModalShell open={open} onClose={onClose} maxWidth="max-w-[500px]">
        <div className="p-6">
          <h2 className="text-lg font-bold text-black">
            {initial ? "Edit Warehouse" : "Register New Warehouse"}
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-black">
                Warehouse Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g., Whitefield Warehouse"
                className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
              />
            </div>

            {/* Warehouse Map Location Picker */}
            <div>
              <label className="block text-sm font-semibold text-black pb-1.5">Warehouse Location on Map</label>
              <WarehouseMapInlinePicker
                selectedAddress={address}
                onOpenEnlarge={() => setMapModalOpen(true)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black">Full Address</label>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="e.g., Plot 45, Industrial Area..."
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
              />
              <p className="mt-1 text-[11px] text-[#9CA3AF]">
                Pin a location on the map above or edit full address details directly.
              </p>
            </div>

            {/* Geo Tags & Coordinates */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-black">Coordinates</label>
                <input
                  type="text"
                  value={coordinates}
                  onChange={(event) => setCoordinates(event.target.value)}
                  placeholder="e.g., 12.9850° N, 77.7400° E"
                  className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-black">Geo Tags</label>
                <input
                  type="text"
                  value={geoTags}
                  onChange={(event) => setGeoTags(event.target.value)}
                  placeholder="e.g., #Industrial, #Logistics"
                  className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#EF4444]">
                Please fill in Hub Name and Full Address.
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-7 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB] hover:text-black"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="cursor-pointer rounded-full bg-[#F7931E] px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              {initial ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </ModalShell>

      {/* Enlarged Interactive Map Modal */}
      <WarehouseLocationMapModal
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        initialAddress={address}
        onConfirmLocation={(confirmedAddr, confirmedCoords, confirmedTags) => {
          setAddress(confirmedAddr);
          if (confirmedCoords) setCoordinates(confirmedCoords);
          if (confirmedTags) setGeoTags(confirmedTags);
          setError(false);
        }}
      />
    </>
  );
}
