// const { initializeApp, applicationDefault } = require('firebase-admin/app');
import { GoogleAuth } from 'google-auth-library';
import { GoogleOAuthAccessToken } from 'firebase-admin/app';
import { getSecret } from '@/app/lib/secrets-manager';
import fs from 'fs'
import path from 'path'

const GCLOUD_CREDENTIAL_SUFFIX = 'gcloud/application_default_credentials.json'
const GCLOUD_CREDENTIAL_PATH = path.resolve(`${process.env.HOME}/.config`, GCLOUD_CREDENTIAL_SUFFIX)

async function initializeAdminApp(){
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
            credential: await impersonateServiceAccount(FB_SA),
            projectId: process.env.PROJECT_ID,
            serviceAccountId: FB_SA,
        }, 'admin');
    }

    return adminApp;
}

export async function CreateToken() {
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


/**
 * A credential provider for Firebase Admin SDK that uses google-auth-library
 * Workaround for App Check to use google-aut-library
 * @orignal_author Lachlan Donald
 * https://gist.github.com/lox/8bff5607c3e713c92a03a631796ab3f3
 */
class GoogleAuthCredential {
  private credentials: any;
  /**
   * @param credentials
   */
  constructor(credentials: any) {
    this.credentials = credentials;
  }

  /**
   * Gets the access token for the credential.
   * @returns {Promise<{access_token: string, expires_in: number}>}}
   */
  async getAccessToken(): Promise<GoogleOAuthAccessToken> {
    const auth = new GoogleAuth({
      credentials: this.credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const res = await client.getAccessToken();

    if (!res.token) {
        throw Error("Unable to get access token");
    }

    return {
      access_token: res.token,
      expires_in: new Date().getTime() / 1000 + res.res?.data?.expires_in,
    }
  }
}
  
/**
 * @param {string} serviceAccount
 * @returns {import('firebase-admin').credential.Credential}
 */
async function impersonateServiceAccount(serviceAccount:string) {
  const sourceCreds = JSON.parse(fs.readFileSync(GCLOUD_CREDENTIAL_PATH, 'utf-8'))
  if (sourceCreds.type !== 'authorized_user') {
    throw new Error('Expected source credentials to be authorized_user')
  }

  return new GoogleAuthCredential({
    delegates: [],
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`,
    source_credentials: sourceCreds,
    type: 'impersonated_service_account',
  })
}
