import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { UserDocument } from "@/types/user";
import { deleteAllTransactions } from "./transactionService";
import { deleteAllNotifications } from "./notificationService";

const USERS_COLLECTION = "users";

export async function createUserDocument(user: UserDocument) {
  const ref = doc(db, USERS_COLLECTION, user.uid);

  await setDoc(ref, user);
}

export async function getUserDocument(uid: string) {
  const ref = doc(db, USERS_COLLECTION, uid);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserDocument;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserDocument>,
) {
  const ref = doc(db, USERS_COLLECTION, uid);

  await updateDoc(ref, data);
}

export async function hasCompletedOnboarding(uid: string) {
  const user = await getUserDocument(uid);

  if (!user) {
    return false;
  }

  return user.hasCompletedOnboarding;
}

export async function resetUserProfile(uid: string) {
  const ref = doc(db, USERS_COLLECTION, uid);

  await deleteAllTransactions(uid);
  await deleteAllNotifications(uid);

  await updateDoc(ref, {
    fullName: "",
    dateOfBirth: "",
    currency: "INR",
    upiId: "",
    profilePhoto: "",

    currentBalance: 0,
    monthlyIncome: 0,
    secondaryIncome: 0,

    fixedExpenses: [],

    savingsTarget: 0,
    emergencyFundGoal: 0,
    overrideDailyLimit: null,

    hasCompletedOnboarding: false,

    updatedAt: Date.now(),
  });
}
