import { Post } from "@/types/post";

export default function PostBody({ post }: { post: Post }) {
  const html = post.content?.join("") ?? "<p>No content available.</p>";

  return (
    <article className="prose-tewa mx-auto max-w-3xl py-10">
      <div
        className="prose prose-lg max-w-none text-text-dark [&_p]:mb-6 [&_p]:leading-relaxed [&_h2]:font-playfair [&_h2]:text-tewa-black [&_img]:my-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
