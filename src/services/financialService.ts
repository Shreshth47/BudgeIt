import { writeBatch, doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase";

import { Transaction } from "@/types/Transaction";
import { DashboardDocument } from "@/types/Dashboard";

const USERS = "users";
const TRANSACTIONS = "transactions";

interface AddTransactionParams {
  uid: string;

  transaction: Transaction;
}

export async function addFinancialTransaction({
  uid,
  transaction,
}: AddTransactionParams) {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("User not found");
  }
  const data = snapshot.data();

  const dashboard = data.dashboard as DashboardDocument;
}
