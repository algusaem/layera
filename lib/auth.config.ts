import type { NextAuthConfig } from "next-auth";
import { prisma } from "./prisma";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/collection/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = ["/collection", "/collection/add", "/ask"];
      const authRoutes = ["/collection/login", "/collection/register"];

      const isProtectedRoute = protectedRoutes.some(
        (route) => nextUrl.pathname === route
      );
      const isAuthRoute = authRoutes.some(
        (route) => nextUrl.pathname === route
      );

      // Redirect logged-in users away from auth pages
      if (isAuthRoute && isLoggedIn) {
        const redirectUrl = auth?.user?.role === "ADMIN" ? "/admin" : "/collection";
        return Response.redirect(new URL(redirectUrl, nextUrl));
      }

      // Redirect non-logged-in users to login
      if (isProtectedRoute && !isLoggedIn) {
        return false; // Will redirect to signIn page
      }

      return true;
    },
  },
  providers: [], // Providers added in auth.ts
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        const array = new Uint8Array(32);
        globalThis.crypto.getRandomValues(array);
        const token = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await prisma.session.create({
          data: {
            userId: user.id,
            token,
            expiresAt,
          },
        });
      }
    },
    async signOut(message) {
      if ("token" in message && message.token?.id) {
        await prisma.session.deleteMany({
          where: { userId: message.token.id as string },
        });
      }
    },
  },
};
