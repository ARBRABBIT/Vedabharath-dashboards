import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SetNewPasswordForm } from "@/components/auth/SetNewPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password",
};

export default function SetNewPasswordPage() {
  return (
    <AuthLayout>
      <SetNewPasswordForm />
    </AuthLayout>
  );
}
