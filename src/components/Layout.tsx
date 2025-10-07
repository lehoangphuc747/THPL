import { Outlet, useOutletContext } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useScrollDirection } from "@/hooks/useScrollDirection";

type ContextType = { scrollDirection: 'down' | 'up' | null };

const Layout = () => {
  const scrollDirection = useScrollDirection();

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Navbar scrollDirection={scrollDirection} />
      <main className="pt-16 flex-grow">
        <Outlet context={{ scrollDirection } satisfies ContextType} />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

export function usePageContext() {
  return useOutletContext<ContextType>();
}