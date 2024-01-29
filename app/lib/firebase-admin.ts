import { getSecret } from '@/app/lib/secrets-manager';

export async function initializeAdminApp(){
    const app = await import('firebase-admin/app');
    let adminApp;

    const FB_SA = await getSecret("FIREBASE_SA");

    if (!FB_SA) {
      throw new Error("Unable to get Firebase Service Account");
    }

    try {
        adminApp = app.getApp('admin');
    } catch (error) {
        adminApp = app.initializeApp({
            credential: app.applicationDefault(),
            projectId: process.env.PROJECT_ID,
            serviceAccountId: FB_SA,
        }, 'admin');
    }

    return adminApp;
}

export async function createToken() {
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

export async function getFireStore() {
    const admin = await initializeAdminApp();
    const fs = await import('firebase-admin/firestore');
    return fs.getFirestore(admin);
}