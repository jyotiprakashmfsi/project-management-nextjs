import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { authService } from "@/services/client-services/auth/api"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        
        try {
          const response = await authService.login({
            email: credentials.email,
            password: credentials.password
          });
          
          if (!response.token) {
            console.log("Response", response);
            throw new Error("Invalid credentials");
          }
          console.log("Response", response);          
          
          if (response) {
            return {
              id: response.user.id?.toString(),
              email: response.user.email,
              name: response.user.fname || response.name,
              token: response.token
            };
          }
          
          throw new Error("Invalid credentials");
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/signup',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        
        if ('token' in user) {
          token.accessToken = user.token;
        }
        
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        
        if ('accessToken' in token) {
          session.user.accessToken = token.accessToken;
        }
        
        if ('provider' in token) {
          session.user.provider = token.provider;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }