import CredentialsProvider from "next-auth/providers/credentials";
import getMongoClient from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const client = await getMongoClient();
          const user = await client.db("ForUynDB").collection("users").findOne({ email });

          if (!user) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) return null;

          return { id: user._id.toString(), name: user.name, email: user.email };
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],

  // ✅ Thêm phần này
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};