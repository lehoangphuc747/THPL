import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Giới thiệu | Tiếng Hàn Phúc Lee</title>
        <meta name="description" content="Tìm hiểu thêm về Phúc Lee và hành trình chia sẻ kiến thức tiếng Hàn." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Về Tôi</h1>
          <p className="text-lg text-muted-foreground">
            Chào bạn, tôi là Phúc Lee.
          </p>
        </header>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <Avatar className="w-32 h-32">
            <AvatarImage src="https://github.com/shadcn.png" alt="@phuclee" />
            <AvatarFallback>PL</AvatarFallback>
          </Avatar>
          <p className="text-lg leading-relaxed">
            Tôi tạo ra blog này với mong muốn chia sẻ những kiến thức, kinh nghiệm và tài liệu học tiếng Hàn mà tôi đã tích lũy được. Hy vọng rằng những chia sẻ của tôi có thể giúp ích cho bạn trên con đường chinh phục ngôn ngữ thú vị này.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hành trình của tôi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Hành trình học tiếng Hàn của tôi bắt đầu từ... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
            </p>
            <p>
              Mục tiêu của blog "Tiếng Hàn Phúc Lee" là xây dựng một cộng đồng nơi mọi người có thể cùng nhau học hỏi, trao đổi và tiến bộ.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AboutPage;