"use client";

import { Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatedSubtitle } from "@/components/ui/AnimatedSubtitle";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { hasUpdatedDefaultPassword, type AdminRole } from "@/lib/authState";

const ACCOUNTS: Array<{ role: AdminRole; loginId: string; password: string; dashboardPath: string }> = [
  {
    role: "warehouse",
    loginId: "admin@techgylink.com",
    password: "admin@123",
    dashboardPath: "/warehouse",
  },
  {
    role: "super",
    loginId: "superadmin@techgylink.com",
    password: "superadmin@123",
    dashboardPath: "/super-admin",
  },
];

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginId = String(data.get("loginId") ?? "").trim();
    const password = String(data.get("password") ?? "");

    setError(null);
    setLoading(true);

    // TODO: wire up to the authentication API
    setTimeout(() => {
      const account = ACCOUNTS.find(
        (acc) => acc.loginId === loginId.toLowerCase() && acc.password === password,
      );

      if (account) {
        router.push(
          hasUpdatedDefaultPassword(account.role)
            ? account.dashboardPath
            : `/set-new-password?role=${account.role}`,
        );
        return;
      }
      setLoading(false);
      setError("Invalid Login ID or Password. Please try again.");
    }, 700);
  }

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex flex-col gap-3">
        <AnimatedTitle className="text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]">
          Admin Login
        </AnimatedTitle>
        <AnimatedSubtitle className="text-base leading-[26px] text-[#3D4949]">
          Secure access for authorized administrators. Please authenticate to
          continue.
        </AnimatedSubtitle>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-[26px]">
          <TextField
            id="loginId"
            name="loginId"
            label="Login ID"
            icon={User}
            placeholder="Enter your assigned ID"
            autoComplete="username"
            inputMode="email"
            required
          />

          <div className="flex flex-col gap-2">
            <TextField
              id="password"
              name="password"
              label="Password"
              icon={Lock}
              type="password"
              placeholder="Enter Password"
              autoComplete="current-password"
              required
            />
            <Link
              href="/forgot-password"
              className="self-end text-sm font-medium text-[#3D4949] transition-colors hover:text-[#1A1C1D]"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="-mt-2 text-sm font-medium text-red-600">{error}</p>
        )}

        <Button type="submit" loading={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
