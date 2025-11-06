// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNFILnLPDGDAJSDM-v1hVTzUXbIHly_ms",
  authDomain: "learning-platform-c696a.firebaseapp.com",
  projectId: "learning-platform-c696a",
  storageBucket: "learning-platform-c696a.appspot.com",
  messagingSenderId: "736667833549",
  appId: "1:736667833549:web:79ccab035a8d400ea44584",
  measurementId: "G-G5363WFK97",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
