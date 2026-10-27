import { AnimatedSubtitle } from "@/components/ui/AnimatedSubtitle";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function UpdateDefaultPasswordNotice() {
  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex flex-col gap-3">
        <AnimatedTitle className="text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]">
          Update Default Password
        </AnimatedTitle>
        <AnimatedSubtitle className="text-base leading-[26px] text-[#3D4949]">
          You are currently logging in with a system-generated password sent
          to your email. For your security, we strongly recommend setting a
          new password now.
        </AnimatedSubtitle>
      </div>

      <div className="flex flex-col gap-4">
        <ButtonLink href="/set-new-password">Set new password</ButtonLink>
        <ButtonLink href="/login" variant="secondary">
          Continue to login
        </ButtonLink>
      </div>
    </div>
  );
}
