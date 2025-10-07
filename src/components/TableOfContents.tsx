import { useState, useEffect, useRef } from 'react';
import { Heading } from '@/types/post';
import { List } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px -70% 0px"
    });

    const elements = headings.map(h => document.getElementById(h.slug)).filter(Boolean);
    elements.forEach(el => observer.current?.observe(el!));

    return () => observer.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <Collapsible defaultOpen className="mb-8 p-4 border rounded-lg bg-muted/50">
      <CollapsibleTrigger className="flex items-center gap-2 font-semibold">
        <List className="w-4 h-4" />
        Mục lục
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-4 space-y-2">
          {headings.map(heading => (
            <li key={heading.slug} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
              <a
                href={`#${heading.slug}`}
                className={`transition-colors hover:text-primary ${activeId === heading.slug ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TableOfContents;