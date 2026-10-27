"use client";

import { ArrowLeft, Check, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AnimatedSubtitle } from "@/components/ui/AnimatedSubtitle";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TextField } from "@/components/ui/TextField";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${"X".repeat(Math.max(local.length, 3))}@${domain}`;
}

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    setLoading(true);
    // TODO: wire up to the password-reset request API
    setTimeout(() => {
      setLoading(false);
      setSentTo(typeof email === "string" ? email : "");
    }, 800);
  }

  if (sentTo !== null) {
    return (
      <div className="flex w-full flex-col items-center gap-8 text-center">
        <AnimatedTitle className="text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]">
          Password Sent Successfully
        </AnimatedTitle>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.15 }}
          className="flex h-36 w-36 items-center justify-center rounded-full bg-[#F9A51A]/10"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 130, damping: 22, delay: 0.45 }}
            className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white bg-[#F9A51A] shadow-[0_14px_40px_-8px_rgba(34,197,94,0.45)]"
          >
            <Check className="h-12 w-12 text-white" strokeWidth={3.5} />
          </motion.div>
        </motion.div>

        <AnimatedSubtitle className="text-base leading-[26px] text-[#3D4949]">
          We Have Sent a Temporary Password to{" "}
          <span className="font-semibold text-[#1A1C1D]">
            {maskEmail(sentTo)}
          </span>
        </AnimatedSubtitle>

        <ButtonLink href="/login" className="mt-2">
          Done
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-7">
      <Link
        href="/login"
        className="flex items-center gap-2 text-sm font-medium text-[#3D4949] transition-colors hover:text-[#1A1C1D]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Back to Login
      </Link>

      <div className="flex flex-col gap-3">
        <AnimatedTitle className="text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]">
          Forgot your password?
        </AnimatedTitle>
        <AnimatedSubtitle className="text-base leading-[26px] text-[#3D4949]">
          Enter your registered mail to receive a temporary password.
        </AnimatedSubtitle>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <TextField
          id="email"
          name="email"
          label="Enter registered mail"
          icon={Mail}
          type="email"
          placeholder="Enter your registered mail here"
          autoComplete="email"
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send password"}
        </Button>
      </form>
    </div>
  );
}
