export function deriveEmail(customer: string) {
  const slug = customer.trim().toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).join(".");
  return `${slug}@example.com`;
}

export function batchCode(itemName: string, orderId: string) {
  const initials = itemName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
  const num = orderId.replace(/\D/g, "").slice(-2);
  return `VB-${initials}-${num}`;
}

export function splitVariant(variant: string) {
  const [packSize, price] = variant.split("•").map((part) => part.trim());
  return { packSize: packSize ?? variant, price: price ?? "" };
}

export function maskPhone(phone: string) {
  const match = phone.match(/^(\+\d{1,3})\s?(.*)$/);
  if (!match) return phone;
  const [, code, rest] = match;

  const digits = rest.replace(/\D/g, "");
  const last3 = digits.slice(-3);
  const maskedDigits = "•".repeat(Math.max(digits.length - 3, 0)) + last3;

  const groups = rest.trim().split(/\s+/);
  let cursor = 0;
  const maskedGroups = groups.map((group) => {
    const chunk = maskedDigits.slice(cursor, cursor + group.length);
    cursor += group.length;
    return chunk;
  });

  return `${code} ${maskedGroups.join(" ")}`;
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(local.length, 7));
  return `${visible}***@${domain}`;
}

const TONE_STYLES = {
  blue: "bg-[#E8F0FE] text-[#1A73E8]",
  green: "bg-[#EBF7EC] text-[#3BB54A]",
  orange: "bg-[#FEF3E2] text-[#F7931E]",
  red: "bg-[#FEE2E2] text-[#DC2626]",
} as const;

export type PillTone = keyof typeof TONE_STYLES;

export function pillClasses(tone: PillTone) {
  return `whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${TONE_STYLES[tone]}`;
}

export function placedLabel(time: string) {
  return time.trim().toLowerCase().startsWith("ordered") ? time : `Placed ${time}`;
}

export function transactionId(orderId: string) {
  const digits = orderId.replace(/\D/g, "").padStart(5, "0").slice(-5);
  return `#TXN-${digits}`;
}

export function isCOD(paymentMethod: string) {
  return paymentMethod.toLowerCase().includes("cod");
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ticketId(orderId: string) {
  const digits = orderId.replace(/\D/g, "").padStart(4, "0").slice(-4);
  return `#TKT-${digits}`;
}

export function deliveredOn(orderId: string) {
  const digits = Number(orderId.replace(/\D/g, "").slice(-3)) || 0;
  const date = new Date();
  date.setDate(date.getDate() - ((digits % 5) + 1));
  date.setHours(9 + (digits % 8), (digits % 4) * 15, 0, 0);

  const dateStr = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${dateStr} at ${timeStr}`;
}

export const SECONDARY_BUTTON =
  "cursor-pointer rounded-xl px-6 py-3 text-base font-semibold text-[#64748B] transition-colors hover:bg-[#F5F5F7]";

export const PRIMARY_BUTTON =
  "cursor-pointer rounded-xl bg-[#F7931E] px-8 py-3.5 text-base font-semibold text-white shadow-[0_10px_15px_-3px_rgba(247,147,30,0.2)] transition-colors hover:bg-[#e6850f]";
