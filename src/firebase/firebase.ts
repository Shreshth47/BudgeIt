import { initializeApp, getApps, getApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET_ID",
  messagingSenderId: "YOUR_FIREBASE_MESSAGE_ID",
  appId: "YOUR_FIREBASE_APP_ID",
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
