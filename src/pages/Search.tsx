import { useState, useEffect, useMemo } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostFrontmatter } from '@/types/post';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import Fuse from 'fuse.js';

const SearchPage = () => {
  const { posts, loading } = usePosts();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PostFrontmatter[]>([]);

  const fuse = useMemo(() => {
    if (posts.length > 0) {
      return new Fuse(posts, {
        keys: ['title', 'tags', 'category', 'author'],
        includeScore: true,
        threshold: 0.4,
      });
    }
    return null;
  }, [posts]);

  useEffect(() => {
    if (query.trim() && fuse) {
      const searchResults = fuse.search(query.trim()).map(result => result.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, fuse]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tìm kiếm bài viết</h1>
      <div className="mb-8">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập từ khóa tìm kiếm..."
          className="max-w-lg"
        />
      </div>

      {loading && query && <p>Đang tìm kiếm...</p>}

      {query && !loading && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Kết quả cho "{query}"
          </h2>
          {results.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map(post => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p>Không tìm thấy kết quả nào.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;