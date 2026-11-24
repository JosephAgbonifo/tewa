import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/post";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

export default function Footer({
  recent,
  popular,
}: {
  recent: Post[];
  popular: Post[];
}) {
  return (
    <footer className="bg-tewa-black py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-3">
        <div>
          <Image src="/tewa.png" alt="Tewa" width={140} height={40} />
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            Mauris elementum accumsan leo vel tempor. Sit amet cursus nisl
            aliquam.
          </p>
          <div className="mt-6 flex gap-4 text-white/70">
            <Facebook className="h-5 w-5 hover:text-gold cursor-pointer" />
            <Twitter className="h-5 w-5 hover:text-gold cursor-pointer" />
            <Youtube className="h-5 w-5 hover:text-gold cursor-pointer" />
            <Instagram className="h-5 w-5 hover:text-gold cursor-pointer" />
          </div>
        </div>

        <div>
          <h3 className="font-playfair text-lg font-bold tracking-wide">
            RECENT POSTS
          </h3>
          <div className="mt-5 flex flex-col gap-4">
            {recent.map((post) => (
              <Link
                href={`/post/${post.slug}`}
                key={post.id}
                className="flex items-center gap-4 group"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-white/80 leading-snug group-hover:text-gold transition-colors">
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-playfair text-lg font-bold tracking-wide">
            POPULAR POSTS
          </h3>
          <div className="mt-5 flex flex-col gap-4">
            {popular.map((post) => (
              <Link
                href={`/post/${post.slug}`}
                key={post.id}
                className="flex items-center gap-4 group"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-white/80 leading-snug group-hover:text-gold transition-colors">
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Tewa. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <Link href="/advertisement" className="hover:text-gold">
            Advertisement
          </Link>
          <Link href="/contact" className="hover:text-gold">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
