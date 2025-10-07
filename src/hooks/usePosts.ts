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
        return { ...module.frontmatter };
      });

      const publishedPosts = allPosts
        .filter(post => post && post.status === 'published')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // --- BẮT ĐẦU TEST ---
      // Thêm một bài viết giả để kiểm tra giao diện
      const testPost: PostFrontmatter = {
        slug: 'test-post',
        title: 'Đây là bài viết chẩn đoán',
        date: new Date().toISOString(),
        updated: new Date().toISOString(),
        status: 'published',
        author: 'Hệ thống',
        category: 'Chẩn đoán',
        tags: ['debug', 'test'],
        cover: '/placeholder.svg',
        coverAlt: 'Ảnh test',
        coverCaption: 'Ảnh test',
      };

      // Gộp bài viết thật với bài viết giả
      const finalPosts = [testPost, ...publishedPosts];
      console.log("Các bài viết cuối cùng được hiển thị:", finalPosts);
      setPosts(finalPosts);
      // --- KẾT THÚC TEST ---

      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { posts, loading };
}