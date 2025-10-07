import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Post, Heading } from '@/types/post';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, Folder, RefreshCw, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { usePosts } from '@/hooks/usePosts';
import SeriesNavigation from '@/components/SeriesNavigation';
import ProgressBar from '@/components/ProgressBar';
import TableOfContents from '@/components/TableOfContents';
import PostActions from '@/components/PostActions';
import PostNavigation from '@/components/PostNavigation';
import { cn } from '@/lib/utils';
import { usePageContext } from '@/components/Layout';

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { scrollDirection } = usePageContext();
  const { posts: allPosts, loading: postsLoading } = usePosts();
  const [error, setError] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Derive post directly from allPosts
  const post = useMemo(() => {
    if (!slug || postsLoading) return null;
    return allPosts.find(p => p.frontmatter.slug === slug) || null;
  }, [slug, allPosts, postsLoading]);

  useEffect(() => {
    const savedReaderMode = localStorage.getItem('readerMode') === 'true';
    setIsReaderMode(savedReaderMode);
  }, []);

  // The error state should now be derived from `post` as well
  useEffect(() => {
    if (!postsLoading && !post && slug) { // Only set error if loading is done, post is not found, and slug exists
      setError(true);
    } else if (post) {
      setError(false); // Clear error if post is found
    }
  }, [post, postsLoading, slug]);

  useEffect(() => {
    if (!post) return;

    const articleElement = document.querySelector('article');
    if (!articleElement) return;

    const headingElements = Array.from(articleElement.querySelectorAll('h2, h3'));
    const extractedHeadings = headingElements.map((el, index) => {
      const text = el.textContent || '';
      const level = parseInt(el.tagName.substring(1), 10);
      // Ensure slug is unique and valid for IDs
      const baseSlug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
      const slugValue = baseSlug ? `${baseSlug}-${index}` : `heading-${index}`; // Fallback if text is empty
      el.id = slugValue;
      return { level, text, slug: slugValue };
    });
    setHeadings(extractedHeadings);
  }, [post]);

  const { prevPost, nextPost } = useMemo(() => {
    if (!slug || allPosts.length === 0) return { prevPost: undefined, nextPost: undefined };
    const currentIndex = allPosts.findIndex(p => p.frontmatter.slug === slug);
    if (currentIndex === -1) return { prevPost: undefined, nextPost: undefined };
    
    const prev = currentIndex > 0 ? allPosts[currentIndex - 1].frontmatter : undefined;
    const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1].frontmatter : undefined;
    
    return { prevPost: prev, nextPost: next };
  }, [allPosts, slug]);

  const seriesPosts = useMemo(() => {
    if (!post?.frontmatter.series || allPosts.length === 0) return [];
    return allPosts.filter(p => p.frontmatter.series === post.frontmatter.series).map(p => p.frontmatter);
  }, [allPosts, post]);

  const toggleReaderMode = () => {
    setIsReaderMode(prev => {
      const newMode = !prev;
      localStorage.setItem('readerMode', String(newMode));
      return newMode;
    });
  };

  if (postsLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-5/6 mb-4" />
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/404" replace />;
  }

  const { frontmatter, Content } = post;
  const postDate = new Date(frontmatter.date);
  const updatedDate = new Date(frontmatter.updated);
  const showUpdatedDate = updatedDate > postDate && updatedDate.toDateString() !== postDate.toDateString();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${frontmatter.title} | Tiếng Hàn Phúc Lee`}</title>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
        {frontmatter.cover && <meta property="og:image" content={frontmatter.cover} />}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
      </Helmet>
      <ProgressBar scrollDirection={scrollDirection} />
      <div className="container mx-auto px-4 py-8">
        <div className={cn("mx-auto transition-all duration-300", isReaderMode ? 'max-w-3xl' : 'max-w-5xl')}>
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {frontmatter.authorUrl ? (
                    <a href={frontmatter.authorUrl} target="_blank" rel="noopener noreferrer">
                      <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">{frontmatter.author}</Badge>
                    </a>
                  ) : (
                    <Badge variant="secondary">{frontmatter.author}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={frontmatter.date}>{formatDate(postDate)}</time>
                </div>
                {showUpdatedDate && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <time dateTime={frontmatter.updated}>{formatDate(updatedDate)}</time>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  <Link to={`/bai-viet?category=${encodeURIComponent(frontmatter.category)}`}>
                    <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">{frontmatter.category}</Badge>
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Tags className="w-4 h-4 text-muted-foreground" />
                {frontmatter.tags.map(tag => (
                  <Link to={`/bai-viet?tag=${encodeURIComponent(tag)}`} key={tag}>
                    <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">{tag}</Badge>
                  </Link>
                ))}
              </div>
            </header>

            {frontmatter.cover && (
              <figure className="mb-8">
                <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={frontmatter.cover} 
                    alt={frontmatter.coverAlt} 
                    className={cn("w-full h-full object-cover transition-opacity duration-500", isImageLoaded ? "opacity-100" : "opacity-0")}
                    onLoad={() => setIsImageLoaded(true)}
                    loading={frontmatter.coverPriority ? 'eager' : 'lazy'} 
                  />
                </div>
                {(frontmatter.coverCaption || frontmatter.coverCredit) && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {frontmatter.coverCaption} {frontmatter.coverCredit && `(Ảnh: ${frontmatter.coverCredit})`}
                  </figcaption>
                )}
              </figure>
            )}

            <PostActions isReaderMode={isReaderMode} onToggleReaderMode={toggleReaderMode} />
            <TableOfContents headings={headings} />

            {frontmatter.series && seriesPosts.length > 1 && (
              <SeriesNavigation seriesName={frontmatter.series} currentSlug={frontmatter.slug} seriesPosts={seriesPosts} />
            )}

            <div className="prose dark:prose-invert max-w-none mt-8">
              <Content />
            </div>

            <PostNavigation prevPost={prevPost} nextPost={nextPost} />
          </article>
        </div>
      </div>
    </>
  );
};

export default PostDetail;