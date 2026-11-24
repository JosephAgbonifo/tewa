"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { adminCreateFeatured } from "@/lib/api/featured";
import { compressImage } from "@/lib/compress-image";

const MAX_IMAGES = 3;
const inputCls =
  "w-full border border-tewa-black/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple";

export default function FeaturedForm() {
  const router = useRouter();
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const previews = useMemo(
    () => images.map((f) => URL.createObjectURL(f)),
    [images]
  );
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const addTitle = () => {
    const t = titleInput.trim();
    if (t && !titles.includes(t)) setTitles((prev) => [...prev, t]);
    setTitleInput("");
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    setCompressing(true);
    try {
      const compressed = await Promise.all(picked.map((f) => compressImage(f)));
      setImages((prev) => [...prev, ...compressed].slice(0, MAX_IMAGES));
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // include a title still sitting in the input
    const finalTitles = titleInput.trim()
      ? [...titles, titleInput.trim()]
      : titles;

    if (finalTitles.length === 0) return setError("Add at least one title.");
    if (images.length === 0) return setError("Add at least one image.");

    setSubmitting(true);
    setError("");
    try {
      await adminCreateFeatured(token, {
        name: name.trim(),
        social_url: socialUrl.trim(),
        titles: finalTitles,
        images,
      });
      router.push("/admin/featured");
    } catch {
      setError(
        "Failed to save. Check the fields and image sizes (max 5MB each)."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      <div>
        <label className="mb-1.5 block text-sm font-semibold">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Titles held
        </label>
        <input
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // don't submit the form
              addTitle();
            }
          }}
          placeholder="Type a title and press Enter"
          className={inputCls}
        />
        {titles.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {titles.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 bg-purple/10 px-3 py-1 text-xs text-purple"
              >
                {t}
                <button
                  type="button"
                  onClick={() =>
                    setTitles((prev) => prev.filter((x) => x !== t))
                  }
                  aria-label={`Remove ${t}`}
                  className="font-bold hover:text-red-600"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Social media / bio link
        </label>
        <input
          required
          type="url"
          value={socialUrl}
          onChange={(e) => setSocialUrl(e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Images ({images.length}/{MAX_IMAGES}, at least 1)
        </label>
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
            <div
              key={src}
              className="relative h-28 w-28 overflow-hidden bg-cream"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() =>
                  setImages((prev) => prev.filter((_, idx) => idx !== i))
                }
                aria-label="Remove image"
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="grid h-28 w-28 cursor-pointer place-items-center border border-dashed border-tewa-black/30 text-xs text-tewa-black/60 hover:border-purple hover:text-purple">
              {compressing ? "Optimizing…" : "+ Add"}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={compressing}
                onChange={handleFiles}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="mt-2 text-xs text-text-dark/50">
          The first image is the main one shown in the frame and the strip.
          Images are resized and compressed automatically.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || compressing}
        className="w-fit bg-purple px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black disabled:opacity-50"
      >
        {submitting ? "SAVING…" : "PUBLISH FEATURE"}
      </button>
    </form>
  );
}
