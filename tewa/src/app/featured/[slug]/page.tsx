import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileView from "@/components/featured/profile-view";
import { getFeaturedProfile } from "@/lib/api/featured";

// Re-fetch in the background at most once a minute, so edits you save
// in the admin show up on the public page shortly after
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

// cache() so the metadata and the page share one request
const load = cache(async (slug: string) => {
  try {
    return await getFeaturedProfile(slug);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await load(slug);
  if (!profile) return { title: "Not found" };

  const description = profile.tagline ?? profile.titles.join(", ");

  return {
    title: `${profile.name} | TEWA Featured`,
    description,
    openGraph: {
      title: profile.name,
      description,
      type: "article",
      images: profile.images[0] ? [profile.images[0]] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.name,
      description,
      images: profile.images[0] ? [profile.images[0]] : [],
    },
  };
}

export default async function FeaturedProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await load(slug);
  if (!profile) notFound();

  // No width or padding wrapper: ProfileView sets its own widths per section
  return (
    <main className="pb-16">
      <ProfileView profile={profile} />
    </main>
  );
}
