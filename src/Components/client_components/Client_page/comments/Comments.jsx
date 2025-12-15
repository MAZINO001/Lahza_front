/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Send,
  Image,
  Smile,
  AtSign,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TextareaField from "@/components/Form/TextareaField";

export default function CommentInput() {
  const [isFocused, setIsFocused] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "Admin001",
      text: "sgdfgsdfgsdfgsdg",
      timestamp: "15 DEC 2025 08:48 AM",
    },
    {
      id: 2,
      username: "Admin001",
      text: "ssdfgsdfgsd",
      timestamp: "15 DEC 2025 08:48 AM",
    },
    {
      id: 3,
      username: "Admin001",
      text: "sgdfgsdfgsdfg",
      timestamp: "15 DEC 2025 08:48 AM",
    },
    {
      id: 4,
      username: "Admin001",
      text: ":,x!;,b,cv!b;,x!c:v;b",
      timestamp: "15 DEC 2025 08:48 AM",
    },
    {
      id: 5,
      username: "Admin001",
      text: "hfsghdfghkmldfkl",
      timestamp: "15 DEC 2025 08:45 AM",
    },
  ]);

  const handleDelete = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      username: "Admin001",
      text: commentText,
      timestamp: new Date().toLocaleString(),
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-start gap-4 p-4 border-b border-gray-100">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm text-gray-900">
                Your Name
              </span>
              <span className="text-xs text-gray-500">@username</span>
            </div>

            <TextareaField
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-200"
            >
              <Image className="h-4 w-4 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-200"
            >
              <Smile className="h-4 w-4 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-200"
            >
              <AtSign className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span>{commentText.length}/500</span>
            <Button
              onClick={handleSubmit}
              disabled={!commentText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white
              disabled:bg-gray-300 disabled:text-gray-500 h-9 px-4"
            >
              <Send className="h-4 w-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
      </div>
      {/* comments list part  */}
      <div className="w-full mt-4">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">
            Comments ({comments.length})
          </h2>
        </div>

        <div className="space-y-0">
          {comments.length === 0 ? (
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
                  <Avatar className="w-8 h-8 border border-gray-200">
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
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
