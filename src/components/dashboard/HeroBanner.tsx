import Image from "next/image";
import type { ReactNode } from "react";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { AnimatedSubtitle } from "@/components/ui/AnimatedSubtitle";

type HeroBannerProps = {
  heading: string;
  subtitle: string;
  children?: ReactNode;
};

export function HeroBanner({ heading, subtitle, children }: HeroBannerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      <Image
        src="/Warehouse/dashboard-banner.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div
        className={`relative z-10 flex min-h-[280px] w-full flex-col px-8 py-8 sm:min-h-[300px] sm:px-10 lg:min-h-[338px] ${
          children ? "justify-between gap-9" : "justify-start gap-1"
        }`}
      >
        <div className="flex flex-col gap-1">
          <AnimatedHeading
            as="h1"
            className="text-[32px] font-semibold leading-[1.2] text-[#F2F2F2] sm:text-[40px] lg:text-[50px] lg:leading-[60px]"
          >
            {heading}
          </AnimatedHeading>
          <AnimatedSubtitle className="text-lg font-normal leading-[1.2] text-white sm:text-xl lg:text-2xl lg:leading-[29px]">
            {subtitle}
          </AnimatedSubtitle>
        </div>

        {children}
      </div>
    </div>
  );
}
