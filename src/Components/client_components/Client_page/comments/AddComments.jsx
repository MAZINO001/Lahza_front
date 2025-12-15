/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Send, Image, Smile, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TextareaField from "@/components/Form/TextareaField";

export default function AddComments({
  commentText,
  handleKeyPress,
  handleSubmit,
  setIsFocused,
  setCommentText,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-start gap-4 p-4 border-b border-gray-100">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-gray-900">Your Name</span>
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
  );
}
