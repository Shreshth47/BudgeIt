import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SyncState {
  profileDirty: boolean;

  dashboardDirty: boolean;

  transactionsDirty: boolean;

  isSyncing: boolean;

  notificationsDirty: boolean;

  markNotificationsDirty: () => void;

  clearNotificationsDirty: () => void;

  markProfileDirty: () => void;

  markDashboardDirty: () => void;

  markTransactionsDirty: () => void;

  clearDirtyFlags: () => void;

  setSyncing: (value: boolean) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      profileDirty: false,

      dashboardDirty: false,

      transactionsDirty: false,

      isSyncing: false,

      notificationsDirty: false,

      markNotificationsDirty: () =>
        set({
          notificationsDirty: true,
        }),

      clearNotificationsDirty: () =>
        set({
          notificationsDirty: false,
        }),

      markProfileDirty: () =>
        set({
          profileDirty: true,
        }),

      markDashboardDirty: () =>
        set({
          dashboardDirty: true,
        }),

      markTransactionsDirty: () =>
        set({
          transactionsDirty: true,
        }),

      clearDirtyFlags: () =>
        set({
          profileDirty: false,
          dashboardDirty: false,
          transactionsDirty: false,
          notificationsDirty: false,
        }),

      setSyncing: (value) =>
        set({
          isSyncing: value,
        }),
    }),
    {
      name: "budgeit-sync",

      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setSyncing(false);
        }
      },

      partialize: (state) => ({
        profileDirty: state.profileDirty,
        dashboardDirty: state.dashboardDirty,
        transactionsDirty: state.transactionsDirty,
        notificationsDirty: state.notificationsDirty,
      }),
    },
  ),
);
