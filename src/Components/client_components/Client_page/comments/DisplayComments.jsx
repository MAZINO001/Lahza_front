import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DisplayComments({ comments, handleDelete }) {
  return (
    <div className="w-full mt-4">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">
          Comments ({comments?.length || 0})
        </h2>
      </div>

      <div className="space-y-0">
        {comments?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Add your comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group"
            >
              <div className="shrink-0 pt-1">
                <Avatar className="w-8 h-8 border border-border">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {comment.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.username}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 uppercase">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-700 wrap-break-word">
                  {comment.text}
                </p>
              </div>

              <div className="shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
