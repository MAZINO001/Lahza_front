import { Send, Image, Smile, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TextareaField from "@/components/Form/TextareaField";
import { useAuthContext } from "@/hooks/AuthContext";

export default function AddComments({
  commentText,
  handleKeyPress,
  handleSubmit,
  setIsFocused,
  setCommentText,
}) {
  const maxLength = 500;
  const remainingChars = maxLength - commentText.length;
  const isNearLimit = remainingChars < 50;
  const isAtLimit = remainingChars === 0;
  const { user } = useAuthContext();
  return (
    <div className="bg-background rounded-xl border border-border">
      <div className="flex flex-col items-start gap-2 p-4 border-b border-border">
        <div className="w-full flex items-center justify-center gap-2">
          <Avatar className="w-10 h-10 border-2 border-border ring-2 ring-blue-50">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
            <AvatarFallback className="bg-linear-to-br from-purple-400 to-purple-600 text-white font-semibold">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-sm text-foreground">
                {user.name}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <TextareaField
            placeholder="Share your thoughts... (Markdown supported)"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="min-h-[100px] resize-none border-border"
          />
        </div>
      </div>

      <div className="flex items-center p-2 w-full">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium transition-colors ${
                isAtLimit
                  ? "text-red-600"
                  : isNearLimit
                    ? "text-orange-600"
                    : "text-muted-foreground"
              }`}
            >
              {remainingChars}/{maxLength}
            </span>
            {isNearLimit && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!commentText.trim() || isAtLimit}
            className={`h-9 px-5 rounded-lg font-medium transition-all ${
              !commentText.trim() || isAtLimit
                ? "bg-gray-200 text-muted-foreground cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-foreground shadow-sm hover:shadow-md"
            }`}
          >
            <Send className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
