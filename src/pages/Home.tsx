import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const { posts, loading } = usePosts();
  const latestPosts = posts.slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Tiếng Hàn Phúc Lee</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Chào mừng đến với blog của tôi! Nơi chia sẻ kiến thức, kinh nghiệm và các dự án về việc học tiếng Hàn.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link to="/bai-viet">
              Xem bài viết <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/gioi-thieu">
              Về tôi
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Bài viết mới nhất</h2>
          {loading ? (
             <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {latestPosts.map(post => (
                <PostCard key={post.frontmatter.slug} post={post.frontmatter} />
              ))}
            </div>
          )}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Khám phá thêm</h2>
          <p className="text-muted-foreground mb-6">
            Xem các dự án tôi đã xây dựng để hỗ trợ việc học tiếng Hàn.
          </p>
          <Button variant="outline" asChild>
            <Link to="/du-an">
              Xem dự án
            </Link>
          </Button>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Home;