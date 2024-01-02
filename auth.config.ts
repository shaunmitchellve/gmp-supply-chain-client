import type { NextAuthConfig } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

const authConfig = {
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
       async authorized({ request: { nextUrl }, auth }) {
            const isLoggedIn = !!auth?.user;
            
            if (isLoggedIn) {
               if (nextUrl.pathname === '/auth/signin') {
                    return Response.redirect(new URL('/', nextUrl));
                }

                if (nextUrl.pathname === '/admin') {
                    if (!auth.admin) {
                        return Response.redirect(new URL('/auth/error?error=accessdenied', nextUrl));;
                    }
                }

                return true;
            }
            return false;
        },
        async jwt({ token, user }) { // @todo: Add in hook for verififing email
            if (user) {
                token.emailVerified = user.emailVerified;

                if (user.email?.includes("admin_")) {
                    token.admin = true;
                } else {
                    token.admin = false;
                }
            }

            return token;
        },
        async session({ session, token }) {
               if (token.admin) {
                session.admin = token.admin
            }

            return session;
        }
    },
    providers: [],
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60, // 1 hour
        generateSessionToken: () => {
            return uuidv4();
        }
    },
} satisfies NextAuthConfig;

export default authConfig;