export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  body_html: string | null;
  cover_image_url: string | null;
  category: string | null;
  source: string | null;
  author: string | null;
  source_url: string | null;
  is_featured: boolean;
  published_at: string | null;
  status: "draft" | "published";
  summarize: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleFormData = {
  title: string;
  slug: string;
  excerpt: string;
  body_html: string;
  cover_image_url: string;
  category: string;
  author: string;
  source_url: string;
  is_featured: boolean;
  status: "draft" | "published";
};

export type ActionResult = {
  success: boolean;
  error?: string;
  articleId?: string;
};
