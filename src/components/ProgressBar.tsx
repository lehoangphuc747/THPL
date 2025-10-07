import { useState, useEffect } from 'react';

const ProgressBar = () => {
  const [scroll, setScroll] = useState(0);

  const onScroll = () => {
    const contentEl = document.querySelector('.prose');
    if (!contentEl) return;

    const contentHeight = contentEl.scrollHeight;
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Tính toán vị trí bắt đầu của content so với đầu trang
    const contentTop = contentEl.getBoundingClientRect().top + window.scrollY;

    // Chỉ bắt đầu tính khi scroll qua đầu content
    if (scrollPosition > contentTop) {
      const scrolledThroughContent = scrollPosition - contentTop;
      const totalScrollableContent = contentHeight - windowHeight;
      
      if (totalScrollableContent > 0) {
        const scrollPercent = (scrolledThroughContent / totalScrollableContent) * 100;
        setScroll(Math.min(scrollPercent, 100));
      } else {
        setScroll(100);
      }
    } else {
      setScroll(0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 w-full h-1 bg-secondary z-50">
      <div className="h-1 bg-primary" style={{ width: `${scroll}%` }} />
    </div>
  );
};

export default ProgressBar;