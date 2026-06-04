import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  timestamp: number;
  category: string;
}

interface DashboardState {
  todaysSpend: number;
  rollover: number;
  transactions: Transaction[];

  addTransaction: (
    transaction: Transaction
  ) => void;

  debtCarryForward: number;

  addDebt: (amount: number) => void;

  simulateNextDay: (
    baseDailyBudget: number
  ) => void;
}

export const useDashboardStore =
  create<DashboardState>()(
    persist(
      (set) => ({
        todaysSpend: 0,

        rollover: 0,

        transactions: [],

        addTransaction: (
          transaction
        ) =>
          set((state) => ({
            transactions: [
              transaction,
              ...state.transactions,
            ],

            todaysSpend:
              state.todaysSpend +
              transaction.amount,
          })),

        debtCarryForward: 0,

        addDebt: (amount) =>
          set((state) => ({
            debtCarryForward:
              state.debtCarryForward +
              amount,
          })),

        simulateNextDay: (
          baseDailyBudget
        ) =>
          set((state) => {
            const effectiveBudget =
              Math.max(
                baseDailyBudget +
                  state.rollover -
                  state.debtCarryForward,
                0
              );

            const unused =
              Math.max(
                effectiveBudget -
                  state.todaysSpend,
                0
              );

            const remainingDebt =
              Math.max(
                state.debtCarryForward -
                  baseDailyBudget,
                0
              );

            return {
              rollover: unused,

              todaysSpend: 0,

              debtCarryForward:
                remainingDebt,
            };
          }),
      }),
      {
        name: "budgeit-dashboard",
        storage: createJSONStorage(
          () => AsyncStorage
        ),
      }
    )
  );