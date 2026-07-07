import { doc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { UserDocument } from "@/types/user";

export async function uploadProfile(
  uid: string,
  profile: UserDocument,
) {
  const userRef = doc(
    db,
    "users",
    uid,
  );

  await updateDoc(userRef, {
    ...profile,
    updatedAt: Date.now(),
  });
}