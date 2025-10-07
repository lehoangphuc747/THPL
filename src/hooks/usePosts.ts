import { useState, useEffect } from 'react';
import { PostFrontmatter, Post } from '@/types/post';

interface PostModule {
  frontmatter: PostFrontmatter;
  default: React.ComponentType; // Thêm default export cho nội dung MDX
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]); // Thay đổi kiểu dữ liệu thành Post[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      const modules = import.meta.glob<PostModule>('/content/posts/*.mdx', { eager: true });

      const allPosts = Object.values(modules).map(module => {
        if (module && module.frontmatter) {
          return { frontmatter: module.frontmatter, Content: module.default }; // Trả về cả Content
        }
        return null;
      }).filter(Boolean) as Post[];

      const visiblePosts = allPosts
        .filter(post => post.frontmatter.status === 'published' || post.frontmatter.status === 'pinned')
        .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

      setPosts(visiblePosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { posts, loading };
}