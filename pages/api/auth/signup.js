import User from "../../../models/User";
import { connectDB } from "../../../utils/db";
import bcrypt from "bcryptjs";
import "../../../ui/css/blog-app.css";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();

  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
}
