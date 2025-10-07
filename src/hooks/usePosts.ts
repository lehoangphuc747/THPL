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
      // Sửa lại đường dẫn thành đường dẫn tương đối để đảm bảo Vite tìm thấy file
      const modules = import.meta.glob<PostModule>('../../content/posts/*.mdx', { eager: true });
      
      const allPosts = Object.values(modules).map(module => {
        // Thêm kiểm tra để đảm bảo frontmatter tồn tại
        if (module.frontmatter) {
          return { ...module.frontmatter };
        }
        return null;
      }).filter(Boolean) as PostFrontmatter[];

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