import NextAuth, { NextAuthOptions } from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import type { Account, User, Session } from "next-auth";
import { query } from "@/lib/db";

const authOptions: NextAuthOptions = {
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin", // ✅ Redirects to custom sign-in page at `/signin`
  },
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      try {
        if (!user || !account) return false;
        console.log("User:", user);
        console.log("Account:", account);
        const provider = account.provider;

        // ✅ Ensure `existingUser` is typed correctly
        const existingUser = await query<{ id: string }>(
          "SELECT id FROM users WHERE id = ?",
          [user.id]
        );
        console.log("Existing User:", existingUser);

        if (existingUser.length === 0) {
          await query(
            "INSERT INTO users (id, name, email, image, provider) VALUES (?, ?, ?, ?, ?)",
            [user.id, user.name, user.email, user.image, provider]
          );
        } else {
          await query(
            "UPDATE users SET name = ?, image = ?, provider = ? WHERE id = ?",
            [user.name, user.image, provider, user.id]
          );
        }
      } catch (error) {
        console.error("Database error:", error);
        return false;
      }
      return true;
    },
    async session({ session, token }: { session: Session; token: any }) {
      console.log("Session:", session);
      console.log("Token:", token);
      if (token.sub) {
        session.user = {
          ...session.user,
          id: token.sub, // ✅ Now TypeScript recognizes `id`
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl; // ✅ Redirect user to homepage (`/`) after login
    },
  },
};

// ✅ Correct NextAuth API handling in Next.js App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
