export interface PostFrontmatter {
  slug: string;
  title: string;
  date: string;
  updated: string;
  status: "published" | "draft";
  author: string;
  category: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  coverCaption: string;
  series?: {
    name: string;
    part: number;
  };
}

export interface Post {
  frontmatter: PostFrontmatter;
  Content: React.ComponentType;
}