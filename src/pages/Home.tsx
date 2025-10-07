import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Tiếng Hàn Phúc Lee</h1>
        <p className="text-lg text-muted-foreground">Blog cá nhân về học tiếng Hàn</p>
      </header>

      <main className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Dự án</h2>
          <ul className="space-y-2">
            <li><Link to="/bai-viet?category=Du-an" className="text-primary hover:underline">Dự án 1: Sổ tay Anki</Link></li>
            <li><Link to="/bai-viet?category=Du-an" className="text-primary hover:underline">Dự án 2: 1000 Từ Hán-Hàn</Link></li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Kinh nghiệm</h2>
          <ul className="space-y-2">
            <li><Link to="/bai-viet?category=Kinh-nghiem" className="text-primary hover:underline">Kinh nghiệm tự học TOPIK</Link></li>
            <li><Link to="/bai-viet?category=Kinh-nghiem" className="text-primary hover:underline">Cách dùng Anki hiệu quả</Link></li>
          </ul>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Home;