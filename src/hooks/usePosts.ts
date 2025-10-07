import { useState, useEffect } from 'react';
import { PostFrontmatter } from '@/types/post';

interface PostModule {
  frontmatter: PostFrontmatter;
}

export function usePosts() {
  const [posts, setPosts] = useState<PostFrontmatter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const modules = import.meta.glob<PostModule>('/content/posts/*.mdx');
      const postPromises = Object.entries(modules).map(async ([path, resolver]) => {
        const { frontmatter } = await resolver();
        return { ...frontmatter };
      });

      const allPosts = await Promise.all(postPromises);
      
      // Lọc và sắp xếp bài viết
      const publishedPosts = allPosts
        .filter(post => post.status === 'published')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setPosts(publishedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { posts, loading };
}