import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Comment from "./Comment";

const socket = io("http://localhost:5000");

const Comments = ({ tokenId, userName }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (tokenId) {
      // Fetch comments from API
      axios
        .get(`http://localhost:5000/comments/${tokenId}`)
        .then((res) => setComments(res.data));

      // Listen for new comments from Socket.io
      socket.on("comment", (comment) => {
        setComments((prev) => [comment, ...prev]);
      });
    }

    return () => {
      socket.off("comment");
    };
  }, [tokenId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = { tokenId, username: userName, text: newComment };

    // Post new comment to API
    axios.post("http://localhost:5000/comments", commentData).then((res) => {
      setNewComment("");
      socket.emit("comment", res.data); // Emit new comment to server
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} userName={userName} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
