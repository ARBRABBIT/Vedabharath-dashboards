"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SuperAdminNavbar } from "@/components/dashboard/SuperAdminNavbar";
import { ModalShell } from "@/components/orders/modals/ModalShell";
import { SaveDraftModal } from "@/components/super-admin/content/SaveDraftModal";
import { BLOGS, type BlogStatus } from "@/components/super-admin/content/contentData";

const STATUS_CYCLE: BlogStatus[] = ["Draft", "Scheduled", "Published"];
const STATUS_DOT: Record<BlogStatus, string> = {
  Draft: "text-[#3B82F6]",
  Scheduled: "text-[#F7931E]",
  Published: "text-[#22C55E]",
};

type Section = { id: string; title: string; body: string };

const DEFAULT_SECTIONS: Section[] = [
  {
    id: "s1",
    title: "The Roots of Natural Farming",
    body: "At Veda Bharath, we believe that the earth provides everything we need to thrive if we treat it with respect. Our commitment to natural farming isn't just about avoiding chemicals; it's about restoring the delicate balance of soil microbiomes and traditional wisdom.",
  },
];

const INTRO_PARAGRAPHS = [
  "At Veda Bharath, supporting farmers goes far beyond buying their produce. Our mission is built on a foundation of regenerative agriculture and communal trust. We believe that by providing the right infrastructure, direct market access, and educational resources, we can empower natural farming communities across the country to thrive in a global economy.",
];

export default function BlogManagementPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const existing = BLOGS.find((blog) => blog.id === params.id);

  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [saveDraftOpen, setSaveDraftOpen] = useState(false);
  const [postStatus, setPostStatus] = useState<BlogStatus>(existing?.status ?? "Draft");
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [postHeading, setPostHeading] = useState(
    existing
      ? "Exploring the deep-rooted connections between Vedic wisdom and modern regenerative agriculture at Veda Bharath."
      : "",
  );
  const [subHeading, setSubHeading] = useState(
    existing
      ? "Exploring the deep-rooted connections between Vedic wisdom and modern regenerative agriculture at Veda Bharath."
      : "",
  );
  const [tags, setTags] = useState(existing ? existing.tags.map((tag) => tag.replace("#", "")) : []);
  const [tagInput, setTagInput] = useState("");
  const [sections, setSections] = useState(
    existing ? DEFAULT_SECTIONS : [{ id: "s1", title: "", body: "" }],
  );
  const [author, setAuthor] = useState("VedaBharat Natural Food Products Pvt Ltd");
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const publishedDate = existing && existing.publishedDate !== "—" ? existing.publishedDate : "May 02, 2026";
  const heroGradient = existing?.gradient ?? "linear-gradient(135deg, #2E4A2A 0%, #6B8A4A 55%, #C9D9A8 100%)";

  function addTag() {
    const value = tagInput.trim().toUpperCase().replace(/\s+/g, "");
    if (!value || tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, value]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((item) => item !== tag));
  }

  function handleHeroImageSelect(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setHeroImage(URL.createObjectURL(file));
  }

  function moveSection(index: number, direction: -1 | 1) {
    setSections((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeSection(id: string) {
    setSections((prev) => prev.filter((section) => section.id !== id));
  }

  function addSection() {
    setSections((prev) => [...prev, { id: `s${prev.length + 1}-${Date.now()}`, title: "New Section", body: "" }]);
  }

  if (mode === "preview") {
    return (
      <div className="flex min-h-screen w-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4 sm:px-10 lg:px-16">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Preview
          </button>
          <button
            type="button"
            onClick={() => {
              setPostStatus("Published");
              setPublishConfirmOpen(true);
            }}
            className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Publish
          </button>
        </div>

        <ModalShell open={publishConfirmOpen} onClose={() => setPublishConfirmOpen(false)} maxWidth="max-w-[420px]">
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
              >
                <Check className="h-7 w-7 text-[#22C55E]" strokeWidth={3} />
              </motion.div>
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-black">Blog Published Successfully</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                <span className="font-semibold text-black">{title}</span> is now live on the website.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/super-admin/site-content")}
              className="mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Done
            </button>
          </div>
        </ModalShell>

        <div
          className="relative h-[420px] w-full bg-cover bg-center"
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : { backgroundImage: heroGradient }}
        >
          <button
            type="button"
            onClick={() => heroInputRef.current?.click()}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
          >
            <ImagePlus className="h-4 w-4" strokeWidth={2} />
            Replace Hero Image
          </button>
        </div>

        <div className="mx-auto w-full max-w-[760px] px-6 py-10">
          <h1 className="text-4xl font-bold leading-tight text-black">{title}</h1>
          <p className="mt-3 text-sm text-[#6B7280]">
            By <span className="font-semibold text-black">{author}</span> • {publishedDate}
          </p>
          {existing && INTRO_PARAGRAPHS.map((paragraph, index) => (
            <p key={index} className="mt-5 text-base leading-relaxed text-[#374151]">
              {paragraph}
            </p>
          ))}
          {sections.map((section) => (
            <div key={section.id} className="mt-6">
              <h2 className="text-xl font-bold text-black">{section.title}</h2>
              <p className="mt-2 text-base leading-relaxed text-[#374151]">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F7]">
      <SuperAdminNavbar />

      <main className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.push("/super-admin/site-content")}
            aria-label="Back"
            className="mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-black">Blog Management</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Manage articles, tags, and publications</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div
              className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-cover bg-center"
              style={heroImage ? { backgroundImage: `url(${heroImage})` } : { backgroundImage: heroGradient }}
            >
              <button
                type="button"
                onClick={() =>
                  setPostStatus((prev) => STATUS_CYCLE[(STATUS_CYCLE.indexOf(prev) + 1) % STATUS_CYCLE.length])
                }
                className={`absolute left-4 top-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold hover:bg-[#F9FAFB] ${STATUS_DOT[postStatus]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[postStatus].replace("text-", "bg-")}`} />
                {postStatus.toUpperCase()}
                <Pencil className="h-3 w-3 text-[#6B7280]" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => heroInputRef.current?.click()}
                className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
              >
                <ImagePlus className="h-4 w-4" strokeWidth={2} />
                Replace Hero Image
              </button>
              <input
                ref={heroInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleHeroImageSelect(event.target.files)}
              />
            </div>

            <textarea
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              rows={2}
              placeholder="Add your blog title..."
              className="mt-5 w-full resize-none border-none bg-transparent text-3xl font-bold leading-tight text-black outline-none placeholder:text-[#D1D5DB]"
            />
            <p className="mt-2 text-sm text-[#6B7280]">
              By <span className="font-semibold text-black">{author}</span> • {publishedDate}
            </p>

            {existing && INTRO_PARAGRAPHS.map((paragraph, index) => (
              <p key={index} className="mt-4 text-sm leading-relaxed text-[#374151]">
                {paragraph}
              </p>
            ))}

            <div className="mt-6 flex flex-col gap-6">
              {sections.map((section, index) => (
                <div key={section.id} className="flex items-start gap-3">
                  <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => moveSection(index, -1)}
                      className="cursor-pointer text-[#9CA3AF] hover:text-black disabled:opacity-30"
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, 1)}
                      className="cursor-pointer text-[#9CA3AF] hover:text-black disabled:opacity-30"
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="cursor-pointer text-[#EF4444] hover:opacity-70"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="flex-1 rounded-2xl border-2 border-[#22C55E]/40 p-5">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(event) =>
                        setSections((prev) =>
                          prev.map((item) => (item.id === section.id ? { ...item, title: event.target.value } : item)),
                        )
                      }
                      placeholder="Section title..."
                      className="w-full border-none bg-transparent text-lg font-bold text-black outline-none placeholder:text-[#9CA3AF]"
                    />
                    {section.body && <p className="mt-2 text-sm leading-relaxed text-[#374151]">{section.body}</p>}
                    <textarea
                      placeholder="Continue writing here..."
                      rows={1}
                      className="mt-2 w-full resize-none border-none bg-transparent text-sm text-[#9CA3AF] outline-none"
                    />

                    <div className="mt-4 flex h-[100px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#BBE5C4] bg-[#F0FDF4] text-[#6B7280] transition-colors hover:bg-[#E6FBEA]">
                      <ImagePlus className="h-4 w-4" strokeWidth={2} />
                      <span className="text-xs font-medium">Add section image (Optional)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSection}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 border-t border-dashed border-[#E5E7EB] pt-6 text-sm font-bold text-[#F7931E] hover:text-[#e07f0e]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add New Section
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Post Heading</p>
              <textarea
                value={postHeading}
                onChange={(event) => setPostHeading(event.target.value)}
                rows={4}
                placeholder="Write a short heading for this post..."
                className="mt-2 w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-sm text-black outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
              />
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Sub Heading</p>
              <textarea
                value={subHeading}
                onChange={(event) => setSubHeading(event.target.value)}
                rows={4}
                placeholder="Write a supporting sub heading..."
                className="mt-2 w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-sm text-black outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
              />
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Tags</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#374151]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                      className="cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]"
                    >
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Write a tag and press Enter"
                  className="w-full rounded-full border border-[#E5E7EB] px-3 py-1.5 text-xs outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="shrink-0 cursor-pointer rounded-full border border-dashed border-[#F7931E] px-3 py-1.5 text-xs font-semibold text-[#F7931E] hover:bg-[#FEF3E2]"
                >
                  + ADD
                </button>
              </div>

              <div className="mt-4 border-t border-[#F3F4F6] pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Published By</p>
                <input
                  type="text"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold text-black outline-none focus:border-[#F7931E]"
                />
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Published Date</p>
                <p className="mt-1 text-sm font-semibold text-black">{publishedDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6">
              <button
                type="button"
                onClick={() => setSaveDraftOpen(true)}
                className="cursor-pointer text-sm font-semibold text-[#374151] hover:text-black"
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setMode("preview")}
                className="cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </main>

      <SaveDraftModal
        open={saveDraftOpen}
        onKeepEditing={() => setSaveDraftOpen(false)}
        onSaveAsDraft={() => {
          setPostStatus("Draft");
          router.push("/super-admin/site-content?tab=Drafts");
        }}
      />
    </div>
  );
}
