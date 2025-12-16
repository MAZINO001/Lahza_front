/* eslint-disable no-unused-vars */
import { useState } from "react";
import AddComments from "./addComments";
import DisplayComments from "./DisplayComments";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
} from "@/features/clients/hooks/useClientsComments";
import { useParams } from "react-router-dom";

export default function CommentInput() {
  const { id } = useParams();
  const [isFocused, setIsFocused] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { data: comments = [] } = useComments({ type: "client", id });
  const queryClient = useComments().queryClient;

  const { mutate: createComment } = useCreateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    createComment(
      { type: "client", id, data: { username: "Admin001", text: commentText } },
      {
        onSuccess: () => setCommentText(""),
      }
    );
  };

  const handleDelete = (commentId) => {
    deleteComment(commentId);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
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
      <DisplayComments comments={comments} handleDelete={handleDelete} />
    </div>
  );
}
