import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import TextareaField from "../Form/TextareaField";
export default function Comments() {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Alice",
      date: "2025-12-10",
      text: "Initial project setup done.",
    },
    {
      id: 2,
      user: "Bob",
      date: "2025-12-11",
      text: "Added main Gantt chart component.",
    },
    {
      id: 3,
      user: "Charlie",
      date: "2025-12-11",
      text: "Fixed a bug where the timeline wasn’t rendering on first load.",
    },
    {
      id: 4,
      user: "Dina",
      date: "2025-12-12",
      text: "Refactored the sidebar to make task navigation smoother.",
    },
    {
      id: 5,
      user: "Evan",
      date: "2025-12-12",
      text: "Added color indicators for overdue tasks.",
    },
    {
      id: 6,
      user: "Alice",
      date: "2025-12-13",
      text: "Improved responsiveness on smaller screens.",
    },
    {
      id: 7,
      user: "Bob",
      date: "2025-12-13",
      text: "Hooked up API for task creation — still needs validation.",
    },
    {
      id: 8,
      user: "Charlie",
      date: "2025-12-14",
      text: "Added option to drag tasks on the Gantt chart.",
    },
    {
      id: 9,
      user: "Dina",
      date: "2025-12-14",
      text: "Cleaned up unused components and optimized imports.",
    },
    {
      id: 10,
      user: "Evan",
      date: "2025-12-15",
      text: "Updated project theme colors to match brand guidelines.",
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        user: "You",
        date: new Date().toLocaleDateString(),
        text: newComment,
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`flex ${comment.user === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
          max-w-[70%] p-3 rounded-xl 
          ${comment.user === "You" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-foreground rounded-bl-none"}
        `}
            >
              <div className="text-xs opacity-70 mb-1 flex justify-between">
                <span>{comment.user}</span>
                <span>{comment.date}</span>
              </div>
              <p className="text-sm leading-snug wrap-break-word">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex gap-4 mt-4">
        <div className="min-w-[85%]">
          <TextareaField
            rows={1}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAddComment}
          className="cursor-pointer h-full w-[15%]"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
