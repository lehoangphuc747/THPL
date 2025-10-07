import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const usesData = {
  "Phần cứng": [
    { item: "Laptop", description: "MacBook Pro M1" },
    { item: "Màn hình", description: "LG UltraFine 27-inch" },
    { item: "Bàn phím", description: "Keychron K2" },
  ],
  "Phần mềm & Code": [
    { item: "Editor", description: "Visual Studio Code" },
    { item: "Terminal", description: "iTerm2 with Oh My Zsh" },
    { item: "Framework", description: "React (Vite), Next.js" },
  ],
  "Học tập": [
    { item: "Flashcards", description: "Anki" },
    { item: "Ghi chú", description: "Notion" },
    { item: "Từ điển", description: "Naver Dictionary" },
  ],
};

const UsesPage = () => {
  return (
    <>
      <Helmet>
        <title>Uses | Tiếng Hàn Phúc Lee</title>
        <meta name="description" content="Các công cụ, phần mềm và phần cứng mà Phúc Lee sử dụng." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Công cụ tôi dùng</h1>
          <p className="text-lg text-muted-foreground">
            Danh sách các công cụ, phần mềm và phần cứng tôi sử dụng hàng ngày.
          </p>
        </header>

        <div className="space-y-8">
          {Object.entries(usesData).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {items.map((use) => (
                    <li key={use.item} className="py-3 flex justify-between">
                      <span className="font-semibold">{use.item}</span>
                      <span className="text-muted-foreground">{use.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default UsesPage;