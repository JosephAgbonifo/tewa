import Link from "next/link";

export default function PostNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
      <h1 className="font-playfair text-3xl font-bold text-tewa-black">
        Story not found
      </h1>
      <p className="text-text-dark/70">
        The post you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-2 bg-purple px-6 py-3 text-sm font-semibold tracking-wider text-white hover:bg-gold hover:text-tewa-black transition-colors"
      >
        BACK TO HOME
      </Link>
    </main>
  );
}
