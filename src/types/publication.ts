export type Publication = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  body_html: string | null;
  cover_image_url: string | null;
  pub_type: string | null;
  category: string | null;
  region: string | null;
  author: string | null;
  external_url: string | null;
  file_url: string | null;
  published_at: string | null;
  status: "draft" | "published";
  summarize: string | null;
  created_at: string;
  updated_at: string;
};

export const PUBLICATION_TYPES = [
  "Policy Brief",
  "Research Note",
  "Analysis",
  "Report",
] as const;

export type PublicationFormData = {
  title: string;
  slug: string;
  excerpt: string;
  body_html: string;
  cover_image_url: string;
  pub_type: string;
  category: string;
  region: string;
  author: string;
  external_url: string;
  file_url: string;
  status: "draft" | "published";
};

export type ActionResult = {
  success: boolean;
  error?: string;
};
