import { create } from "zustand";
import { useDashboardStore } from "./useDashboardStore";
import { isToday } from "@/utils/isToday";
import { Transaction } from "@/types/Transaction";
import { useSyncStore } from "./useSyncStore";
import { useOnBoardingStore } from "./useOnBoardingStore";
import { getDailyBudget } from "@/utils/getDailyBudget";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TransactionState {
  transactions: Transaction[];

  addTransaction: (transaction: Transaction) => void;

  removeTransaction: (id: string) => void;

  setTransactions: (transactions: Transaction[]) => void;

  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }));

        useSyncStore.getState().markTransactionsDirty();

        useSyncStore.getState().markDashboardDirty();

        useDashboardStore.setState((state) => ({
          todaysSpend: state.todaysSpend + transaction.amount,
        }));
      },

      removeTransaction: (id) => {
        const tx = get().transactions.find((t) => t.id === id);

        if (!tx) {
          return;
        }

        // Safety: only today's transactions can be deleted
        if (!isToday(tx.timestamp)) {
          return;
        }

        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));

        const onboarding = useOnBoardingStore.getState();
        const baseDailyBudget = getDailyBudget(
          onboarding.monthlyIncome + onboarding.secondaryIncome,
          onboarding.fixedExpenses,
          onboarding.savingsTarget,
        );

        useSyncStore.getState().markTransactionsDirty();

        useSyncStore.getState().markDashboardDirty();

        useDashboardStore.getState().refreshTodaysBudget(baseDailyBudget);
      },

      setTransactions: (transactions) =>
        set({
          transactions,
        }),

      clearTransactions: () =>
        set({
          transactions: [],
        }),
    }),
    {
      name: "budgeit-transactions",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
