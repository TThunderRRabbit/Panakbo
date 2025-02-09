// /pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import { connectDB } from "../../../utils/db";

export default NextAuth({
  session: {
    strategy: "jwt", // Use JWT session strategy
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return { id: user._id, email: user.email };
      },
    }),
  ],
  callbacks: {
    async session(session, user) {
      // Store user data in session
      if (user) {
        session.user.id = user.id;
        session.user.email = user.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
