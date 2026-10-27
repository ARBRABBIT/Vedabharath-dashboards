export type BlogStatus = "Draft" | "Scheduled" | "Published";

export type Blog = {
  id: string;
  title: string;
  description: string;
  status: BlogStatus;
  meta: string;
  views?: string;
  gradient: string;
  featured?: boolean;
  tags: string[];
  author: string;
  publishedDate: string;
};

export const BLOGS: Blog[] = [
  {
    id: "blog-1",
    title: "The Revival of Heritage Grains: A Journey Back to Nutritional Roots",
    description:
      "Explore how ancient rice varieties like Mysore Malliga are making a comeback in modern kitchens, bringing distinct flavors and unmatched health benefits.",
    status: "Published",
    meta: "1.2K Views",
    views: "1.2K Views",
    gradient: "linear-gradient(135deg, #3B2F1E 0%, #6B4A2B 45%, #E8D9B5 100%)",
    featured: true,
    tags: ["#ANCIENTGRAINS", "#ORGANIC", "#VEDABHARATH"],
    author: "VedaBharat Natural Food Products Pvt Ltd",
    publishedDate: "May 02, 2026",
  },
  {
    id: "blog-2",
    title: "5 Traditional Recipes Using Red Matta Rice",
    description: "Time-tested recipes passed down through generations, reimagined for the modern kitchen.",
    status: "Draft",
    meta: "Last edited 2h ago",
    gradient: "linear-gradient(135deg, #8A4B2C 0%, #C97B3D 100%)",
    tags: ["#RECIPES"],
    author: "Ravi Kumar",
    publishedDate: "—",
  },
  {
    id: "blog-3",
    title: "Understanding the Geographical Indication of Basmati Rice",
    description: "What GI tags mean for farmers, and why they matter for authenticity.",
    status: "Scheduled",
    meta: "Publishes Oct 24, 09:00 AM",
    gradient: "linear-gradient(135deg, #4C6B3F 0%, #A9C97A 60%, #EFE7C2 100%)",
    tags: ["#GI", "#BASMATI"],
    author: "Anjali Patel",
    publishedDate: "Oct 24, 2026",
  },
  {
    id: "blog-4",
    title: "Understanding the Geographical Indication of Basmati Rice",
    description: "A closer look at the certification process and regional farming clusters.",
    status: "Scheduled",
    meta: "Publishes Oct 24, 09:00 AM",
    gradient: "linear-gradient(135deg, #4C6B3F 0%, #A9C97A 60%, #EFE7C2 100%)",
    tags: ["#GI", "#BASMATI"],
    author: "Vikram Singh",
    publishedDate: "Oct 24, 2026",
  },
  {
    id: "blog-5",
    title: "The History of Basmati: A Grain of Legacy",
    description: "Tracing the roots of the world's most fragrant rice, from royal courts to global tables.",
    status: "Draft",
    meta: "Last edited 1d ago",
    gradient: "linear-gradient(135deg, #7A5230 0%, #C79A5B 100%)",
    tags: ["#HISTORY"],
    author: "Neha Kapoor",
    publishedDate: "—",
  },
];

export const ALL_BLOGS: Blog[] = Array.from({ length: 24 }).map((_, index) => {
  const template = BLOGS[index % BLOGS.length];
  return { ...template, id: `blog-${index + 1}`, featured: false };
});

export type BannerStatus = "Live" | "Scheduled";

export type Banner = {
  id: string;
  name: string;
  placement: string;
  status: BannerStatus;
  dateLabel: string;
  clicks: string;
  gradient: string;
};

export const BANNERS: Banner[] = [
  {
    id: "banner-1",
    name: "Monsoon Harvest Hero",
    placement: "Homepage Top",
    status: "Live",
    dateLabel: "Ends: Aug 15",
    clicks: "12.4K",
    gradient: "linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)",
  },
  {
    id: "banner-2",
    name: "Diwali Bundle Promo",
    placement: "Shop Sidebar",
    status: "Scheduled",
    dateLabel: "Starts: Oct 10",
    clicks: "NA",
    gradient: "linear-gradient(135deg, #8A5A2C 0%, #C99257 100%)",
  },
  {
    id: "banner-3",
    name: "Diwali Bundle Promo",
    placement: "Shop Sidebar",
    status: "Scheduled",
    dateLabel: "Starts: Oct 10",
    clicks: "NA",
    gradient: "linear-gradient(135deg, #8A5A2C 0%, #C99257 100%)",
  },
];

export const UPCOMING_EVENTS = [
  { month: "AUG", day: "15", title: "Independence Day Sale" },
  { month: "OCT", day: "10", title: "Dussehra Special" },
  { month: "NOV", day: "01", title: "Winter Collection" },
  { month: "DEC", day: "25", title: "Christmas Sale" },
];

export type ContentDraft = {
  id: string;
  title: string;
  description: string;
  type: "BLOG" | "BANNER";
  author: string;
  lastModifiedDate: string;
  lastModifiedTime: string;
  gradient: string;
};

export const CONTENT_DRAFTS: ContentDraft[] = [
  {
    id: "draft-1",
    title: "How Veda Bharath Truly Stands With Natural Farming",
    description: "Discover how Veda Bharath supports farmers and...",
    type: "BLOG",
    author: "Ravi Kumar",
    lastModifiedDate: "24 Jun 2026",
    lastModifiedTime: "10:30 AM",
    gradient: "linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)",
  },
  {
    id: "draft-2",
    title: "The Benefits of Traditional Rice Varieties",
    description: "Traditional rice varieties are packed with nutrition and...",
    type: "BLOG",
    author: "Anjali Patel",
    lastModifiedDate: "23 Jun 2026",
    lastModifiedTime: "04:20 PM",
    gradient: "linear-gradient(135deg, #7A5230 0%, #C79A5B 100%)",
  },
  {
    id: "draft-3",
    title: "Soil Health: The Foundation of Natural Farming",
    description: "Healthy soil leads to healthy crops. Learn how to improve",
    type: "BLOG",
    author: "Vikram Singh",
    lastModifiedDate: "22 Jun 2026",
    lastModifiedTime: "09:15 AM",
    gradient: "linear-gradient(135deg, #4A3B2C 0%, #8A6B4A 100%)",
  },
  {
    id: "draft-4",
    title: "Natural Farming Techniques for Beginners",
    description: "Simple and effective natural farming techniques anyone...",
    type: "BANNER",
    author: "Neha Kapoor",
    lastModifiedDate: "21 Jun 2026",
    lastModifiedTime: "02:45 PM",
    gradient: "linear-gradient(135deg, #4C6B3F 0%, #A9C97A 100%)",
  },
  {
    id: "draft-5",
    title: "Why Chemical-Free Food Matters for Your Family",
    description: "Chemical-free food ensures better health and a...",
    type: "BANNER",
    author: "Suresh Kumar",
    lastModifiedDate: "20 Jun 2026",
    lastModifiedTime: "11:05 AM",
    gradient: "linear-gradient(135deg, #C9762F 0%, #E8B65A 100%)",
  },
];

export function statusPillClasses(status: BlogStatus | BannerStatus) {
  if (status === "Draft") return "bg-[#EFF6FF] text-[#3B82F6]";
  if (status === "Scheduled") return "bg-[#FEF3E2] text-[#F7931E]";
  return "bg-[#EBF7EC] text-[#22C55E]";
}
