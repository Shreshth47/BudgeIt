import { useAuthStore } from "@/store/useAuthStore";
import { useSyncStore } from "@/store/useSyncStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useTransactionStore } from "@/store/useTransactionStore";

import { uploadDashboard } from "./dashboardService";
import { uploadTransactions } from "./transactionService";
import { uploadProfile } from "./profileService";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";

export async function syncUserData() {
  const user = useAuthStore.getState().user;

  if (!user) {
    return;
  }

  const { profileDirty, dashboardDirty, transactionsDirty } =
    useSyncStore.getState();

  console.log("========== SYNC ==========");
  console.log("Profile:", profileDirty);
  console.log("Dashboard:", dashboardDirty);
  console.log("Transactions:", transactionsDirty);

  try {
    if (dashboardDirty) {
      await uploadDashboard(
        user.uid,
        useDashboardStore.getState().getDashboardData(),
      );
    }

    if (transactionsDirty) {
      await uploadTransactions(
        user.uid,
        useTransactionStore.getState().transactions,
      );
    }

    if (profileDirty) {
      const profile = useOnBoardingStore.getState().getProfileData();

      await uploadProfile(user.uid, {
        ...profile,
        uid: user.uid,
        email: user.email ?? "",
      });
    }

    useSyncStore.getState().clearDirtyFlags();

    console.log("Sync Complete");
  } catch (error) {
    console.error("Sync Failed:", error);
  }
}
