import { User } from "firebase/auth";

import { downloadTransactions } from "./transactionService";
import { useTransactionStore } from "@/store/useTransactionStore";

export async function initializeTransactions(
  user: User
) {
  try {
    const transactions =
      await downloadTransactions(user.uid);

    useTransactionStore
      .getState()
      .setTransactions(transactions);

    console.log(
      "Loaded",
      transactions.length,
      "transactions"
    );
  } catch (error) {
    console.log(
      "Transaction Startup Error",
      error
    );
  }
}