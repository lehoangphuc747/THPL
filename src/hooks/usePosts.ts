import { useState, useEffect } from 'react';
import { PostFrontmatter } from '@/types/post';

interface PostModule {
  frontmatter: PostFrontmatter;
}

export function usePosts() {
  const [posts, setPosts] = useState<PostFrontmatter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      const modules = import.meta.glob<PostModule>('/content/posts/*.mdx', { eager: true });

      const allPosts = Object.values(modules).map(module => {
        if (module && module.frontmatter) {
          return { ...module.frontmatter };
        }
        return null;
      }).filter(Boolean) as PostFrontmatter[];

      const visiblePosts = allPosts
        .filter(post => post.status === 'published' || post.status === 'pinned')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setPosts(visiblePosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { posts, loading };
}