import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-bold text-lg">
          Tiếng Hàn Phúc Lee
        </NavLink>
        <div className="flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary"}>
            Trang chủ
          </NavLink>
          <NavLink to="/bai-viet" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary"}>
            Bài viết
          </NavLink>
          <NavLink to="/tim-kiem" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary"}>
            Tìm kiếm
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;