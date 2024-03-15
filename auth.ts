import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { setupFirebaseApp } from '@/app/lib/firebase';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from '@/app/lib/user';

export const { auth, signIn, signOut } =  NextAuth({
    ...authConfig,
    providers: [
      Credentials({
        async authorize(credentials){
          const firebaseApp = await setupFirebaseApp();

            const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6)})
            .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;

                try {
                  const userCredential = await signInWithEmailAndPassword(getAuth(firebaseApp), email, password);

                  const user = new User(userCredential.user.uid, email);
                  user.emailVerified = userCredential.user.emailVerified;

                  if (user.email?.includes("admin_")) {
                    user.isAdmin = true;
                  }

                  return user;
                } catch (error: any) {
                  console.log("FIREBAE AUTH ERROR: ", error)
                  return null;
                }
            }

            console.log('Invalid credentials');
            return null;
        },
    })],
});