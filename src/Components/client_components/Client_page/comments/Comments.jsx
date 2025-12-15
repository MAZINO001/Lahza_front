/* eslint-disable no-unused-vars */
import { useState } from "react";
import AddComments from "./addComments";
import DisplayComments from "./DisplayComments";

export default function CommentInput() {
  const handleDelete = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

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
  const [isFocused, setIsFocused] = useState(false);
  const [commentText, setCommentText] = useState("");

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
      <AddComments
        commentText={commentText}
        handleKeyPress={handleKeyPress}
        handleSubmit={handleSubmit}
        setIsFocused={setIsFocused}
        setCommentText={setCommentText}
      />
      {/* comments list part  */}
      <DisplayComments comments={comments} handleDelete={handleDelete} />
    </div>
  );
}
