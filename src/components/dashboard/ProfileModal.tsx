"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

export type UserProfile = {
  name: string;
  title: string;
  initials: string;
  email: string;
  phone: string;
  role: string;
  assignedWarehouse?: string;
  status: string;
};

export const WAREHOUSE_PROFILE: UserProfile = {
  name: "Sriraj Yadav",
  title: "Operations Administrator",
  initials: "SY",
  email: "sriraj455@vedabharath.com",
  phone: "+91 98765 43210",
  role: "Operations Lead",
  assignedWarehouse: "Gachibowli Distribution Warehouse",
  status: "Active",
};

export const SUPER_ADMIN_PROFILE: UserProfile = {
  name: "Sriraj Yadav",
  title: "Super Administrator",
  initials: "SY",
  email: "superadmin@vedabharath.com",
  phone: "+91 98765 43210",
  role: "Super Admin",
  status: "Active",
};

export const PROFILE = WAREHOUSE_PROFILE;

type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
  onRequestLogout: () => void;
  variant?: "warehouse" | "super-admin";
  profile?: UserProfile;
  warehouseName?: string;
};

function ProfileField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]">
        {label}
      </span>
      <div className="text-base font-medium text-[#171D15]">{value}</div>
    </div>
  );
}

export function ProfileModal({
  open,
  onClose,
  onRequestLogout,
  variant = "warehouse",
  profile: customProfile,
  warehouseName,
}: ProfileModalProps) {
  const activeProfile =
    customProfile ?? (variant === "super-admin" ? SUPER_ADMIN_PROFILE : WAREHOUSE_PROFILE);

  useEffect(() => {
    if (!open) return;

    // Disable body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[500px] overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#E9F0E3] text-[#3E4A3C] transition-colors hover:bg-[#dbe6d2]"
            >
              <X className="h-3 w-3" strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center gap-1 px-8 pb-5 pt-9">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[#F5A623] p-[3px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F9A51A] text-xl font-bold text-white">
                  {activeProfile.initials}
                </div>
              </div>
              <h2 className="mt-2.5 text-lg font-bold text-[#171D15]">{activeProfile.name}</h2>
              <p className="text-sm font-medium text-[#3E4A3C]">{activeProfile.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-8 pb-6">
              <ProfileField label="Email Address" value={activeProfile.email} />
              <ProfileField label="Phone Number" value={activeProfile.phone} />
              <ProfileField label="Assigned Role" value={activeProfile.role} />
              {variant === "warehouse" ? (
                <ProfileField
                  label="Assigned Warehouse"
                  value={
                    <span className="text-sm font-semibold text-[#171D15] leading-snug">
                      {warehouseName ?? activeProfile.assignedWarehouse ?? "Gachibowli Distribution Warehouse"}
                    </span>
                  }
                />
              ) : (
                <ProfileField
                  label="Account Status"
                  value={
                    <span className="inline-flex w-fit items-center rounded-full bg-[#EBF7EC] px-2 py-0.5 text-xs font-bold text-[#3BB54A]">
                      {activeProfile.status}
                    </span>
                  }
                />
              )}
            </div>

            <div className="border-t border-[#E5E5E7] px-8 py-5">
              <button
                type="button"
                onClick={onRequestLogout}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FCE8E6] py-2.5 text-sm font-semibold text-[#D93025] transition-colors hover:bg-[#f9dbd8]"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Log Out of Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
