import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { UpdateDefaultPasswordNotice } from "@/components/auth/UpdateDefaultPasswordNotice";

export const metadata: Metadata = {
  title: "Update Default Password",
};

export default function UpdateDefaultPasswordPage() {
  return (
    <AuthLayout>
      <UpdateDefaultPasswordNotice />
    </AuthLayout>
  );
}
