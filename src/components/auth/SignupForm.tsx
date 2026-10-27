"use client";

import { Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AnimatedSubtitle } from "@/components/ui/AnimatedSubtitle";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setError(null);
    setLoading(true);
    // TODO: wire up to the registration API
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex flex-col gap-3">
        <AnimatedTitle className="text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]">
          Create Admin Account
        </AnimatedTitle>
        <AnimatedSubtitle className="text-base leading-[26px] text-[#3D4949]">
          Register a new Warehouse Admin account to manage inventory and
          operations.
        </AnimatedSubtitle>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-[26px]">
          <TextField
            id="fullName"
            name="fullName"
            label="Full Name"
            icon={User}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />

          <TextField
            id="email"
            name="email"
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <TextField
            id="phone"
            name="phone"
            label="Phone Number"
            icon={Phone}
            type="tel"
            placeholder="Enter your phone number"
            autoComplete="tel"
            required
          />

          <TextField
            id="password"
            name="password"
            label="Password"
            icon={Lock}
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />

          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            icon={Lock}
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            required
          />
        </div>

        {error && (
          <p className="-mt-2 text-sm font-medium text-red-600">{error}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="-mt-2 text-center text-sm text-[#3D4949]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#F9A51A] hover:text-[#e6960f]"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
