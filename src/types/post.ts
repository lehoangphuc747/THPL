export interface PostFrontmatter {
  slug: string;
  title: string;
  date: string;
  updated: string;
  status: "published" | "draft" | "unlisted" | "pinned";
  author: string;
  category: string;
  subcategory?: string;
  tags: string[];
  cover?: string;
  coverAlt: string;
  coverCaption?: string;
  coverCredit?: string;
  coverPriority?: boolean;
  series?: string;
}

export interface Post {
  frontmatter: PostFrontmatter;
  Content: React.ComponentType;
}

export interface Heading {
  level: number;
  text: string;
  slug: string;
}