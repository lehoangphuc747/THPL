import { useState, useEffect } from 'react';
import { PostFrontmatter } from '@/types/post';

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
      const rawContentModules = import.meta.glob('/content/posts/*.mdx', { as: 'raw', eager: true });

      const allPosts = Object.entries(modules).map(([path, module]) => {
        if (module && module.frontmatter) {
          const rawContent = rawContentModules[path];
          return { 
            ...module.frontmatter,
            content: rawContent,
          };
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