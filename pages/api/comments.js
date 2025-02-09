import { connectDB } from "../../utils/db";
import Comment from "../../models/Comment";
import { getToken } from "next-auth/jwt"; // Import for token decoding

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await getToken({ req }); // Decode token to get user info

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Create the comment using user information from the token
    const newComment = new Comment({
      text: req.body.text,
      user: user.sub, // Use user ID from the token
    });

    try {
      await newComment.save();
      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create comment" });
    }
  }

  if (req.method === "GET") {
    const comments = await Comment.find().populate("user");
    return res.status(200).json(comments);
  }

  return res.status(405).end(); // Method Not Allowed
}
