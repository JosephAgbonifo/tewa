import PostForm from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-tewa-black">
        New Post
      </h1>
      <p className="mt-1 text-sm text-text-dark/60">
        Write and publish a new story.
      </p>
      <div className="mt-8">
        <PostForm />
      </div>
    </div>
  );
}
