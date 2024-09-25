import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Comment from "./Comment";

const Comments = ({ tokenId, username }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_BASEURL, {
      transports: ["websocket"], // Ensure WebSocket connection
    });
    setSocket(newSocket);

    return () => {
      // Clean up the socket connection when the component unmounts
      if (newSocket) newSocket.disconnect();
    };
  }, []); // Run once when the component mounts

  useEffect(() => {
    if (tokenId && socket) {
      // Fetch comments from API
      axios
        .get(`${import.meta.env.VITE_BASEURL}/comments/${tokenId}`)
        .then((res) => setComments(res.data));

      // Listen for new comments from Socket.io
      socket.on("comment", (comment) => {
        setComments((prev) => [comment, ...prev]);
      });

      return () => {
        // Cleanup listeners when the component or tokenId changes
        socket.off("comment");
      };
    }
  }, [tokenId, socket]); // Re-run when tokenId or socket is updated

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = { tokenId, username, text: newComment };

    // Post new comment to API
    axios
      .post(`${import.meta.env.VITE_BASEURL}/comments`, commentData)
      .then((res) => {
        setNewComment("");
        if (socket) {
          socket.emit("comment", res.data); // Emit new comment to server
        }
      });
  };

  return (
    <div>
      <div
        style={{
          marginBlock: "1em",
          backgroundColor: "#fbffb7",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <h3>New Comment</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            username={username}
            socket={socket}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
