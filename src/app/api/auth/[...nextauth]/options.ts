import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<string, string> | undefined,
      ): Promise<User> {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Missing credentials');
        }
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier },
                { username: credentials.identifier },
              ],
            },
          });

          if (!user) {
            throw new Error('No user found with this email/username');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your accound before login');
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user) {
          token.id = user.id?.toString();
          token.isVerified = user.isVerified;
          token.isAcceptingMessage = user.isAcceptingMessage;
          token.username = user.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.isVerified = token.isVerified as boolean;
          session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
          session.user.username = token.username as string;
        }
      }
      return session;
    },
  },
};
