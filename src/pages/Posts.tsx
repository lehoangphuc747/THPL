import { usePosts } from '@/hooks/usePosts';
import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Posts = () => {
  const { posts, loading } = usePosts();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category');
  const selectedTag = searchParams.get('tag');

  const { filteredPosts, allCategories, allTags } = useMemo(() => {
    if (!posts) return { filteredPosts: [], allCategories: [], allTags: [] };

    const categoryAndTagFilteredPosts = posts.filter(post => {
      if (selectedCategory && post.category !== selectedCategory) {
        return false;
      }
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false;
      }
      return true;
    });

    const pinnedPosts = categoryAndTagFilteredPosts.filter(p => p.status === 'pinned');
    const otherPosts = categoryAndTagFilteredPosts.filter(p => p.status !== 'pinned');

    const sortedPosts = [...pinnedPosts, ...otherPosts];

    const categories = [...new Set(posts.map(p => p.category))];
    const tags = [...new Set(posts.flatMap(p => p.tags))];

    return { filteredPosts: sortedPosts, allCategories: categories, allTags: tags };
  }, [posts, selectedCategory, selectedTag]);

  const handleFilterChange = (type: 'category' | 'tag', value: string) => {
    const newParams = new URLSearchParams();
    newParams.set(type, value);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const getPageTitle = () => {
    if (selectedCategory) return `Bài viết về: ${selectedCategory}`;
    if (selectedTag) return `Bài viết có tag: ${selectedTag}`;
    return 'Tất cả bài viết';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-6 w-20" />)
              ) : (
                allCategories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    className="cursor-pointer text-base p-2"
                    onClick={() => handleFilterChange('category', category)}
                  >
                    {category}
                  </Badge>
                ))
              )}
            </div>
            <h2 className="text-xl font-semibold mb-4">Thẻ</h2>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-24" />)
              ) : (
                allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => handleFilterChange('tag', tag)}
                  >
                    {tag}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </aside>
        <main className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
            {(selectedCategory || selectedTag) && (
              <Button variant="ghost" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
          {loading ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[150px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredPosts.map(post => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <p>Không có bài viết nào phù hợp.</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Posts;