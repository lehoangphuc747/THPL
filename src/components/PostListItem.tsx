import { Link } from 'react-router-dom';
import { PostFrontmatter } from '@/types/post';

interface PostListItemProps {
  post: PostFrontmatter;
}

const PostListItem = ({ post }: PostListItemProps) => {
  return (
    <Link to={`/bai-viet/${post.slug}`} className="block">
      <div className="py-4 border-b hover:bg-muted/50 px-4 rounded-md transition-colors">
        <h3 className="text-lg font-medium">{post.title}</h3>
        <p className="text-sm text-muted-foreground">{post.category}</p>
      </div>
    </Link>
  );
};

export default PostListItem;