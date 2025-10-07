import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostFrontmatter } from '@/types/post';
import { Calendar } from 'lucide-react';

interface PostCardProps {
  post: PostFrontmatter;
}

const PostCard = ({ post }: PostCardProps) => {
  const postDate = new Date(post.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/bai-viet/${post.slug}`}>
      <Card className="h-full flex flex-col hover:border-primary transition-colors">
        <CardHeader>
          <img src={post.cover || '/placeholder.svg'} alt={post.coverAlt} className="rounded-md mb-4 aspect-video object-cover" />
          <CardTitle>{post.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-2">
            <Calendar className="w-4 h-4" />
            <span>{postDate}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <Badge>{post.category}</Badge>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-primary">Đọc thêm →</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostCard;