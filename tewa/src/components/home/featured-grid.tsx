import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/format-date";

export default function FeaturedGrid({
  main,
  side,
}: {
  main?: Post;
  side: Post[];
}) {
  if (!main) return null;

  return (
    <section className="py-10">
      <h2 className="mb-6 font-playfair text-xl font-bold tracking-wide text-tewa-black">
        FEATURED STORIES
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Link href={`/post/${main.slug}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={main.image}
              alt={main.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h3 className="mt-5 font-playfair text-2xl font-bold leading-tight text-tewa-black group-hover:text-purple transition-colors md:text-3xl">
            {main.title}
          </h3>
          <p className="mt-2 text-sm text-text-dark/60">
            <span className="font-semibold text-tewa-black">{main.author}</span>{" "}
            &middot; POSTED ON {formatDate(main.date).toUpperCase()}
          </p>
        </Link>

        <div className="grid grid-cols-2 gap-6">
          {side.map((post) => (
            <Link
              href={`/post/${post.slug}`}
              key={post.id}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-3 font-playfair text-base font-semibold leading-snug text-tewa-black group-hover:text-purple transition-colors">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
