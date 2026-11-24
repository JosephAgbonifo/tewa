import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostHeader from "@/components/post/post-header";
import PostBody from "@/components/post/post-body";
import RelatedPosts from "@/components/post/related-posts";
import AdBanner from "@/components/ui/ad-banner";
import SubscribeBox from "@/components/home/sidebar/subscribe-box";
import PopularPosts from "@/components/home/sidebar/popular-posts";
import Footer from "@/components/general/footer";
import { mockAds } from "@/lib/mock-posts";
import {
  getPostBySlug,
  getPostsByCategory,
  getPopularPosts,
  getLatestPosts,
  getAllPostSlugs,
} from "@/lib/api/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [relatedRes, popular, recent] = await Promise.all([
    getPostsByCategory(post.category.toLowerCase(), 3),
    getPopularPosts(3),
    getLatestPosts(3),
  ]);

  return (
    <main className="bg-cream">
      <PostHeader post={post} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 bg-white px-6 lg:grid-cols-[1fr_340px]">
        <div>
          <PostBody post={post} />
          <RelatedPosts
            posts={relatedRes.posts.filter((p) => p.slug !== post.slug)}
          />
        </div>

        <aside className="flex flex-col gap-10 py-10">
          <AdBanner ad={mockAds[1]} />
          <SubscribeBox />
          <PopularPosts posts={popular} />
        </aside>
      </div>

      <Footer recent={recent} popular={popular} />
    </main>
  );
}
