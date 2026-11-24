import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/format-date";

export default function PostCardHorizontal({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group grid grid-cols-[160px_1fr] gap-6 md:grid-cols-[220px_1fr]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div>
        <h3 className="font-playfair text-xl font-semibold leading-snug text-tewa-black group-hover:text-purple transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-text-dark/70">
            {post.excerpt}
          </p>
        )}
        <p className="mt-3 text-sm text-text-dark/60">
          <span className="font-semibold text-tewa-black">{post.author}</span>{" "}
          &middot; POSTED ON {formatDate(post.date).toUpperCase()}
        </p>
      </div>
    </Link>
  );
}
