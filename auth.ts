import NextAuth from 'next-auth';
import { authConfig, firebaseApp } from './auth.config';
import { signInWithEmailAndPassword, getAuth, UserCredential } from 'firebase/auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from '@/app/lib/definitions';

function getUser(userCredential: UserCredential): User {
  return {
    id: userCredential.user.uid,
    name: userCredential.user.displayName,
    email: userCredential.user.email,
    emailVerified: userCredential.user.emailVerified,
    password: null,
  }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials){
            const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6)})
            .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                try {
                  const userCredential = await signInWithEmailAndPassword(getAuth(firebaseApp), email, password);

                  return getUser(userCredential);
                } catch (error: any) {
                  console.log(error.code);
                  return null;
                }
            }

            console.log('Invalid credentials');
            return null;
        },
    })],
});