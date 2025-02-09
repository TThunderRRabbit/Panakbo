import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CommentBox() {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // Fetch comments when the page loads
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    // Log the session to verify if it's populated
    console.log("Session data: ", session);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`, // Ensure session token is passed here
      },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setText("");
    } else {
      const error = await res.json();
      console.error("Failed to post comment", error); // This will show the error from backend
    }
  };

  return (
    <div>
      <h2>Comments</h2>

      {session ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Post</button>
          </form>
        </>
      ) : (
        <p>You need to log in to comment.</p>
      )}

      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
}
