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
      // Chuyển sang eager loading để đảm bảo các bài viết luôn được tìm thấy
      const modules = import.meta.glob<PostModule>('/content/posts/*.mdx', { eager: true });
      
      const allPosts = Object.values(modules).map(module => {
        return { ...module.frontmatter };
      });

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