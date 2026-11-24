import Link from "next/link";
import { getCategories } from "@/lib/api/posts";

export default async function CategoryIndexPage() {
  const categories = await getCategories();

  return (
    <main className="bg-cream">
      <div className="bg-tewa-black py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-playfair text-3xl font-bold text-white md:text-4xl">
            All Categories
          </h1>
          <p className="mt-2 text-white/60">Browse stories by category</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14">
        {categories.length === 0 ? (
          <p className="text-sm text-text-dark/50">No categories yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group border border-tewa-black/10 bg-white p-8 transition-colors hover:border-purple"
              >
                <h2 className="font-playfair text-xl font-bold text-tewa-black group-hover:text-purple transition-colors">
                  {cat.name}
                </h2>
                <p className="mt-2 text-sm text-text-dark/50">
                  {cat.posts_count ?? 0} stories
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
