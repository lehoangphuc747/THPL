import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Post, Heading } from '@/types/post';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { usePosts } from '@/hooks/usePosts';
import SeriesNavigation from '@/components/SeriesNavigation';
import ProgressBar from '@/components/ProgressBar';
import TableOfContents from '@/components/TableOfContents';
import PostActions from '@/components/PostActions';
import PostNavigation from '@/components/PostNavigation';

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isReaderMode, setIsReaderMode] = useState(false);

  const { posts: allPosts } = usePosts();

  useEffect(() => {
    const savedReaderMode = localStorage.getItem('readerMode') === 'true';
    setIsReaderMode(savedReaderMode);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      setError(false);
      try {
        const postModule = await import(`../../content/posts/${slug}.mdx`);
        setPost({
          frontmatter: postModule.frontmatter,
          Content: postModule.default,
        });
      } catch (e) {
        console.error("Failed to load post:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post || loading) return;

    const articleElement = document.querySelector('article');
    if (!articleElement) return;

    const headingElements = Array.from(articleElement.querySelectorAll('h2, h3'));
    const extractedHeadings = headingElements.map((el, index) => {
      const text = el.textContent || '';
      const level = parseInt(el.tagName.substring(1), 10);
      const slug = text.toLowerCase().replace(/\s+/g, '-') + `-${index}`;
      el.id = slug;
      return { level, text, slug };
    });
    setHeadings(extractedHeadings);
  }, [post, loading]);

  const { prevPost, nextPost } = useMemo(() => {
    if (!slug || allPosts.length === 0) return { prevPost: undefined, nextPost: undefined };
    const currentIndex = allPosts.findIndex(p => p.slug === slug);
    if (currentIndex === -1) return { prevPost: undefined, nextPost: undefined };
    
    const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;
    const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;
    
    return { prevPost: prev, nextPost: next };
  }, [allPosts, slug]);

  const seriesPosts = useMemo(() => {
    if (!post?.frontmatter.series || allPosts.length === 0) return [];
    return allPosts.filter(p => p.series === post.frontmatter.series);
  }, [allPosts, post]);

  const toggleReaderMode = () => {
    setIsReaderMode(prev => {
      const newMode = !prev;
      localStorage.setItem('readerMode', String(newMode));
      return newMode;
    });
  };

  if (loading) {
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
  const postDate = new Date(frontmatter.date).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>{`${frontmatter.title} | Tiếng Hàn Phúc Lee`}</title>
      </Helmet>
      <ProgressBar />
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <article className="w-full lg:w-3/4">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{frontmatter.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={frontmatter.date}>{postDate}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  <Link to={`/bai-viet?category=${encodeURIComponent(frontmatter.category)}`} className="hover:text-primary hover:underline">
                    {frontmatter.category}
                  </Link>
                </div>
              </div>
            </header>

            {frontmatter.cover && (
              <figure className="mb-8">
                <img src={frontmatter.cover} alt={frontmatter.coverAlt} className="w-full rounded-lg aspect-video object-cover" loading={frontmatter.coverPriority ? 'eager' : 'lazy'} />
                {(frontmatter.coverCaption || frontmatter.coverCredit) && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {frontmatter.coverCaption} {frontmatter.coverCredit && `(Ảnh: ${frontmatter.coverCredit})`}
                  </figcaption>
                )}
              </figure>
            )}

            {!isReaderMode && <TableOfContents headings={headings} />}

            {frontmatter.series && seriesPosts.length > 1 && (
              <SeriesNavigation seriesName={frontmatter.series} currentSlug={frontmatter.slug} seriesPosts={seriesPosts} />
            )}

            <div className="prose dark:prose-invert max-w-none">
              <Content />
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {frontmatter.tags.map(tag => (
                <Link to={`/bai-viet?tag=${encodeURIComponent(tag)}`} key={tag}>
                  <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">{tag}</Badge>
                </Link>
              ))}
            </div>

            <PostNavigation prevPost={prevPost} nextPost={nextPost} />
          </article>

          <aside className="w-full lg:w-1/4 lg:sticky top-20 self-start">
             <PostActions isReaderMode={isReaderMode} onToggleReaderMode={toggleReaderMode} />
             {!isReaderMode && <TableOfContents headings={headings} />}
          </aside>
        </div>
      </div>
    </>
  );
};

export default PostDetail;