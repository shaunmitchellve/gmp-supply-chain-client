import type { NextAuthConfig } from 'next-auth';
import { initializeApp } from 'firebase/app';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
       async authorized({ request, auth }) {
        console.log(auth);
            const isLoggedIn = !!auth?.user;
            
            if (isLoggedIn) return true;
            
            return false;
        },
    },
    providers: [],
} satisfies NextAuthConfig;


export const firebaseApp = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN
});