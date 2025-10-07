import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Post } from '@/types/post';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { usePosts } from '@/hooks/usePosts';
import SeriesNavigation from '@/components/SeriesNavigation';

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { posts: allPosts } = usePosts();

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

  const seriesPosts = useMemo(() => {
    if (!post?.frontmatter.series || allPosts.length === 0) {
      return [];
    }
    return allPosts.filter(
      p => p.series === post.frontmatter.series
    );
  }, [allPosts, post]);

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>{`${frontmatter.title} | Tiếng Hàn Phúc Lee`}</title>
      </Helmet>
      <article className="container max-w-3xl mx-auto px-4 py-8">
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
          <div className="mt-4 flex flex-wrap gap-2">
            {frontmatter.tags.map(tag => (
              <Link to={`/bai-viet?tag=${encodeURIComponent(tag)}`} key={tag}>
                <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </header>

        {frontmatter.series && seriesPosts.length > 1 && (
          <SeriesNavigation
            seriesName={frontmatter.series}
            currentSlug={frontmatter.slug}
            seriesPosts={seriesPosts}
          />
        )}

        <div className="prose dark:prose-invert max-w-none">
          <Content />
        </div>
      </article>
    </>
  );
};

export default PostDetail;