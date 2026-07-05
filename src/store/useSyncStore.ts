import { create } from "zustand";

interface SyncState {
  profileDirty: boolean;

  dashboardDirty: boolean;

  transactionsDirty: boolean;

  isSyncing: boolean;

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
    }),

  setSyncing: (value) =>
    set({
      isSyncing: value,
    }),
}));