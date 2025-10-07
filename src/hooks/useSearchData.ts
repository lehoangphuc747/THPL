import { useState, useEffect } from 'react';
import { PostFrontmatter } from '@/types/post';
import matter from 'gray-matter';

interface PostModule {
  frontmatter: PostFrontmatter;
}

export interface SearchablePost extends PostFrontmatter {
  content: string;
}

export function useSearchData() {
  const [searchablePosts, setSearchablePosts] = useState<SearchablePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      const modules = import.meta.glob<PostModule>('/content/posts/*.mdx', { eager: true });
      const rawContentModules = import.meta.glob('/content/posts/*.mdx?raw', { eager: true });

      const allPosts = Object.entries(modules).map(([path, module]) => {
        if (module && module.frontmatter) {
          const rawPath = `${path}?raw`;
          const rawFileContent = rawContentModules[rawPath] as string | undefined;

          if (typeof rawFileContent === 'string') {
            const { content } = matter(rawFileContent);
            return { 
              ...module.frontmatter,
              content: content,
            };
          } else {
            console.error(`Không thể đọc nội dung cho bài viết: ${path}`);
          }
        }
        return null;
      }).filter(Boolean) as SearchablePost[];

      const visiblePosts = allPosts
        .filter(post => post.status === 'published' || post.status === 'pinned')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setSearchablePosts(visiblePosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { searchablePosts, loading };
}