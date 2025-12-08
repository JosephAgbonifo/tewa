import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogData, BlogPost } from "@/data/blogdata";

type Params = {
  params: Promise<{
    category: string;
  }>;
};

// Generate static paths for all categories
export async function generateStaticParams() {
  const categories = Array.from(
    new Set(blogData.map((b) => b.mainCategory.toLowerCase()))
  );

  return categories.map((category) => ({ category }));
}

const normalizeCategory = (value: string) =>
  decodeURIComponent(value).trim().toLowerCase();

export default async function CategoryPage(props: Params) {
  const resolvedParams = await props.params;
  const categoryParam = normalizeCategory(resolvedParams.category ?? "");

  if (!categoryParam) {
    return notFound();
  }

  const blogsInCategory: BlogPost[] = blogData.filter(
    (b) => normalizeCategory(b.mainCategory ?? "") === categoryParam
  );

  if (blogsInCategory.length === 0) {
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="font-playfair text-3xl font-bold mb-6 uppercase">
        {resolvedParams.category} Blogs
      </h1>

      <div className="grid gap-8">
  {blogsInCategory.map((blog) => (
    <Link
      key={blog.id}
      href={`/categories/${resolvedParams.category}/${blog.id}`}
      className="group flex flex-col md:flex-row items-start gap-6 rounded-xl p-4 transition-all duration-300"
    >
      {/* LEFT: Image */}
      <div className="w-full md:w-1/3 h-56 md:h-48 overflow-hidden rounded-lg">
        <Image
          src={blog.mainImage}
          width={600}
          height={400}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* RIGHT: Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold mb-2 group-hover:text-gold transition-colors">
            {blog.title}
          </h2>

          <p className="font-lora text-sm text-gray-600 mb-3">
            By {blog.author} | {new Date(blog.date).toLocaleDateString()}
          </p>

          <p className="font-lora text-gray-700 text-base line-clamp-4 md:line-clamp-5">
            {blog.body}
          </p>
        </div>

        {/* Read More Button */}
        <button className="mt-4 flex items-center justify-center w-40  px-4 py-2 font-lora text-sm rounded-md border bg-gold text-white font-semibold border-gray-400 group-hover:w-full transition-all duration-500">
          Read More
        </button>
      </div>
    </Link>
  ))}
</div>

    </div>
  );
}
