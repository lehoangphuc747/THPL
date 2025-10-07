import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PostFrontmatter } from '@/types/post';

interface SeriesNavigationProps {
  seriesName: string;
  currentSlug: string;
  seriesPosts: PostFrontmatter[];
}

const SeriesNavigation = ({ seriesName, currentSlug, seriesPosts }: SeriesNavigationProps) => {
  // Các bài viết đã được sắp xếp theo ngày tháng từ hook usePosts.
  const sortedPosts = seriesPosts;

  return (
    <Card className="my-8 bg-secondary/50">
      <CardHeader>
        <CardTitle>Chuỗi bài viết: {seriesName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2">
          {sortedPosts.map((post) => (
            <li key={post.slug} className={post.slug === currentSlug ? 'font-bold text-primary' : ''}>
              {post.slug === currentSlug ? (
                <span>{post.title} (bài này)</span>
              ) : (
                <Link to={`/bai-viet/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default SeriesNavigation;