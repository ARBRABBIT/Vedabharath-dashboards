import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

const QUOTE =
  "Naturally grown, Carefully sourced, and Delivered fresh to bring authentic taste and nutrition to your everyday meals. Preserving India's Farming Legacy";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="flex min-h-screen w-full flex-col px-6 pt-14 pb-8 sm:px-12 lg:w-1/2 lg:px-16 lg:pb-10 lg:pt-20 xl:px-24">
        <div className="mx-auto w-full max-w-[454px]">
          <Image
            src="/veda-bharat-logo.png"
            alt="Veda Bharath"
            width={200}
            height={80}
            priority
            className="h-14 w-auto"
          />
        </div>

        <div className="mx-auto mt-8 w-full max-w-[454px] lg:mt-10">
          {children}
        </div>

        <div className="mx-auto mb-5 mt-auto flex w-full max-w-[454px] items-center justify-center gap-2 pt-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#006D3A]" strokeWidth={2} />
          <p className="text-center text-xs leading-4 text-[#3D4949]/80">
            Secured by{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#F9A51A] hover:text-[#e6960f]"
            >
              TechGy Link
            </a>
            . End-to-end encrypted connection.
          </p>
        </div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/login/right-banner.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center px-10 xl:px-16">
          <div className="relative w-full max-w-[412px]">
            <div className="flex min-h-[460px] items-center rounded-[46px] border border-white/20 bg-white/20 p-9 backdrop-blur-md xl:min-h-[560px]">
              <p className="max-w-[300px] text-left text-[28px] font-bold leading-[1.4] text-white xl:max-w-[320px] xl:text-[36px] xl:leading-[1.35]">
                {QUOTE}
              </p>
            </div>
            <div className="absolute bottom-16 -right-[39.5px] flex h-[79px] w-[79px] -rotate-1 items-center justify-center rounded-full bg-white">
              <Image
                src="/login/banner-frame.png"
                alt=""
                width={52}
                height={52}
                className="h-13 w-13"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
