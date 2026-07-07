import { create } from "zustand";

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

export const useSyncStore = create<SyncState>((set) => ({
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
}));
