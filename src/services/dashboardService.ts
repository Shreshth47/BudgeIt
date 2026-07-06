import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { DashboardDocument } from "@/types/Dashboard";

export async function uploadDashboard(
  uid: string,
  dashboard: DashboardDocument,
) {
  const userRef = doc(db, "users", uid);

  console.log("UPLOADING DASHBOARD");
  console.log(dashboard);

  await updateDoc(userRef, {
    dashboard,
    updatedAt: Date.now(),
  });
}

export async function downloadDashboard(
  uid: string,
): Promise<DashboardDocument | null> {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  console.log("FIRESTORE DASHBOARD");
  console.log(snapshot.data()?.dashboard);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return (data.dashboard as DashboardDocument) ?? null;
}
