import { MessageSquare, Trash2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DisplayComments({ comments, handleDelete }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
            <p className="text-xs text-gray-500">
              {comments?.length || 0} comments
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-0">
        {comments?.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium mb-1">No comments yet</p>
            <p className="text-sm text-gray-400">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id}
              className="flex gap-3 py-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-3 -mx-3 rounded-lg transition-all group"
            >
              <div className="shrink-0 pt-1">
                <Avatar className="w-10 h-10 border-2 border-gray-200 ring-2 ring-white">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
                  />
                  <AvatarFallback className="bg-linear-to-br from-blue-400 to-blue-600 text-white text-sm font-semibold">
                    {comment.user_id}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.user_id}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      Member
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(comment.created_at)}</span>
                    </div>
                    {index === 0 && (
                      <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Latest
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
