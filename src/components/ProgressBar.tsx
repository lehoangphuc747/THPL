import { useState, useEffect } from 'react';

const ProgressBar = () => {
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

    // The total distance to scroll through the article content.
    // This is the height of the article minus the part that is visible at once (viewport height).
    const totalScrollableDistance = articleHeight - viewportHeight;

    // If the article is shorter than the viewport, we can consider it "fully read" when in view.
    if (totalScrollableDistance <= 0) {
      if (rect.top < viewportHeight && rect.bottom > 0) {
        setScroll(100);
      } else {
        setScroll(0);
      }
      return;
    }

    // How much we have scrolled from the top of the article.
    // We only start counting when the top of the article hits the top of the viewport.
    const scrolledFromTop = scrollY - articleTop;

    if (scrolledFromTop < 0) {
      setScroll(0);
      return;
    }

    const progress = (scrolledFromTop / totalScrollableDistance) * 100;
    
    // Clamp the value between 0 and 100 to handle edge cases.
    setScroll(Math.max(0, Math.min(progress, 100)));
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    // Recalculate on resize as well, as viewport height changes.
    window.addEventListener("resize", onScroll);
    
    // Initial calculation in case the page loads mid-article
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed top-16 left-0 w-full h-1 bg-secondary z-50">
      <div 
        className="h-1 bg-primary transition-all duration-75 ease-linear" 
        style={{ width: `${scroll}%` }} 
      />
    </div>
  );
};

export default ProgressBar;