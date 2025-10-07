import { useState, useEffect } from 'react';
import { PostFrontmatter } from '@/types/post';
import matter from 'gray-matter';

export interface SearchablePost extends PostFrontmatter {
  content: string;
}

export function useSearchData() {
  const [searchablePosts, setSearchablePosts] = useState<SearchablePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      // Import tất cả các tệp .mdx dưới dạng chuỗi văn bản thô
      const rawContentModules = import.meta.glob('/content/posts/*.mdx', { as: 'raw', eager: true });

      const allPosts = Object.values(rawContentModules)
        .map((rawFileContent) => {
          if (typeof rawFileContent !== 'string') {
            return null;
          }
          try {
            // Tự phân tích frontmatter và nội dung bằng gray-matter
            const { data, content } = matter(rawFileContent);
            const frontmatter = data as PostFrontmatter;
            
            // Kiểm tra cơ bản để đảm bảo đây là một bài viết hợp lệ
            if (!frontmatter.slug || !frontmatter.title) {
              console.warn("Bỏ qua bài viết thiếu slug hoặc title.", data);
              return null;
            }

            return { 
              ...frontmatter,
              content: content, // Nội dung thực tế để tìm kiếm
            };
          } catch (e) {
            console.error("Lỗi phân tích frontmatter của MDX:", e);
            return null;
          }
        })
        .filter((p): p is SearchablePost => p !== null);

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