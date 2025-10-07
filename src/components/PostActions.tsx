import { Button } from "@/components/ui/button";
import { Share2, Book } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface PostActionsProps {
  isReaderMode: boolean;
  onToggleReaderMode: () => void;
}

const PostActions = ({ isReaderMode, onToggleReaderMode }: PostActionsProps) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showSuccess("Đã sao chép liên kết!");
  };

  return (
    <div className="flex items-center gap-2 mb-8">
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="w-4 h-4 mr-2" />
        Chia sẻ
      </Button>
      <Button variant="outline" size="sm" onClick={onToggleReaderMode}>
        <Book className="w-4 h-4 mr-2" />
        {isReaderMode ? "Tắt chế độ đọc" : "Chế độ đọc"}
      </Button>
    </div>
  );
};

export default PostActions;