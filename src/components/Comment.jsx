/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const Comment = ({ comment,userName }) => {
  const [reply, setReply] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []); // Initialize with existing replies
  const socket = io("http://localhost:5000");

  console.log("CommentID : ", comment._id);

  const handleReply = async (e) => {
    e.preventDefault();
    if (reply.trim() === "") return;

    try {
      const res = await axios.post(`http://localhost:5000/comments/reply`, {
        commentId: comment._id,
        username: userName, // Replace with actual user
        text: reply,
      });

      // Add the new reply to the state
      // setReplies([...replies, res.data]);
      setReply("");

      // Emit the reply to the server
      socket.emit("reply", res.data);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };
  useEffect(() => {
    socket.on("reply", (newReply) => {
      setReplies((prevReplies) => [...prevReplies, newReply]);
    });

    return () => {
      socket.off("reply");
    };
  }, []);
  return (
    <div style={{ marginBottom: "1em" }}>
      <div>
        <strong>{comment.username}</strong>: {comment.text}
      </div>
      <button onClick={() => setShowReplies(!showReplies)}>
        {showReplies ? "Hide Replies" : "View Replies"}
      </button>
      {showReplies && (
        <div>
          <div style={{ marginLeft: "1em" }}>
            {replies.map((reply, index) => (
              <div key={index}>
                <strong>{reply.username}</strong>: {reply.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleReply}>
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply..."
            />
            <button type="submit">Reply</button>
          </form>
        </div>
      )}
      <hr />
    </div>
  );
};

export default Comment;
