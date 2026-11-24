import HeroSection from "@/components/home/hero-section";
import TrendingTicker from "@/components/home/trending-ticker";
import FeaturedGrid from "@/components/home/featured-grid";
import FeaturedSlideIn from "@/components/home/featured-slide-in";
import LatestNews from "@/components/home/latest-news";
import MoreStories from "@/components/home/more-stories";
import NewsletterCta from "@/components/general/newsletter-cta";
import Footer from "@/components/general/footer";
import AdBanner from "@/components/ui/ad-banner";
import BackgroundDecor from "@/components/general/background-decor";
import { mockAds } from "@/lib/mock-posts";
import {
  getTopPosts,
  getFeaturedPosts,
  getTrendingPosts,
  getPopularPosts,
  getAllPosts,
} from "@/lib/api/posts";

import { getFeaturedPeople } from "@/lib/api/featured";
import FeaturedSection from "@/components/featured-section";

// Rebuild this page in the background at most once a minute.
// Use `export const dynamic = "force-dynamic";` instead for fresh data on every visit.
export const revalidate = 60;

export default async function Home() {
  const [topPosts, featuredPosts, trending, popular, allPostsRes, featured] =
    await Promise.all([
      getTopPosts(5),
      getFeaturedPosts(5),
      getTrendingPosts(5),
      getPopularPosts(3),
      getAllPosts(1, 20),
      getFeaturedPeople().catch((err) => {
        console.error("Featured people fetch failed:", err);
        return [];
      }),
    ]);

  const allPosts = allPostsRes.posts;

  if (allPosts.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="text-text-dark/60">No posts published yet.</p>
      </main>
    );
  }

  const heroPosts = topPosts.length > 0 ? topPosts : allPosts.slice(0, 1);

  const featuredFallback = allPosts.filter(
    (p) => !heroPosts.some((h) => h.id === p.id)
  );
  const featuredSource =
    featuredPosts.length > 0 ? featuredPosts : featuredFallback;
  const featuredMain = featuredSource[0];
  const featuredSide = featuredSource.slice(1, 5);

  // Post shown in the slide-in card. Uses a side story so it doesn't
  // duplicate the main featured story already visible in the grid.
  const slideInPost = featuredSide[0] ?? featuredMain;

  const usedIds = new Set([
    ...heroPosts.map((p) => p.id),
    ...(featuredMain ? [featuredMain.id] : []),
    ...featuredSide.map((p) => p.id),
  ]);
  let moreStoriesPosts = allPosts.filter((p) => !usedIds.has(p.id)).slice(0, 3);

  if (moreStoriesPosts.length === 0) {
    moreStoriesPosts = allPosts.slice(0, 3);
  }

  return (
    <main className="bg-cream">
      {/* Slides in shortly after load; dismissible so readers can keep reading */}
      <FeaturedSlideIn post={slideInPost} />

      {/* Decor is scoped to its own positioned wrapper covering only the
          content area — NOT the whole <main>, so it never bleeds into
          Footer below. */}
      <div className="relative">
        <BackgroundDecor variant="page" />

        {/* Same width as the rest of the page; the section hides itself
            when nobody is featured */}
        <div className="relative mx-auto max-w-7xl px-6 pt-6">
          <FeaturedSection people={featured} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <HeroSection posts={heroPosts} />
        </div>

        <div className="relative backdrop-blur-[1px]">
          <div className="mx-auto max-w-7xl px-6">
            <TrendingTicker posts={trending} />
            <FeaturedGrid main={featuredMain} side={featuredSide} />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <AdBanner ad={mockAds[0]} />
          <LatestNews />
        </div>

        <div className="relative backdrop-blur-[1px]">
          <div className="mx-auto max-w-7xl px-6">
            <MoreStories
              posts={moreStoriesPosts}
              popular={popular}
              ad={mockAds[1]}
            />
          </div>
        </div>

        <NewsletterCta />
      </div>

      <Footer recent={allPosts.slice(0, 3)} popular={popular} />
    </main>
  );
}
