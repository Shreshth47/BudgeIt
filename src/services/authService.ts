import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "@/firebase/firebase";

export async function signUp(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await sendEmailVerification(credential.user);

  return credential.user;
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  await credential.user.reload();

  if (!credential.user.emailVerified) {
    await signOut(auth);

    throw new Error("Please verify your email before logging in.");
  }

  return credential.user;
}

export async function logout() {
  return signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function isEmailVerified() {
  const user = auth.currentUser;

  if (!user) {
    return false;
  }

  await user.reload();

  return user.emailVerified;
}

export async function resendVerificationEmail() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user.");
  }

  await sendEmailVerification(user);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(
    auth,
    email.trim(),
  );
}