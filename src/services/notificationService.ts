import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { AppNotification } from "@/types/Notification";
import { writeBatch } from "firebase/firestore";

const USERS = "users";
const NOTIFICATIONS = "notifications";

export async function addNotificationToCloud(
  uid: string,
  notification: AppNotification,
) {
  const ref = doc(db, USERS, uid, NOTIFICATIONS, notification.id);

  await setDoc(ref, notification);
}

export async function deleteNotificationFromCloud(
  uid: string,
  notificationId: string,
) {
  const ref = doc(db, USERS, uid, NOTIFICATIONS, notificationId);

  await deleteDoc(ref);
}

export async function downloadNotifications(
  uid: string,
): Promise<AppNotification[]> {
  const ref = collection(db, USERS, uid, NOTIFICATIONS);

  const q = query(ref, orderBy("timestamp", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as AppNotification);
}

export async function uploadNotifications(
  uid: string,
  notifications: AppNotification[],
) {
  const batch = writeBatch(db);

  const collectionRef = collection(db, USERS, uid, NOTIFICATIONS);

  const existing = await getDocs(collectionRef);

  existing.forEach((doc) => {
    batch.delete(doc.ref);
  });

  notifications.forEach((notification) => {
    const ref = doc(db, USERS, uid, NOTIFICATIONS, notification.id);

    batch.set(ref, notification);
  });

  await batch.commit();
}

export async function deleteAllNotifications(uid: string) {
  const collectionRef = collection(db, USERS, uid, NOTIFICATIONS);

  const snapshot = await getDocs(collectionRef);

  const batch = writeBatch(db);

  snapshot.docs.forEach((document) => {
    batch.delete(document.ref);
  });

  await batch.commit();
}
