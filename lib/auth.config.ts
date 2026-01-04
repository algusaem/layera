import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/collection/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
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
        return Response.redirect(new URL("/collection", nextUrl));
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
};
