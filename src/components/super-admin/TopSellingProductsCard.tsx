import Image from "next/image";
import Link from "next/link";

const PRODUCTS = [
  { name: "Navara Rice 5Kg", orders: 1850 },
  { name: "Navara Rice 5Kg", orders: 1102 },
  { name: "Navara Rice 5Kg", orders: 209 },
  { name: "Navara Rice 5Kg", orders: 156 },
  { name: "Navara Rice 5Kg", orders: 98 },
];

export function TopSellingProductsCard() {
  return (
    <div className="relative flex h-[380px] flex-1 flex-col overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-black">Top Selling Products</h3>
        </div>
        <Link
          href="/super-admin/products"
          className="shrink-0 cursor-pointer text-xs text-[#6B7280] hover:text-black"
        >
          View All
        </Link>
      </div>

      <div className="relative z-10 mt-5 flex flex-1 flex-col gap-4 scrollbar-hide overflow-y-auto pr-1">
        {PRODUCTS.map((product, index) => (
          <div key={`${product.name}-${index}`} className="flex shrink-0 items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#F5F5F7]">
              <Image
                src="/Warehouse/product.png"
                alt=""
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-black">{product.name}</p>
              <p className="text-xs text-[#9CA3AF]">{product.orders} Orders</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[330px] w-[360px] sm:block">
        <Image
          src="/SuperAdmin/Dashboard/image%20400.png"
          alt=""
          fill
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}
