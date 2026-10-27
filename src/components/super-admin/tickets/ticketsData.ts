export type SupportTicket = {
  id: string;
  category: "BILLING" | "TECHNICAL" | "PACKING" | "DELIVERY";
  priority: "Urgent" | "Medium" | "Low";
  customer: string;
  order: string;
  subject: string;
  message: string;
  time: string;
};

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TKT-0204",
    category: "BILLING",
    priority: "Urgent",
    customer: "Rajesh Khanna",
    order: "VB-8492",
    subject: "Account billing mismatch on latest subscription renewal invoice. Customer claims double...",
    message:
      "Hello team, I received my order today but one of the rice packs has a broken seal. There's some spillage in the delivery box. Please let me know how to proceed with a replacement.",
    time: "Today, 10:15 AM",
  },
  {
    id: "TKT-0377",
    category: "TECHNICAL",
    priority: "Urgent",
    customer: "Amit Sharma",
    order: "VB-8511",
    subject: "App crashes when attempting to sync with the smart gateway. Reinstalling doesn't fix",
    message:
      "The app keeps crashing whenever I try to track my order live. I've reinstalled it twice and cleared the cache but it still happens.",
    time: "Today, 09:40 AM",
  },
  {
    id: "TKT-0388",
    category: "PACKING",
    priority: "Urgent",
    customer: "Sneha Kapoor",
    order: "VB-8523",
    subject: "Account billing mismatch on latest subscription renewal invoice. Customer claims double...",
    message:
      "My order arrived with the wrong packaging label attached to another customer's order. Please verify what was actually shipped to me.",
    time: "Today, 08:55 AM",
  },
  {
    id: "TKT-0392",
    category: "DELIVERY",
    priority: "Medium",
    customer: "Divya Krishnan",
    order: "VB-8535",
    subject: "Delivery delay of 3 days beyond the promised window with no courier update",
    message:
      "My order status has been showing 'out for delivery' for the past 3 days with no movement. Please check with the courier partner.",
    time: "Yesterday, 06:20 PM",
  },
  {
    id: "TKT-0401",
    category: "BILLING",
    priority: "Medium",
    customer: "Karthik Iyer",
    order: "VB-8544",
    subject: "Refund not credited even after 7 business days of approval",
    message:
      "I was told the refund would reflect in 5-7 business days but it has been 9 days and I still don't see it in my account.",
    time: "Yesterday, 03:10 PM",
  },
  {
    id: "TKT-0409",
    category: "TECHNICAL",
    priority: "Low",
    customer: "Meera Nair",
    order: "VB-8550",
    subject: "Unable to apply coupon code FESTIVE20 at checkout, shows invalid",
    message:
      "The coupon FESTIVE20 keeps showing as invalid even though the banner says it's valid until this weekend.",
    time: "2 days ago",
  },
  {
    id: "TKT-0415",
    category: "PACKING",
    priority: "Low",
    customer: "Arjun Menon",
    order: "VB-8561",
    subject: "Missing 1kg pouch from a bulk order of 5 items",
    message:
      "I ordered 5 pouches but only received 4 in the box. The packing slip lists 5 items though.",
    time: "3 days ago",
  },
  {
    id: "TKT-0421",
    category: "DELIVERY",
    priority: "Medium",
    customer: "Priya Reddy",
    order: "VB-8572",
    subject: "Wrong delivery address used despite correct address on file",
    message:
      "The order was delivered to an old address even though I updated my address before placing the order.",
    time: "4 days ago",
  },
  {
    id: "TKT-0430",
    category: "BILLING",
    priority: "Low",
    customer: "Vikram Singh",
    order: "VB-8580",
    subject: "GST invoice not generated for the last two orders",
    message: "Could you please share the GST invoices for orders VB-8580 and VB-8579? I need them for reimbursement.",
    time: "5 days ago",
  },
];

export function priorityPillClasses(priority: SupportTicket["priority"]) {
  if (priority === "Urgent") return "bg-[#FEE2E2] text-[#EF4444]";
  if (priority === "Medium") return "bg-[#FEF3E2] text-[#F7931E]";
  return "bg-[#F3F4F6] text-[#6B7280]";
}
