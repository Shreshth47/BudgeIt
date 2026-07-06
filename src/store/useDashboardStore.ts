import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isToday } from "@/utils/isToday";
import { sendLocalNotification } from "@/utils/notifications";
import { useNotificationStore } from "./useNotificationStore";
import { getRemainingBudget } from "@/utils/getRemainingBudget";
import { useTransactionStore } from "./useTransactionStore";
import { useSyncStore } from "./useSyncStore";
import { DashboardDocument } from "@/types/Dashboard";

interface DashboardState {
  todaysSpend: number;
  rollover: number;

  debtCarryForward: number;

  lastActiveDate: string;

  monthlySavings: number;

  lastActiveMonth: string;

  clearDashboardLocal: () => void;

  getDashboardData: () => DashboardDocument;

  checkAndAdvanceMonth: () => void;

  addMonthlySavings: (amount: number) => void;

  addDebt: (amount: number) => void;

  resetDashboard: () => void;

  simulateNextDay: (baseDailyBudget: number) => void;

  checkAndAdvanceDay: (baseDailyBudget: number) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      todaysSpend: 0,

      rollover: 0,

      lastActiveDate: new Date().toISOString().split("T")[0],

      monthlySavings: 0,

      lastActiveMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,

      clearDashboardLocal: () => {
        set({
          todaysSpend: 0,

          rollover: 0,

          debtCarryForward: 0,

          monthlySavings: 0,

          lastActiveDate: new Date().toISOString().split("T")[0],

          lastActiveMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
        });

        // NO markDashboardDirty()
      },

      getDashboardData: (): DashboardDocument => {
        const state = get();

        return {
          todaysSpend: state.todaysSpend,
          rollover: state.rollover,
          debtCarryForward: state.debtCarryForward,
          monthlySavings: state.monthlySavings,
          lastActiveDate: state.lastActiveDate,
          lastActiveMonth: state.lastActiveMonth,
        };
      },

      checkAndAdvanceMonth: () => {
        (set((state) => {
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
          useSyncStore.getState().markDashboardDirty());
      },
      addMonthlySavings: (amount) => {
        set((state) => ({
          monthlySavings: state.monthlySavings + amount,
        }));

        useSyncStore.getState().markDashboardDirty();
      },

      debtCarryForward: 0,

      addDebt: (amount) => {
        set((state) => ({
          debtCarryForward: state.debtCarryForward + amount,
        }));

        useSyncStore.getState().markDashboardDirty();
      },

      checkAndAdvanceDay: (baseDailyBudget) => {
        (set((state) => {
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

          const addNotification =
            useNotificationStore.getState().addNotification;
          const remaining = getRemainingBudget(
            effectiveBudget,
            state.todaysSpend,
            0,
          );

          console.log("BEFORE");
          console.log("todaysSpend:", state.todaysSpend);
          console.log("rollover:", state.rollover);
          console.log("debt:", state.debtCarryForward);

          console.log("AFTER");
          console.log("unused:", unused);
          console.log("remainingDebt:", remainingDebt);
          sendLocalNotification(
            "☀️ New Day Started",
            `Today's allowance is ₹${remaining}`,
          );
          addNotification({
            id: Date.now().toString(),
            title: "New Day Started",
            message: `Today's allowance is ₹${remaining}.`,
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
          useSyncStore.getState().markDashboardDirty());
      },

      resetDashboard: () => {
        set({
          todaysSpend: 0,

          rollover: 0,

          debtCarryForward: 0,

          monthlySavings: 0,

          lastActiveDate: new Date().toISOString().split("T")[0],

          lastActiveMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
        });

        useSyncStore.getState().markDashboardDirty();
      },

      simulateNextDay: (baseDailyBudget) => {
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
        });

        useSyncStore.getState().markDashboardDirty();
      },
    }),
    {
      name: "budgeit-dashboard",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
