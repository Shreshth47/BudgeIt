import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMJkR6uRcNvXHhIry88qwTl62WF6cW_nU",
  authDomain: "budge-it-746dd.firebaseapp.com",
  projectId: "budge-it-746dd",
  storageBucket: "budge-it-746dd.firebasestorage.app",
  messagingSenderId: "1076967991575",
  appId: "1:1076967991575:web:3c76dc307c9be447696f52",
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;