"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/format-date";

export default function FeaturedSlideIn({ post }: { post?: Post }) {
  const [mounted, setMounted] = useState(false); // in the DOM
  const [visible, setVisible] = useState(false); // slid into view

  useEffect(() => {
    if (!post) return;

    setMounted(true);
    // small delay so the slide-in animation is noticeable after load
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, [post]);

  const dismiss = () => {
    setVisible(false);
    // unmount after the slide-out finishes
    setTimeout(() => setMounted(false), 500);
  };

  if (!post || !mounted) return null;

  return (
    <aside
      role="complementary"
      aria-label="Featured story"
      className={`fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm
        transform transition-all duration-500 ease-out motion-reduce:transition-none
        ${
          visible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
        }`}
    >
      <div className="relative overflow-hidden rounded-lg border border-black/10 bg-cream shadow-2xl">
        <button
          onClick={dismiss}
          aria-label="Dismiss featured story"
          className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-tewa-black shadow transition hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <Link href={`/post/${post.slug}`} className="group block">
          <div className="relative aspect-[16/9] overflow-hidden bg-black/5">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="384px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple">
              Featured Story
            </span>
            <h3 className="mt-1 font-playfair text-lg font-bold leading-snug text-tewa-black transition-colors group-hover:text-purple">
              {post.title}
            </h3>
            <p className="mt-2 text-xs text-text-dark/60">
              <span className="font-semibold text-tewa-black">
                {post.author}
              </span>{" "}
              &middot; {formatDate(post.date).toUpperCase()}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
