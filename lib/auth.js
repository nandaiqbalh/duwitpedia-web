import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions = {
  debug: true, // Enable debug mode to see detailed logs
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email,
            deletedAt: null,
          },
          include: {
            subscription: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error instead of default error page
  },
  callbacks: {
    async signIn({ user, account, profile }) { 
      try {
        if (!user.email) {
          return false;
        }

        // For credentials provider, user is already authenticated in authorize()
        if (account?.provider === "credentials") {
          return true;
        }
        
        // For Google provider, find or create user
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {          
          // Create user with subscription in one transaction using nested create
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              role: "USER",
              subscription: {
                create: {
                  subscriptionStatus: "PRO",
                  approvalStatus: "ACTIVE",
                  subscriptionStart: new Date(),
                  subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
                },
              },
            },
            include: {
              subscription: true,
            },
          });
        } 

        // Store user id for later use
        user.id = dbUser.id;
        user.role = dbUser.role;

        return true;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.sessionId = Math.random().toString(36).substring(2, 15);
        token.issuedAt = Date.now();
      }
      
      // On signout trigger, return null to invalidate token
      if (trigger === "signOut") {
        return null;
      }
      
      // Fetch latest user data on subsequent calls - validate user still exists
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, deletedAt: true },
        });
        
        if (dbUser && !dbUser.deletedAt) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        } else {
          // User deleted or not found - invalidate token
          return null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        return redirectUrl;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      return baseUrl;
    },
    signOut: async ({ token }) => {
      // Token will be invalidated by returning null in jwt callback
      return true;
    },
  },
};
