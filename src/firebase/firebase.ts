import { initializeApp, getApps, getApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMJkR6uRcNvXHhIry88qwTl62WF6cW_nU",
  authDomain: "budge-it-746dd.firebaseapp.com",
  projectId: "budge-it-746dd",
  storageBucket: "budge-it-746dd.firebasestorage.app",
  messagingSenderId: "1076967991575",
  appId: "1:1076967991575:web:3c76dc307c9be447696f52",
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;

try {
  auth = firebaseAuth.initializeAuth(app, {
    persistence: (firebaseAuth as any).getReactNativePersistence(
      ReactNativeAsyncStorage,
    ),
  });
} catch {
  auth = firebaseAuth.getAuth(app);
}

export { auth };

export const db = getFirestore(app);

export default app;
