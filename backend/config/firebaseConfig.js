import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Make sure all required environment variables are set
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error("Missing Firebase environment variables. Check your .env file or Render secrets.");
}

// Firebase service account from environment variables
const serviceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace \n with real newlines
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firestore and Auth for other modules
export const dbAdmin = admin.firestore();
export const adminAuth = admin.auth();
export default admin;
