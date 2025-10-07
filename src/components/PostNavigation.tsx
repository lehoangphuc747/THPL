import { Link } from 'react-router-dom';
import { PostFrontmatter } from '@/types/post';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';

interface PostNavigationProps {
  prevPost?: PostFrontmatter;
  nextPost?: PostFrontmatter;
}

const PostNavigation = ({ prevPost, nextPost }: PostNavigationProps) => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
      {prevPost ? (
        <Link to={`/bai-viet/${prevPost.slug}`}>
          <Card className="p-4 hover:border-primary transition-colors h-full">
            <p className="text-sm text-muted-foreground flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Bài trước</p>
            <p className="font-medium mt-1">{prevPost.title}</p>
          </Card>
        </Link>
      ) : <div />}
      {nextPost ? (
        <Link to={`/bai-viet/${nextPost.slug}`}>
          <Card className="p-4 hover:border-primary transition-colors h-full text-right">
            <p className="text-sm text-muted-foreground flex items-center justify-end gap-2">Bài tiếp theo <ArrowRight className="w-4 h-4" /></p>
            <p className="font-medium mt-1">{nextPost.title}</p>
          </Card>
        </Link>
      ) : <div />}
    </div>
  );
};

export default PostNavigation;