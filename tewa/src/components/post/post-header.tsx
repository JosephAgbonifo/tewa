import Image from "next/image";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/format-date";

export default function PostHeader({ post }: { post: Post }) {
  return (
    <div className="relative flex h-[340px] w-full items-end overflow-hidden md:h-[420px]">
      <Image
        src={post.image}
        alt={post.title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tewa-black via-tewa-black/50 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10">
        <span className="inline-block bg-gold px-4 py-1.5 text-xs font-semibold tracking-wider text-tewa-black">
          {post.category.toUpperCase()}
        </span>

        <h1 className="mt-4 max-w-3xl font-playfair text-3xl font-bold leading-tight text-white md:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-3 max-w-2xl text-base text-white/80 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 text-sm text-white/80">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/20" />
          <span className="font-semibold text-white">{post.author}</span>
          <span className="text-white/50">&middot;</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </div>
  );
}
