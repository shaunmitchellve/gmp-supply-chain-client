import { initializeApp } from 'firebase/app';
import { CustomProvider, initializeAppCheck  } from 'firebase/app-check';
import { CreateToken } from '@/app/lib/firebase-admin';
import { getSecret } from '@/app/lib/secrets-manager';

export async function setupFirebaseApp() {
  try {
    const [apiKey, authDomain, appId] = await Promise.allSettled([
      getSecret('FIREBASE_API_KEY'),
      getSecret('FIREBASE_AUTH_DOMAIN'),
      getSecret('FIREBASE_APP_ID')
    ]);

    if (apiKey.status === "rejected" ||
        authDomain.status === "rejected" ||
        appId.status === "rejected") {
          throw new Error("Unable to pull Firebase secrets, one or more calls were rejected");
    }

    const firebaseApp = initializeApp({
      apiKey: apiKey.value,
      authDomain: authDomain.value,
      appId: appId.value ,
      projectId: process.env.PROJECT_ID,
    });

    initializeAppCheck(firebaseApp, {
      provider: appCheckCustomProvider,
      isTokenAutoRefreshEnabled: true
    });

    return firebaseApp;
  } catch (err) {
    throw err;
  }
}

/*
* Setup App Check for all client side Firebase app usage
*/
const appCheckCustomProvider = new CustomProvider({
  getToken: () => {
    return new Promise(async (resolve, _reject) => {
      try {
        const appCheckToken = await CreateToken();

        resolve({
          token: appCheckToken.token,
          expireTimeMillis: Date.now() + appCheckToken.ttlMillis,
        });
        
      } catch (err) {
        _reject(err);
      } 
    });
  }
});