import { Post } from "@/types/post";
import PostCardVertical from "@/components/post/post-card-vertical";

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-tewa-black/10 py-10">
      <h2 className="font-playfair text-xl font-bold tracking-wide text-tewa-black">
        RELATED STORIES
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <PostCardVertical post={post} key={post.id} />
        ))}
      </div>
    </section>
  );
}
