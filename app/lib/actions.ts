'use server';

import { signIn } from '@/auth';
import type { AuthError } from '@auth/core/errors';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', Object.fromEntries(formData), {redirectTo: "/"});
    } catch (error) {
        if((error as AuthError).message.toLowerCase().includes('credentialssignin')) {
            return 'CredentialsSignin';
        }
        throw error;
    }
}

export async function getMockData() {
   return require('./data/mock_travel.json');
}