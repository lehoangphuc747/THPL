import { usePosts } from '@/hooks/usePosts';
import PostListItem from '@/components/PostListItem';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'react-router-dom';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const POSTS_PER_PAGE = 10;

const Posts = () => {
  const { posts, loading } = usePosts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isSeriesOpen, setIsSeriesOpen] = useState(false);

  const selectedCategory = searchParams.get('category');
  const selectedTag = searchParams.get('tag');
  const selectedSeries = searchParams.get('series');

  const filterOptions = useMemo(() => {
    if (!posts) return { allCategories: [], allTags: [], allSeries: [] };
    const allCategories = [...new Set(posts.map(p => p.frontmatter.category))].filter(c => typeof c === 'string');
    const allTags = [...new Set(posts.flatMap(p => p.frontmatter.tags))].filter(t => typeof t === 'string');
    const allSeries = [...new Set(posts.map(p => p.frontmatter.series).filter(Boolean))].filter(s => typeof s === 'string') as string[];
    return { allCategories, allTags, allSeries };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let tempPosts = posts;

    tempPosts = tempPosts.filter(post => {
      if (selectedCategory && post.frontmatter.category !== selectedCategory) return false;
      if (selectedTag && (!post.frontmatter.tags || !post.frontmatter.tags.includes(selectedTag))) return false;
      if (selectedSeries && post.frontmatter.series !== selectedSeries) return false;
      return true;
    });

    const pinnedPosts = tempPosts.filter(p => p.frontmatter.status === 'pinned');
    const otherPosts = tempPosts.filter(p => p.frontmatter.status !== 'pinned');
    return [...pinnedPosts, ...otherPosts];
  }, [posts, selectedCategory, selectedTag, selectedSeries]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredPosts.length) {
          setVisibleCount(prevCount => prevCount + POSTS_PER_PAGE);
        }
      },
      { threshold: 1.0 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [visibleCount, filteredPosts.length]);
  
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [selectedCategory, selectedTag, selectedSeries]);

  const handleFilterChange = useCallback((type: 'category' | 'tag' | 'series', value: string) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      const current = newParams.get(type);
      if (current === value) {
        newParams.delete(type);
      } else {
        newParams.set(type, value);
      }
      return newParams;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const postsToRender = filteredPosts.slice(0, visibleCount);
  const hasActiveFilters = !!(selectedCategory || selectedTag || selectedSeries);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="sticky top-20 space-y-4">
            <h2 className="text-xl font-semibold">Bộ lọc</h2>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="w-full justify-start px-0 h-auto py-1">
                Xóa tất cả bộ lọc
              </Button>
            )}
            <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <CollapsibleTrigger className="flex justify-between items-center w-full font-medium py-2">
                Danh mục <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-wrap gap-2 pt-2">
                {filterOptions.allCategories.map(category => (
                  <Badge key={category} variant={selectedCategory === category ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => handleFilterChange('category', category)}>
                    {category}
                  </Badge>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible open={isTagOpen} onOpenChange={setIsTagOpen}>
              <CollapsibleTrigger className="flex justify-between items-center w-full font-medium py-2">
                Thẻ <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isTagOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-wrap gap-2 pt-2">
                {filterOptions.allTags.map(tag => (
                  <Badge key={tag} variant={selectedTag === tag ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => handleFilterChange('tag', tag)}>
                    {tag}
                  </Badge>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible open={isSeriesOpen} onOpenChange={setIsSeriesOpen}>
              <CollapsibleTrigger className="flex justify-between items-center w-full font-medium py-2">
                Series <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSeriesOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-wrap gap-2 pt-2">
                {filterOptions.allSeries.map(series => (
                  <Badge key={series} variant={selectedSeries === series ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => handleFilterChange('series', series)}>
                    {series}
                  </Badge>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">
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
                    <PostListItem key={post.frontmatter.slug} post={post.frontmatter} />
                  ))}
                </div>
              ) : (
                <p>
                  {hasActiveFilters
                    ? "Không tìm thấy bài viết nào phù hợp với bộ lọc của bạn."
                    : "Chưa có bài viết nào."}
                </p>
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