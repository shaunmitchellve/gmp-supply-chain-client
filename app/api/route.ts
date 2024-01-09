import { getSecret } from '@/app/lib/secrets-manager';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto

/**
 * 
 * Get a secret from the Google Secret Manager using ADC. Used to get a secret from the client side.
 * 
 * WARNING: The secret will be transmitted in clear text and can be inspected. The secrets shouldn't be
 * that sensative and only be used so you can centrally manage these settings / secrets instead of having
 * to use environment variables with a need to re-compile if they change.
 * 
 * @param {Request} request The interface of the Fetch API Request object
 * @returns {Promise<NextResponse>} Either a success object with the secret key or the error message
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key');

    if (key !== null) {
        try {
            const secret = await getSecret(key);

            return NextResponse.json(
                { key: secret },
                { status: 200 }
            );
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { error: (err as Error).message },
                { status: 500 }
            );
        }
    }

    return NextResponse.json(
        { error: 'Internal Server Error, no key lookup'},
        { status: 500 }
    )
}