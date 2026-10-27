"use client";

import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatedSubtitle } from "@/components/ui/AnimatedSubtitle";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { markDefaultPasswordUpdated, type AdminRole } from "@/lib/authState";

export function SetNewPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmNewPassword = String(data.get("confirmNewPassword") ?? "");

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setError(null);
    setLoading(true);
    // TODO: wire up to the password-update API
    setTimeout(() => {
      setLoading(false);
      const role = (new URLSearchParams(window.location.search).get("role") ??
        "warehouse") as AdminRole;
      markDefaultPasswordUpdated(role);
      router.push("/login");
    }, 800);
  }

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex flex-col gap-3">
        <AnimatedTitle className="text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]">
          Set New Password
        </AnimatedTitle>
        <AnimatedSubtitle className="text-base leading-[26px] text-[#3D4949]">
          Ensure your account is using a long, random password to stay
          secure.
        </AnimatedSubtitle>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-[26px]">
          <TextField
            id="newPassword"
            name="newPassword"
            label="New Password"
            icon={Lock}
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            required
          />

          <TextField
            id="confirmNewPassword"
            name="confirmNewPassword"
            label="Confirm New Password"
            icon={Lock}
            type="password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            required
          />
        </div>

        {error && (
          <p className="-mt-2 text-sm font-medium text-red-600">{error}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}
