import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Helmet } from "react-helmet-async";

const projects = [
  {
    title: "Sổ tay từ vựng Anki",
    description: "Một bộ thẻ Anki được biên soạn kỹ lưỡng với hơn 5000 từ vựng tiếng Hàn thiết yếu, kèm theo âm thanh và ví dụ.",
    github: "#",
    live: "#",
  },
  {
    title: "Công cụ tra cứu Hán-Hàn",
    description: "Ứng dụng web giúp tra cứu và học 1000 từ Hán-Hàn thông dụng nhất, giúp tăng tốc độ học từ vựng.",
    github: "#",
    live: "#",
  },
  {
    title: "Blog Tiếng Hàn Phúc Lee",
    description: "Chính là trang blog này! Xây dựng bằng React, Vite, TailwindCSS và shadcn/ui để chia sẻ kiến thức.",
    github: "#",
live: "#",
  },
];

const ProjectsPage = () => {
  return (
    <>
      <Helmet>
        <title>Dự án | Tiếng Hàn Phúc Lee</title>
        <meta name="description" content="Các dự án cá nhân của Phúc Lee liên quan đến việc học và dạy tiếng Hàn." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Dự án của tôi</h1>
          <p className="text-lg text-muted-foreground">
            Các công cụ và tài liệu tôi xây dựng để hỗ trợ cộng đồng học tiếng Hàn.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.title} className="flex flex-col">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;