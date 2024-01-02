
import { initializeApp } from 'firebase/app';
import { CustomProvider, initializeAppCheck  } from 'firebase/app-check';
import { initializeAdminApp } from '@/app/lib/firebase-admin';
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
  getToken: async () => {
    const appCheckToken = await CreateToken();

    return new Promise((resolve, _reject) => {
      resolve({
        token: appCheckToken.token,
        expireTimeMillis: Date.now() + appCheckToken.ttlMillis,
      })
    });
  }
});

async function CreateToken() {
  try {
      const adminApp = await initializeAdminApp();
      const appCheck = await import('firebase-admin/app-check');
      const appCheckApp = appCheck.getAppCheck(adminApp);

      const ttl = 60 * 60 * 1000; // 1 hour

      const token = await appCheckApp.createToken(await getSecret("FIREBASE_APP_ID"),
      {
          ttlMillis: ttl
      });
  
      return token;
  } catch (err) {
      throw err;
  }
}