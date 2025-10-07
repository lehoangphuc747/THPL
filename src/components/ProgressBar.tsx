import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  scrollDirection: 'down' | 'up' | null;
}

const ProgressBar = ({ scrollDirection }: ProgressBarProps) => {
  const [scroll, setScroll] = useState(0);

  const onScroll = () => {
    const articleEl = document.querySelector('article');
    if (!articleEl) {
      setScroll(0);
      return;
    }

    const rect = articleEl.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const articleHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const totalScrollableDistance = articleHeight - viewportHeight;

    if (totalScrollableDistance <= 0) {
      if (rect.top < viewportHeight && rect.bottom > 0) {
        setScroll(100);
      } else {
        setScroll(0);
      }
      return;
    }

    const scrolledFromTop = scrollY - articleTop;

    if (scrolledFromTop < 0) {
      setScroll(0);
      return;
    }

    const progress = (scrolledFromTop / totalScrollableDistance) * 100;
    
    setScroll(Math.max(0, Math.min(progress, 100)));
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={cn(
      "fixed left-0 w-full h-1 bg-secondary z-50 transition-all duration-300",
      scrollDirection === 'down' ? 'top-0' : 'top-16'
    )}>
      <div 
        className="h-1 bg-primary transition-all duration-75 ease-linear" 
        style={{ width: `${scroll}%` }} 
      />
    </div>
  );
};

export default ProgressBar;