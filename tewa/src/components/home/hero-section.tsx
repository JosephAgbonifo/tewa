"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Post } from "@/types/post";

const AUTOPLAY_INTERVAL = 6000;

export default function HeroSection({ posts }: { posts: Post[] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % posts.length);
  }, [posts.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + posts.length) % posts.length);
  }, [posts.length]);

  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next, posts.length]);

  if (posts.length === 0) return null;

  const post = posts[index];

  return (
    <section className="relative grid grid-cols-1 border border-tewa-black/10 md:grid-cols-2">
      <div className="relative aspect-[4/3] md:aspect-auto">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col justify-center gap-6 bg-tewa-black px-8 py-12 md:px-14">
        <span className="inline-block w-fit bg-gold px-4 py-1.5 text-xs font-semibold tracking-wider text-tewa-black">
          TOP NEWS
        </span>

        <Link href={`/post/${post.slug}`}>
          <h1 className="font-playfair text-3xl font-bold leading-tight text-white md:text-4xl hover:text-gold transition-colors">
            {post.title}
          </h1>
        </Link>

        {post.excerpt && (
          <p className="text-white/70 leading-relaxed">{post.excerpt}</p>
        )}

        <div className="border-t border-white/20 pt-6">
          <Link
            href={`/post/${post.slug}`}
            className="text-sm font-semibold tracking-wider text-gold hover:text-white transition-colors"
          >
            CONTINUE READING
          </Link>
        </div>
      </div>

      {posts.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous top story"
            className="absolute left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-tewa-black shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next top story"
            className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-tewa-black shadow-md hover:bg-white transition-colors md:right-[calc(50%+1rem)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:left-1/4">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-gold" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
