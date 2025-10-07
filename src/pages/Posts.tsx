import { usePosts } from '@/hooks/usePosts';
import PostListItem from '@/components/PostListItem';
import SearchBox from '@/components/SearchBox';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'react-router-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const POSTS_PER_PAGE = 10;

const Posts = () => {
  const { posts, loading } = usePosts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const selectedCategory = searchParams.get('category');
  const selectedTag = searchParams.get('tag');
  const selectedSeries = searchParams.get('series');

  const { filteredPosts, allCategories, allTags, allSeries } = useMemo(() => {
    if (!posts) return { filteredPosts: [], allCategories: [], allTags: [], allSeries: [] };

    let tempPosts = posts;

    // 1. Filter by search query
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      tempPosts = tempPosts.filter(post =>
        post.title.toLowerCase().includes(lowercasedQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
    }

    // 2. Filter by URL params
    tempPosts = tempPosts.filter(post => {
      if (selectedCategory && post.category !== selectedCategory) return false;
      if (selectedTag && !post.tags.includes(selectedTag)) return false;
      if (selectedSeries && post.series !== selectedSeries) return false;
      return true;
    });

    // 3. Sort by pinning
    const pinnedPosts = tempPosts.filter(p => p.status === 'pinned');
    const otherPosts = tempPosts.filter(p => p.status !== 'pinned');
    const sortedPosts = [...pinnedPosts, ...otherPosts];

    const categories = [...new Set(posts.map(p => p.category))];
    const tags = [...new Set(posts.flatMap(p => p.tags))];
    const series = [...new Set(posts.map(p => p.series).filter(Boolean))] as string[];

    return { filteredPosts: sortedPosts, allCategories: categories, allTags: tags, allSeries: series };
  }, [posts, searchQuery, selectedCategory, selectedTag, selectedSeries]);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredPosts.length) {
          setVisibleCount(prevCount => prevCount + POSTS_PER_PAGE);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [visibleCount, filteredPosts.length]);
  
  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [searchQuery, selectedCategory, selectedTag, selectedSeries]);


  const handleFilterChange = (type: 'category' | 'tag' | 'series', value: string) => {
    const newParams = new URLSearchParams();
    const current = searchParams.get(type);
    if (current !== value) {
      newParams.set(type, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const postsToRender = filteredPosts.slice(0, visibleCount);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="sticky top-20 space-y-4">
            <h2 className="text-xl font-semibold">Bộ lọc</h2>
            {(selectedCategory || selectedTag || selectedSeries) && (
              <Button variant="ghost" onClick={clearFilters} className="w-full justify-start px-0">
                Xóa tất cả bộ lọc
              </Button>
            )}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex justify-between items-center w-full font-medium py-2">
                Danh mục <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-wrap gap-2 pt-2">
                {allCategories.map(category => (
                  <Badge key={category} variant={selectedCategory === category ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => handleFilterChange('category', category)}>
                    {category}
                  </Badge>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full font-medium py-2">
                Thẻ <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-wrap gap-2 pt-2">
                {allTags.map(tag => (
                  <Badge key={tag} variant={selectedTag === tag ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => handleFilterChange('tag', tag)}>
                    {tag}
                  </Badge>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full font-medium py-2">
                Series <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-wrap gap-2 pt-2">
                {allSeries.map(series => (
                  <Badge key={series} variant={selectedSeries === series ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => handleFilterChange('series', series)}>
                    {series}
                  </Badge>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="mb-6">
            <SearchBox value={searchQuery} onChange={setSearchQuery} />
          </div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 py-4 border-b">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {postsToRender.length > 0 ? (
                <div>
                  {postsToRender.map(post => (
                    <PostListItem key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <p>Không tìm thấy bài viết nào phù hợp.</p>
              )}
              {visibleCount < filteredPosts.length && (
                <div ref={observerRef} className="h-10 flex justify-center items-center">
                   <p className="text-muted-foreground">Đang tải thêm...</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Posts;