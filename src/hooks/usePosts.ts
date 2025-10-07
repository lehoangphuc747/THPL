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
      console.log('--- [DEBUG] Bắt đầu quá trình tải bài viết ---');

      const modules = import.meta.glob<PostModule>('/content/posts/*.mdx', { eager: true });
      console.log('1. Tìm thấy các module bài viết:', modules);

      // Log chi tiết từng module để kiểm tra
      console.log('2. Bắt đầu kiểm tra từng module...');
      Object.entries(modules).forEach(([path, module]) => {
        console.log(`  - Đang kiểm tra file: ${path}`);
        if (module) {
          if (module.frontmatter) {
            console.log(`    -> ✅ Tìm thấy 'frontmatter'.`);
          } else {
            console.log(`    -> ❌ KHÔNG tìm thấy 'frontmatter'. Các thuộc tính có sẵn là:`, Object.keys(module));
          }
        } else {
          console.log(`    -> ❌ Module này rỗng hoặc không hợp lệ.`);
        }
      });

      const allPosts = Object.values(modules).map(module => {
        if (module && module.frontmatter) {
          return { ...module.frontmatter };
        }
        return null;
      }).filter(Boolean) as PostFrontmatter[];
      console.log('3. Tất cả bài viết đã được xử lý (trước khi lọc theo status):', allPosts);

      const publishedPosts = allPosts
        .filter(post => post.status === 'published')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log('4. Các bài viết đã xuất bản (sau khi lọc):', publishedPosts);

      setPosts(publishedPosts);
      setLoading(false);
      console.log('--- [DEBUG] Kết thúc quá trình tải bài viết ---');
    };

    fetchPosts();
  }, []);

  return { posts, loading };
}