import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isToday } from "@/utils/isToday";
import { sendLocalNotification } from "@/utils/notifications";
import { useNotificationStore } from "./useNotificationStore";

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  timestamp: number;
  category: string;
  debtCreated: number;
}

interface DashboardState {
  todaysSpend: number;
  rollover: number;
  transactions: Transaction[];

  debtCarryForward: number;

  lastActiveDate: string;

  monthlySavings: number;

  lastActiveMonth: string;

  checkAndAdvanceMonth: () => void;

  addMonthlySavings: (amount: number) => void;

  addTransaction: (transaction: Transaction) => void;

  removeTransaction: (id: string) => void;

  addDebt: (amount: number) => void;

  simulateNextDay: (baseDailyBudget: number) => void;

  checkAndAdvanceDay: (baseDailyBudget: number) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      todaysSpend: 0,

      rollover: 0,

      transactions: [],

      lastActiveDate: new Date().toISOString().split("T")[0],

      monthlySavings: 0,

      lastActiveMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,

      checkAndAdvanceMonth: () =>
        set((state) => {
          const currentMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

          if (state.lastActiveMonth === currentMonth) {
            return state;
          }

          console.log("MONTH CHECK:", state.lastActiveMonth, currentMonth);
          console.log("MONTH CHECK:", state.lastActiveMonth, currentMonth);

          return {
            monthlySavings: state.monthlySavings + state.rollover,

            rollover: 0,

            todaysSpend: 0,

            lastActiveMonth: currentMonth,
          };
        }),

      addMonthlySavings: (amount) =>
        set((state) => ({
          monthlySavings: state.monthlySavings + amount,
        })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],

          todaysSpend: state.todaysSpend + transaction.amount,
        })),

      removeTransaction: (id) =>
        set((state) => {
          const transaction = state.transactions.find((t) => t.id === id);

          if (!transaction || !isToday(transaction.timestamp)) {
            return state;
          }

          return {
            transactions: state.transactions.filter((t) => t.id !== id),

            todaysSpend: state.todaysSpend - transaction.amount,

            debtCarryForward: Math.max(
              state.debtCarryForward - (transaction.debtCreated ?? 0),
              0,
            ),
          };
        }),

      debtCarryForward: 0,

      addDebt: (amount) =>
        set((state) => ({
          debtCarryForward: state.debtCarryForward + amount,
        })),

      checkAndAdvanceDay: (baseDailyBudget) =>
        set((state) => {
          const today = new Date().toLocaleDateString("en-CA");

          if (state.lastActiveDate === today) {
            return state;
          }

          const effectiveBudget = Math.max(
            baseDailyBudget + state.rollover - state.debtCarryForward,
            0,
          );

          const unused = Math.max(effectiveBudget - state.todaysSpend, 0);

          const remainingDebt = Math.max(
            state.debtCarryForward - baseDailyBudget,
            0,
          );

          const addNotification = useNotificationStore.getState().addNotification;

          console.log("BEFORE");
          console.log("todaysSpend:", state.todaysSpend);
          console.log("rollover:", state.rollover);
          console.log("debt:", state.debtCarryForward);

          console.log("AFTER");
          console.log("unused:", unused);
          console.log("remainingDebt:", remainingDebt);
          sendLocalNotification(
            "☀️ New Day Started",
            `Today's allowance is ₹${effectiveBudget}`,
          );
          addNotification({
            id: Date.now().toString(),
            title: "New Day Started",
            message: `Today's allowance is ₹${effectiveBudget}.`,
            timestamp: Date.now(),
            read: false,
            type: "success",
          });

          return {
            rollover: unused,

            todaysSpend: 0,

            debtCarryForward: remainingDebt,

            lastActiveDate: today,
          };
        }),

      simulateNextDay: (baseDailyBudget) =>
        set((state) => {
          const effectiveBudget = Math.max(
            baseDailyBudget + state.rollover - state.debtCarryForward,
            0,
          );

          const unused = Math.max(effectiveBudget - state.todaysSpend, 0);

          const remainingDebt = Math.max(
            state.debtCarryForward - baseDailyBudget,
            0,
          );

          return {
            rollover: unused,

            todaysSpend: 0,

            debtCarryForward: remainingDebt,
          };
        }),
    }),
    {
      name: "budgeit-dashboard",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
