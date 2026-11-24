import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/types/post";

export default function AdBanner({ ad }: { ad: AdSlot }) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <span className="text-xs tracking-widest text-text-dark/40">
        - Advertisement -
      </span>
      <Link href={ad.href} className="block w-[80%]">
        <div className="relative aspect-[728/200] w-full overflow-hidden bg-tewa-black/5">
          <Image
            src={ad.image}
            alt={ad.label ?? "Advertisement"}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </Link>
    </div>
  );
}
