import admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { getAuth as getClientAuth } from "firebase/auth";
import { getFirestore as getClientFirestore } from "firebase/firestore";
import { getStorage as getClientStorage } from "firebase/storage";
import fs from "fs";
import path from "path";

// ------------------- Admin SDK -------------------
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("./config/serviceAccountKey.json"), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "learning-platform-c696a.appspot.com",
});

export const dbAdmin = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage().bucket();

// ------------------- Client SDK (optional, for frontend usage) -------------------
const firebaseConfig = {
  apiKey: "AIzaSyBNFILnLPDGDAJSDM-v1hVTzUXbIHly_ms",
  authDomain: "learning-platform-c696a.firebaseapp.com",
  projectId: "learning-platform-c696a",
  storageBucket: "learning-platform-c696a.appspot.com",
  messagingSenderId: "736667833549",
  appId: "1:736667833549:web:79ccab035a8d400ea44584",
  measurementId: "G-G5363WFK97",
};

export const app = initializeClientApp(firebaseConfig);
export const auth = getClientAuth(app);
export const db = getClientFirestore(app);
export const storage = getClientStorage(app);
