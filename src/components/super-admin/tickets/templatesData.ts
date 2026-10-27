export type ReplyTemplate = {
  id: string;
  category: "Order Issues" | "Payment" | "Logistics" | "General";
  title: string;
  preview: string;
};

export const TEMPLATE_CATEGORIES: Array<ReplyTemplate["category"]> = [
  "Order Issues",
  "Payment",
  "Logistics",
  "General",
];

export const TEMPLATES: ReplyTemplate[] = [
  {
    id: "t1",
    category: "Order Issues",
    title: "Broken Seal / Damaged Product",
    preview:
      "Hi [Name], we're sorry to hear about the damaged packaging. Our quality control team has been notified, and we...",
  },
  {
    id: "t2",
    category: "Order Issues",
    title: "Wrong Item Received",
    preview:
      "Dear Customer, it appears there was a mix-up in our fulfillment center. We are initiating a free exchange for the correct",
  },
  {
    id: "t3",
    category: "Order Issues",
    title: "Missing Item in Order",
    preview:
      "We sincerely apologize for the missing item in your recent shipment. We have two options: we can ship the missing...",
  },
  {
    id: "t4",
    category: "Order Issues",
    title: "Quality Concern",
    preview:
      "Thank you for bringing this quality issue to our attention. To better understand the situation, could you please provide a",
  },
  {
    id: "t5",
    category: "Order Issues",
    title: "Expired Item Report",
    preview:
      "We are extremely concerned to hear about an expired product. Our safety protocols are being reviewed. Please do",
  },
  {
    id: "t6",
    category: "Order Issues",
    title: "Packaging Feedback",
    preview:
      "Thank you for sharing your thoughts on our eco-friendly packaging. We are constantly striving to improve the...",
  },
  {
    id: "t7",
    category: "Order Issues",
    title: "Order Cancellation Request",
    preview: "We've received your cancellation request and processed it. Your refund will reflect within 5-7 business days.",
  },
  {
    id: "t8",
    category: "Order Issues",
    title: "Duplicate Order Placed",
    preview: "We noticed two orders were placed close together. We've cancelled the duplicate and refunded it in full.",
  },
  {
    id: "p1",
    category: "Payment",
    title: "Refund Not Received",
    preview: "We're sorry for the delay. Your refund has been processed and should reflect within 5-7 business days.",
  },
  {
    id: "p2",
    category: "Payment",
    title: "Duplicate Charge",
    preview: "We've confirmed the duplicate charge and initiated a reversal. It should reflect in your statement shortly.",
  },
  {
    id: "p3",
    category: "Payment",
    title: "Coupon Not Applying",
    preview: "Thanks for flagging this. We've verified the coupon and it has been manually applied to your order.",
  },
  {
    id: "p4",
    category: "Payment",
    title: "Invoice Request",
    preview: "Please find your GST invoice attached. Let us know if you need it in a different format.",
  },
  {
    id: "l1",
    category: "Logistics",
    title: "Delivery Delay",
    preview: "We apologize for the delay. Your order is with our courier partner and should arrive within 2 business days.",
  },
  {
    id: "l2",
    category: "Logistics",
    title: "Wrong Address Used",
    preview: "We're sorry about this. We've flagged the courier and are arranging a re-delivery to your correct address.",
  },
  {
    id: "l3",
    category: "Logistics",
    title: "Package Not Received",
    preview: "We've raised an investigation with our courier partner and will update you within 24 hours.",
  },
  {
    id: "l4",
    category: "Logistics",
    title: "Tracking Not Updating",
    preview: "Apologies for the inconvenience. Tracking data can lag — we've confirmed your order is moving as expected.",
  },
  {
    id: "l5",
    category: "Logistics",
    title: "Change Delivery Address",
    preview: "We've updated your delivery address for this order. Please note this may add 1-2 days to delivery.",
  },
  {
    id: "l6",
    category: "Logistics",
    title: "Reschedule Delivery",
    preview: "Your delivery has been rescheduled as requested. You'll receive an updated tracking link shortly.",
  },
  {
    id: "g1",
    category: "General",
    title: "Thank You for Feedback",
    preview: "Thank you for taking the time to share your feedback — it genuinely helps us improve.",
  },
  {
    id: "g2",
    category: "General",
    title: "Escalation Acknowledgement",
    preview: "We've escalated your concern to our senior support team and will follow up within 24 hours.",
  },
  {
    id: "g3",
    category: "General",
    title: "Account Update Confirmation",
    preview: "Your account details have been updated successfully. Let us know if anything looks incorrect.",
  },
  {
    id: "g4",
    category: "General",
    title: "Bulk Order Inquiry",
    preview: "Thanks for your interest in a bulk order. Our team will reach out with pricing within one business day.",
  },
  {
    id: "g5",
    category: "General",
    title: "Subscription Pause Request",
    preview: "Your subscription has been paused as requested. You can resume it anytime from your account settings.",
  },
  {
    id: "g6",
    category: "General",
    title: "General Apology",
    preview: "We're sorry for the inconvenience caused. We're looking into this and will get back to you shortly.",
  },
];
