import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { Transaction } from "@/types/Transaction";

const USERS = "users";
const TRANSACTIONS = "transactions";

export async function downloadTransactions(
  uid: string,
): Promise<Transaction[]> {
  const ref = collection(
    db,
    USERS,
    uid,
    TRANSACTIONS,
  );

  const q = query(
    ref,
    orderBy("timestamp", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) => doc.data() as Transaction,
  );
}

export async function uploadTransactions(
  uid: string,
  transactions: Transaction[],
) {
  const collectionRef = collection(
    db,
    USERS,
    uid,
    TRANSACTIONS,
  );

  const snapshot = await getDocs(collectionRef);

  const batch = writeBatch(db);

  // Delete all cloud transactions
  snapshot.docs.forEach((document) => {
    batch.delete(document.ref);
  });

  // Upload latest local transactions
  transactions.forEach((transaction) => {
    const ref = doc(
      collectionRef,
      transaction.id,
    );

    batch.set(ref, transaction);
  });

  await batch.commit();
}