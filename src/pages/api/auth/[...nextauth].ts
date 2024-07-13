import prisma from '@/services/db.service';
import { sendVerificationRequest } from '@/services/mail.service';
import { attemptLogin, getUserByEmail } from '@/services/user.service';
import { AvatarConfig, ResponseStatus } from '@/types/main';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '#cc4e4e', // Hex color code
    logo: 'https://phishingfun.com/images/go-phish-icon.large.png', // Absolute URL to image
    buttonText: '', // Hex color code
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await attemptLogin(credentials?.username || '', credentials?.password || '');
        if (user !== ResponseStatus.NotFound) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
    EmailProvider({
      id: 'email',
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '25'),
        auth: {
          user: process.env.EMAIL_SERVER_USERNAME,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest(params) {
        sendVerificationRequest(params);
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, trigger, account, session }) {
      // Persist the OAuth access_token to the token right after signin
      if (trigger === 'update' && session?.user) {
        token.user = session.user;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google' || account?.provider === 'email') {
        //check if user is in your database
        const dbUser = await getUserByEmail(user.email || '');
        if (dbUser === ResponseStatus.NotFound) {
          return `/auth/signup?email=${encodeURIComponent(user.email || '')}`;
          //return false;
        }
        return true;
      } else if (account?.provider === 'credentials') {
        return true;
      } else {
        return false;
      }
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      if (session.user && session.user.email) {
        const user = await getUserByEmail(session.user.email);
        if (user !== ResponseStatus.NotFound) {
          session.user.id = user.id;
          session.user.username = user.username;
          session.user.admin = user.admin;
          session.user.avatarConfig = JSON.parse(JSON.stringify(user.avatar)) as AvatarConfig;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
};

export default NextAuth(authOptions);
