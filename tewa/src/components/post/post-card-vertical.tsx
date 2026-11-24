import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/format-date";

export default function PostCardVertical({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 font-playfair text-lg font-semibold leading-snug text-tewa-black group-hover:text-purple transition-colors">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-text-dark/60">
        {post.author} &middot; {formatDate(post.date)}
      </p>
    </Link>
  );
}
