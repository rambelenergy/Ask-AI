export type ExternalResource = {
  title: string;
  source: string;
  description?: string;
  url: string;
  badge: "External Source" | "External Interactive Resource";
};
