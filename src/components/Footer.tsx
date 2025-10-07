import { Github, Facebook, Mail } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tiếng Hàn Phúc Lee. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:example@example.com" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;