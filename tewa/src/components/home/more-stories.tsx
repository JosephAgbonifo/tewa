import { Post, AdSlot } from "@/types/post";
import PostCardHorizontal from "@/components/post/post-card-horizontal";
import AdBanner from "@/components/ui/ad-banner";
import SubscribeBox from "@/components/home/sidebar/subscribe-box";
import PopularPosts from "@/components/home/sidebar/popular-posts";

export default function MoreStories({
  posts,
  popular,
  ad,
}: {
  posts: Post[];
  popular: Post[];
  ad: AdSlot;
}) {
  return (
    <section className="grid grid-cols-1 gap-12 py-10 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-10">
        <h2 className="font-playfair text-xl font-bold tracking-wide text-tewa-black">
          MORE STORIES
        </h2>
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCardHorizontal post={post} key={post.id} />
            ))}
            <button className="mx-auto mt-4 border-t border-tewa-black/10 pt-6 text-sm font-semibold tracking-widest text-purple hover:text-gold transition-colors">
              LOAD MORE
            </button>
          </>
        ) : (
          <p className="text-sm text-text-dark/50">
            More stories will appear here as new posts are published.
          </p>
        )}
      </div>

      <aside className="flex flex-col gap-10">
        <AdBanner ad={ad} />
        <SubscribeBox />
        <PopularPosts posts={popular} />
      </aside>
    </section>
  );
}
