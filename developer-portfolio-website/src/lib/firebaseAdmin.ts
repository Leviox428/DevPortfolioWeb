import admin from "firebase-admin";

if (!process.env.SERVICE_ACCOUNT_JSON) {
  throw new Error("Missing SERVICE_ACCOUNT_JSON environment variable");
}

// Parse JSON safely
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON) as admin.ServiceAccount;

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const adminDb = admin.firestore();