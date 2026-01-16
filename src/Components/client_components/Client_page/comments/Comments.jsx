import { useState } from "react";
import AddComments from "./addComments";
import DisplayComments from "./DisplayComments";
import {
  useAllCommentsByType,
  useCreateComment,
  useDeleteComment,
} from "@/features/clients/hooks/useClientsComments";
import { useParams } from "react-router-dom";

export default function Comments({ type, currentId }) {
  const { id } = useParams();
  const [isFocused, setIsFocused] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { data: comments = [] } = useAllCommentsByType(type, currentId);
  const { mutate: createComment } = useCreateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    createComment(
      {
        type,
        id,
        data: {
          body: commentText,
          is_internal: false,
        },
      },
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
