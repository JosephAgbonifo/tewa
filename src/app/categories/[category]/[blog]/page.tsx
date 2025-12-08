// app/categories/[category]/[blogId]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogData, BlogPost } from "@/data/blogdata";

type Params = {
  params: Promise<{
    category: string;
    blog: string;
  }>;
};

const normalize = (value: string) =>
  decodeURIComponent(value).trim().toLowerCase();

export default async function BlogPage(props: Params) {
  const resolvedParams = await props.params;
  const category = normalize(resolvedParams.category ?? "");
  const blogId = decodeURIComponent(resolvedParams.blog ?? "");

  if (!category || !blogId) {
    return notFound();
  }

  const blog: BlogPost | undefined = blogData.find(
    (b) => b.id === blogId && normalize(b.mainCategory ?? "") === category
  );

  if (!blog) return notFound();

  const slideImages = blog.slideImages ?? [];
  const hasSlides = Boolean(blog.slide && slideImages.length > 0);

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative w-full rounded-xl overflow-hidden mb-8">
        {/* HERO IMAGE */}
        <Image
          src={blog.mainImage}
          width={1600}
          height={900}
          alt={blog.title}
          className="w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] object-cover"
        />

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70" />

        {/* TEXT OVERLAY */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm font-lora text-gray-200">
            <span className="font-semibold">{blog.author}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
            <span>{new Date(blog.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4">
      {/* BODY */}
      <article className="font-lora text-lg leading-relaxed text-gray-800 mb-10 whitespace-pre-line px-1">
        {blog.body}
      </article>

      {/* SUPPORTING IMAGES — MASONRY */}
      {blog.supportingImages.length > 0 && (
        <div className="mb-12 px-1">
          <h2 className="font-playfair text-2xl font-bold mb-4">More Photos</h2>

          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {blog.supportingImages.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                width={800}
                height={600}
                alt={`Supporting ${idx}`}
                className="w-full rounded-lg object-cover break-inside-avoid shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* SLIDE CAROUSEL */}
      {hasSlides && (
        <div className="mb-14 px-1">
          <h2 className="font-playfair text-2xl font-bold mb-4">Gallery</h2>

          <div className="flex gap-4 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {slideImages.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                width={480}
                height={360}
                alt={`Slide ${idx}`}
                className="rounded-xl shadow-md object-cover shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      {/* METADATA FOOTER */}
      <div className="text-sm font-lora text-gray-600 border-t pt-4 mt-6 px-1">
        <p>
          <span className="font-semibold">Main category:</span> {blog.mainCategory}
        </p>
        <p>
          <span className="font-semibold">Subcategories:</span>{" "}
          {blog.subCategories.join(", ")}
        </p>
      </div>
      </div>
    </>
  );
}
