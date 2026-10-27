export type OrderStatus = "To Be Packed" | "Ship" | "Exception" | "Delivered" | "Returned";

export type OrderItem = {
  name: string;
  variant: string;
  price: number;
  qty: number;
  outOfStock?: boolean;
  batch?: string;
  damaged?: boolean;
};

export type Order = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  warehouse?: string;
  amount: number;
  shipping: number;
  paymentMethod: string;
  status: OrderStatus;
  placedAt: string;
  daysAgo: number;
  items: OrderItem[];
};

const STANDARD_ITEMS: OrderItem[] = [
  { name: "Heritage Ponni", variant: "5kg Pack", price: 850, qty: 1 },
  { name: "Dudeshwar", variant: "1kg Pack", price: 350, qty: 1 },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "VB-8492",
    customer: "Priya Patel",
    phone: "+91 98765 43210",
    email: "priya.patel@email.com",
    address: "42, Greenfield Residency, Block C, Whitefield, Bengaluru, Karnataka, 560066",
    warehouse: "Whitefield Distribution Hub",
    amount: 1200,
    shipping: 50,
    paymentMethod: "UPI Payment",
    status: "Exception",
    placedAt: "Today, 10:45 AM",
    daysAgo: 0,
    items: [
      { name: "Navara Rice", variant: "1kg • Heritage Collection", price: 450, qty: 1 },
      { name: "Bahurupi Rice", variant: "2kg", price: 750, qty: 1, outOfStock: true },
    ],
  },
  {
    id: "VB-8491",
    customer: "Karthik Suraj",
    phone: "+91 87654 32109",
    email: "karthik.suraj@email.com",
    address: "42, Greenfield Residency, Block C, Whitefield, Bengaluru, Karnataka, 560066",
    warehouse: "Whitefield Distribution Hub",
    amount: 2450,
    shipping: 50,
    paymentMethod: "Net Banking",
    status: "Exception",
    placedAt: "Today, 09:12 AM",
    daysAgo: 0,
    items: STANDARD_ITEMS,
  },
  {
    id: "VB-8490",
    customer: "Sneha Desai",
    phone: "+91 98450 12345",
    email: "sneha.desai@email.com",
    address: "402, Lotus Apartment, 12th Main Road, HAL 2nd Stage, Indiranagar, Bangalore - 560038",
    warehouse: "Indiranagar Distribution Hub",
    amount: 450,
    shipping: 40,
    paymentMethod: "COD",
    status: "Exception",
    placedAt: "Yesterday, 06:30 PM",
    daysAgo: 1,
    items: [{ name: "Rakthashali Rice", variant: "1kg", price: 450, qty: 1, outOfStock: true }],
  },
  {
    id: "VB-8489",
    customer: "Rahul Sharma",
    phone: "+91 76543 21098",
    email: "rahul.sharma@email.com",
    address: "HSR Layout, Sector 2, Bengaluru, Karnataka - 560102",
    warehouse: "HSR Layout Distribution Hub",
    amount: 1800,
    shipping: 50,
    paymentMethod: "UPI Payment",
    status: "Exception",
    placedAt: "Yesterday, 04:15 PM",
    daysAgo: 1,
    items: STANDARD_ITEMS,
  },
  {
    id: "VB-8488",
    customer: "Anita Reddy",
    phone: "+91 94321 09876",
    email: "anita.reddy@email.com",
    address: "Koramangala 5th Block, Bengaluru, Karnataka - 560095",
    warehouse: "Kukatpally Distribution Hub",
    amount: 3200,
    shipping: 50,
    paymentMethod: "Card Payment",
    status: "Exception",
    placedAt: "Yesterday, 11:00 AM",
    daysAgo: 1,
    items: STANDARD_ITEMS,
  },
  {
    id: "VB-8485",
    customer: "Rahul Verma",
    phone: "+91 76543 21098",
    email: "rahul.verma@email.com",
    address: "42, Greenfield Residency, Block C, Whitefield, Bengaluru, Karnataka, 560066",
    warehouse: "Whitefield Distribution Hub",
    amount: 1820,
    shipping: 50,
    paymentMethod: "Prepaid (UPI)",
    status: "Delivered",
    placedAt: "May 18, 2026 at 02:30 PM",
    daysAgo: 86,
    items: STANDARD_ITEMS,
  },
  {
    id: "VB-8480",
    customer: "Karthik Suraj",
    phone: "+91 98765 43210",
    email: "karthik.suraj@email.com",
    address: "Flat 402, Green Meadows, HSR Layout, Sector 2, Bangalore, Karnataka - 560102",
    warehouse: "HSR Layout Distribution Hub",
    amount: 1200,
    shipping: 50,
    paymentMethod: "Prepaid (UPI)",
    status: "Returned",
    placedAt: "2 days ago",
    daysAgo: 2,
    items: [
      { name: "Heritage Ponni Rice", variant: "5kg", price: 850, qty: 2, batch: "HP-2023-08", damaged: true },
      { name: "Dudeshwar Rice", variant: "2kg", price: 350, qty: 1, batch: "DR-2023-11", damaged: true },
    ],
  },
  {
    id: "VB-8479",
    customer: "Meera Nair",
    phone: "+91 98450 12345",
    email: "meera.nair@email.com",
    address: "Jubilee Hills, Road No. 36, Hyderabad, Telangana - 500033",
    warehouse: "Gachibowli Distribution Hub",
    amount: 950,
    shipping: 40,
    paymentMethod: "COD",
    status: "To Be Packed",
    placedAt: "Today at 10:30 AM",
    daysAgo: 0,
    items: [{ name: "Navara Rice", variant: "1kg Pack", price: 950, qty: 2, batch: "VB-NAV-26" }],
  },
  {
    id: "VB-8478",
    customer: "Arjun Rao",
    phone: "+91 90123 45671",
    email: "arjun.rao@email.com",
    address: "Flat 402, Lotus Apartments, 7th Cross, Indiranagar, Bengaluru, KA 560038",
    warehouse: "Indiranagar Distribution Hub",
    amount: 1650,
    shipping: 50,
    paymentMethod: "Prepaid (UPI)",
    status: "Ship",
    placedAt: "Today at 08:15 AM",
    daysAgo: 0,
    items: STANDARD_ITEMS,
  },
];

export function statusPillClasses(status: OrderStatus) {
  if (status === "Delivered") return "bg-[#EFF6FF] text-[#3B82F6]";
  if (status === "Exception") return "bg-[#FEF3E2] text-[#F7931E]";
  if (status === "Returned") return "bg-[#FEE2E2] text-[#EF4444]";
  return "bg-[#EBF7EC] text-[#22C55E]";
}
