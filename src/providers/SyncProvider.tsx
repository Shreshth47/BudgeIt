import { useEffect } from "react";
import { AppState } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useSyncStore } from "@/store/useSyncStore";
import * as Network from "expo-network";
import { syncUserData } from "@/services/syncService";

export default function SyncProvider() {
  const user = useAuthStore((state) => state.user);

  const profileLoaded = useAuthStore((state) => state.profileLoaded);
  useEffect(() => {
    const interval = setInterval(async () => {
      const state = await Network.getNetworkStateAsync();

      if (
        state.isConnected &&
        state.isInternetReachable &&
        useAuthStore.getState().profileLoaded
      ) {
        syncUserData();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!user || !profileLoaded) {
      return;
    }

    const {
      profileDirty,
      dashboardDirty,
      transactionsDirty,
      notificationsDirty,
    } = useSyncStore.getState();

    if (
      profileDirty ||
      dashboardDirty ||
      transactionsDirty ||
      notificationsDirty
    ) {
      console.log("Pending changes found. Syncing...");

      syncUserData();
    }
  }, [user, profileLoaded]);
  useEffect(() => {
    const interval = setInterval(() => {
      syncUserData();
    }, 60000);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background" && useAuthStore.getState().profileLoaded) {
        syncUserData();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return null;
}
