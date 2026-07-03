import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "@/screens/BlogPost";
import { getBlogPost, allBlogSlugs } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allBlogSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Dumpmail Blog`,
    description: post.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return <BlogPost post={post} />;
}
