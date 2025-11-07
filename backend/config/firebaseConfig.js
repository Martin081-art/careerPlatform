import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Named exports for other modules
export const dbAdmin = admin.firestore();
export const adminAuth = admin.auth();

export default admin;
