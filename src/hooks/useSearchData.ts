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
      const rawContentModules = import.meta.glob('/content/posts/*.mdx', { as: 'raw', eager: true });

      const allPosts = Object.entries(modules).map(([path, module]) => {
        if (module && module.frontmatter) {
          const rawFileContent = rawContentModules[path];
          const { content } = matter(rawFileContent); // Tách riêng phần nội dung
          return { 
            ...module.frontmatter,
            content: content, // Chỉ tìm kiếm trong nội dung bài viết
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