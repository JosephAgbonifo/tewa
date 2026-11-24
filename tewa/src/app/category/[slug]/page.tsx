import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PostCardVertical from "@/components/post/post-card-vertical";
import AdBanner from "@/components/ui/ad-banner";
import SubscribeBox from "@/components/home/sidebar/subscribe-box";
import PopularPosts from "@/components/home/sidebar/popular-posts";
import Footer from "@/components/general/footer";
import { mockAds } from "@/lib/mock-posts";
import {
  getCategories,
  getPostsByCategory,
  getPopularPosts,
  getAllPosts,
} from "@/lib/api/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) return { title: "Category not found" };

  return {
    title: `${category.name} — Tewa`,
    description: `Browse the latest ${category.name} stories on Tewa.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const [categoryRes, popular, recentRes] = await Promise.all([
    getPostsByCategory(slug, 9, currentPage),
    getPopularPosts(3),
    getAllPosts(1, 3),
  ]);

  const posts = categoryRes.posts;
  const meta = categoryRes.meta;

  return (
    <main className="bg-cream">
      <div className="bg-tewa-black py-14">
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-block bg-gold px-4 py-1.5 text-xs font-semibold tracking-wider text-tewa-black">
            CATEGORY
          </span>
          <h1 className="mt-4 font-playfair text-3xl font-bold text-white md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 text-white/60">
            {category.posts_count ?? posts.length} stories
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 bg-white px-6 py-10 lg:grid-cols-[1fr_340px]">
        <div>
          {posts.length === 0 ? (
            <p className="text-sm text-text-dark/50">
              No stories in this category yet.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCardVertical post={post} key={post.id} />
                ))}
              </div>

              {meta && meta.last_page > 1 && (
                <div className="mt-10 flex items-center justify-between border-t border-tewa-black/10 pt-6">
                  {meta.current_page > 1 ? (
                    <Link
                      href={`/category/${slug}?page=${meta.current_page - 1}`}
                      className="text-sm font-semibold text-purple hover:text-gold transition-colors"
                    >
                      ← PREVIOUS
                    </Link>
                  ) : (
                    <span />
                  )}

                  <span className="text-sm text-text-dark/50">
                    Page {meta.current_page} of {meta.last_page}
                  </span>

                  {meta.current_page < meta.last_page ? (
                    <Link
                      href={`/category/${slug}?page=${meta.current_page + 1}`}
                      className="text-sm font-semibold text-purple hover:text-gold transition-colors"
                    >
                      NEXT →
                    </Link>
                  ) : (
                    <span />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <aside className="flex flex-col gap-10">
          <AdBanner ad={mockAds[1]} />
          <SubscribeBox />
          <PopularPosts posts={popular} />
        </aside>
      </div>

      <Footer recent={recentRes.posts} popular={popular} />
    </main>
  );
}
