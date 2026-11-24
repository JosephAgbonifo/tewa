import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";

export default function PopularPosts({ posts }: { posts: Post[] }) {
  return (
    <div>
      <h3 className="border-b border-tewa-black/10 pb-3 font-playfair text-lg font-bold text-tewa-black">
        POPULAR POSTS
      </h3>
      <div className="mt-5 flex flex-col gap-5">
        {posts.map((post, i) => (
          <Link
            href={`/post/${post.slug}`}
            key={post.id}
            className="group flex items-center gap-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
              <span className="absolute bottom-0 right-0 grid h-5 w-5 place-items-center bg-purple text-[10px] font-bold text-white">
                {i + 1}
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug text-tewa-black group-hover:text-purple transition-colors">
              {post.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
