import { NextRequest, NextResponse } from "next/server";
import { getPublishedArticles } from "@/lib/articles";
import { getPublishedPublications } from "@/lib/publications";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() || "";
  
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [articles, publications] = await Promise.all([
    getPublishedArticles(),
    getPublishedPublications(),
  ]);

  const articleResults = articles
    .filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q))
    )
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      type: "article" as const,
      title: a.title,
      excerpt: a.excerpt?.substring(0, 120) || "",
      href: `/analysis/${a.slug}`,
    }));

  const publicationResults = publications
    .filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q))
    )
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      type: "publication" as const,
      title: p.title,
      excerpt: p.excerpt?.substring(0, 120) || "",
      href: `/research/${p.slug}`,
    }));

  return NextResponse.json({
    results: [...articleResults, ...publicationResults].slice(0, 8),
  });
}
