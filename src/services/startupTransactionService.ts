import { User } from "firebase/auth";

import { downloadTransactions } from "./transactionService";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useSyncStore } from "@/store/useSyncStore";

export async function initializeTransactions(user: User) {
  try {
    const { transactionsDirty } = useSyncStore.getState();

    // Local transactions are newer than cloud.
    // Never overwrite pending offline changes.
    if (transactionsDirty) {
      console.log(
        "Skipping cloud transaction download (pending local changes).",
      );
      return;
    }

    const transactions = await downloadTransactions(user.uid);

    useTransactionStore.getState().setTransactions(transactions);

    console.log("Loaded", transactions.length, "transactions");
  } catch (error) {
    console.log("Transaction Startup Error", error);
  }
}
