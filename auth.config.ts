import { AdapterUser } from '@auth/core/adapters';
import type {NextAuthConfig} from 'next-auth';
import {v4 as uuidv4} from 'uuid';

const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async authorized({request: {nextUrl}, auth}) {
      const isLoggedIn = !!auth?.user;

      if (isLoggedIn) {
        if (nextUrl.pathname === '/auth/signin') {
          return Response.redirect(new URL('/', nextUrl));
        }

        if (nextUrl.pathname === '/admin') {
          if (!auth.isAdmin) {
            return Response.redirect(
              new URL('/auth/error?error=accessdenied', nextUrl)
            );
          }
        }

        return true;
      }
      return false;
    },
    async jwt({token, user}) {
      // @todo: Add in hook for verififing email
      if (user) {
        token.emailVerified = (user as any).emailVerified;
        token.isAdmin = (user as any).isAdmin;
        token.email = user.email;
      }

      return token;
    },
    async session({session, token}) {
      (session as any).isAdmin = token.isAdmin;
      if (session.user !== undefined && token.email) {
        session.user.email = token.email;
        if (token.sub) {
          (session.user as any).id = token.sub;
        }
      }

      return session;
    },
  },
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
    generateSessionToken: () => {
      return uuidv4();
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
