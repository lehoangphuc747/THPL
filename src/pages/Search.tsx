import { useState, useEffect, useMemo } from 'react';
import { useSearchData, SearchablePost } from '@/hooks/useSearchData';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import Fuse from 'fuse.js';
import { Skeleton } from '@/components/ui/skeleton';

const SearchPage = () => {
  const { searchablePosts, loading } = useSearchData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchablePost[]>([]);

  const [isTitleOnly, setIsTitleOnly] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filterOptions = useMemo(() => {
    const authors = [...new Set(searchablePosts.map(p => p.author))].filter(author => typeof author === 'string');
    const categories = [...new Set(searchablePosts.map(p => p.category))].filter(cat => typeof cat === 'string');
    const tags = [...new Set(searchablePosts.flatMap(p => p.tags || []))].filter(tag => typeof tag === 'string');
    const series = [...new Set(searchablePosts.map(p => p.series).filter(Boolean))] as string[];
    return { authors, categories, tags, series };
  }, [searchablePosts]);

  const fuse = useMemo(() => {
    if (searchablePosts.length > 0) {
      const keys = isTitleOnly 
        ? ['title'] 
        : [
            { name: 'title', weight: 2 }, 
            { name: 'content', weight: 1 },
            { name: 'tags', weight: 1.5 },
            { name: 'category', weight: 1.5 },
          ];
      return new Fuse(searchablePosts, {
        keys,
        includeScore: true,
        threshold: 0.4,
        minMatchCharLength: 2,
      });
    }
    return null;
  }, [searchablePosts, isTitleOnly]);

  useEffect(() => {
    let finalResults: SearchablePost[] = searchablePosts;

    if (query.trim() && fuse) {
      finalResults = fuse.search(query.trim()).map(result => result.item);
    }

    finalResults = finalResults.filter(post => {
      if (selectedAuthor && post.author !== selectedAuthor) return false;
      if (selectedCategory && post.category !== selectedCategory) return false;
      if (selectedTag && (!post.tags || !post.tags.includes(selectedTag))) return false;
      if (selectedSeries && post.series !== selectedSeries) return false;
      
      const postDate = new Date(post.date);
      if (startDate && postDate < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (postDate > endOfDay) return false;
      }
      
      return true;
    });

    setResults(finalResults);
  }, [query, fuse, searchablePosts, selectedAuthor, selectedCategory, selectedTag, selectedSeries, startDate, endDate]);

  const clearFilters = () => {
    setSelectedAuthor('');
    setSelectedCategory('');
    setSelectedTag('');
    setSelectedSeries('');
    setStartDate(undefined);
    setEndDate(undefined);
    setQuery('');
  };

  const hasActiveFilters = !!(selectedAuthor || selectedCategory || selectedTag || selectedSeries || startDate || endDate || query);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <div className="sticky top-20 space-y-6">
            <h2 className="text-2xl font-bold">Tìm kiếm nâng cao</h2>
            
            <div className="space-y-2">
              <Label htmlFor="search-input">Từ khóa</Label>
              <Input id="search-input" placeholder="Nhập từ khóa..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="title-only" checked={isTitleOnly} onCheckedChange={setIsTitleOnly} />
              <Label htmlFor="title-only">Chỉ tìm trong tiêu đề</Label>
            </div>

            <h3 className="text-lg font-semibold border-t pt-4">Bộ lọc</h3>

            <Select onValueChange={setSelectedAuthor} value={selectedAuthor}>
              <SelectTrigger><SelectValue placeholder="Tất cả tác giả" /></SelectTrigger>
              <SelectContent>
                {filterOptions.authors.map(author => <SelectItem key={author} value={author}>{author}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger><SelectValue placeholder="Tất cả danh mục" /></SelectTrigger>
              <SelectContent>
                {filterOptions.categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedTag} value={selectedTag}>
              <SelectTrigger><SelectValue placeholder="Tất cả thẻ" /></SelectTrigger>
              <SelectContent>
                {filterOptions.tags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedSeries} value={selectedSeries}>
              <SelectTrigger><SelectValue placeholder="Tất cả series" /></SelectTrigger>
              <SelectContent>
                {filterOptions.series.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Label>Khoảng thời gian</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yy") : <span>Từ ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yy") : <span>Đến ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="ghost" className="w-full justify-center text-sm">
                <X className="mr-2 h-4 w-4" /> Xóa tất cả bộ lọc
              </Button>
            )}
          </div>
        </aside>

        <main className="w-full md:w-2/3 lg:w-3/4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <div className="space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Tìm thấy {results.length} kết quả
              </h3>
              {results.length > 0 ? (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                  {results.map(post => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-center text-muted-foreground">
                  Không tìm thấy bài viết nào phù hợp với tiêu chí của bạn.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;