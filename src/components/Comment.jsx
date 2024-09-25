/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";

const Comment = ({ comment, username, socket }) => {
  console.log("comment :", comment);
  const [reply, setReply] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(comment?.likes?.includes(username)); // Check if the current user has liked the comment
  const [likesCount, setLikesCount] = useState(comment?.likes?.length); // Track total likes for the comment

  const [replies, setReplies] = useState(comment?.replies || []); // Initialize with existing replies

  const handleLike = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASEURL}/comments/like`, {
        commentId: comment._id,
        username,
      });
      setIsLiked(!isLiked); // Toggle the like state
      setLikesCount(res.data.likes.length); // Update the like count
      socket.emit("like", { commentId: comment._id, likes: res.data.likes }); // Emit the like event with updated likes
    } catch (err) {
      console.error("Error liking comment", err);
    }
  };

  const handleReplyLike = async (replyIndex) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/comments/reply/like`,
        {
          commentId: comment._id,
          replyIndex,
          username,
        }
      );
      // Update reply state after liking/unliking
      const updatedReplies = [...replies];
      updatedReplies[replyIndex].likes = res.data.likes;
      setReplies(updatedReplies);
      socket.emit("replyLike", {
        commentId: comment._id,
        replyIndex,
        likes: res.data.likes,
      });
    } catch (err) {
      console.error("Error liking reply", err);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (reply.trim() === "") return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASEURL}/comments/reply`, {
        commentId: comment._id,
        username,
        text: reply,
      });
      setReply("");
      socket.emit("reply", res.data); // Emit the reply to the server
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  useEffect(() => {
    // Listen for new replies via socket
    socket.on("reply", (newReply) => {
      setReplies((prevReplies) => [...prevReplies, newReply]);
    });

    // Listen for like updates on comments
    socket.on("like", ({ commentId, likes }) => {
      if (commentId === comment._id) {
        setLikesCount(likes.length); // Update like count
        setIsLiked(likes.includes(username)); // Update the like button status for the current user
      }
    });

    // Listen for like updates on replies
    socket.on("replyLike", ({ commentId, replyIndex, likes }) => {
      if (commentId === comment._id) {
        const updatedReplies = [...replies];
        updatedReplies[replyIndex].likes = likes; // Update the likes array in the specific reply
        setReplies(updatedReplies); // Update the state with the new likes
      }
    });

    return () => {
      socket.off("reply");
      socket.off("like");
      socket.off("replyLike");
    };
  }, [comment._id, username, replies, socket]);
useEffect(()=>{
if(comment){
  setIsLiked(comment?.likes?.includes(username))
}
},[comment,username])
  return (
    <div
      style={{
        marginBlock: "1em",
        backgroundColor: "#dbe3ea",
        padding: "20px",
        borderRadius: "15px",
      }}
    >
      <div>
        <strong>{comment.username}</strong>: {comment.text}
        <button
          style={{ color: isLiked ? "red" : "black" }}
          onClick={handleLike}
        >
          {isLiked ? "Unlike" : "Like"} ({likesCount})
        </button>
      </div>
      <button onClick={() => setShowReplies(!showReplies)}>
        {showReplies ? "Hide Replies" : "View Replies"}
      </button>
      {showReplies && (
        <div>
          <div style={{ marginLeft: "1em" }}>
            {replies.map((reply, index) => (
              <div key={index}>
                <strong>{reply?.username}</strong>: {reply?.text}
                <button
                  style={{
                    color: reply?.likes?.includes(username) ? "red" : "black",
                  }}
                  onClick={() => handleReplyLike(index)}
                >
                  {reply?.likes?.includes(username) ? "Unlike" : "Like"} (
                  {reply?.likes?.length || 0})
                </button>
              </div>
            ))}
          </div>
          <form style={{ marginLeft: "1em" }} onSubmit={handleReply}>
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
    </div>
  );
};

export default Comment;
