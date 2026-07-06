import { User } from "firebase/auth";

import { getUserDocument } from "@/services/userService";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { initializeDashboard } from "./startupDashboardService";
import { initializeTransactions } from "./startupTransactionService";

export async function initializeUser(user: User) {
  try {
    // Always clear local state before loading a user's data
    useOnBoardingStore.getState().clearOnboarding();

    useDashboardStore.getState().clearDashboardLocal();

    useNotificationStore.getState().clearNotifications();
    const profile = await getUserDocument(user.uid);

    if (!profile) {
      useAuthStore.getState().setProfileLoaded(true);

      return;
    }

    const onboarding = useOnBoardingStore.getState();

    onboarding.setField("fullName", profile.fullName);

    onboarding.setField("dateOfBirth", profile.dateOfBirth);

    onboarding.setField("currency", profile.currency);

    onboarding.setField("upiId", profile.upiId);

    onboarding.setField("currentBalance", profile.currentBalance);

    onboarding.setField("monthlyIncome", profile.monthlyIncome);

    onboarding.setField("secondaryIncome", profile.secondaryIncome);

    onboarding.setField("fixedExpenses", profile.fixedExpenses);

    onboarding.setField("savingsTarget", profile.savingsTarget);

    onboarding.setField("emergencyFundGoal", profile.emergencyFundGoal);

    onboarding.setField("overrideDailyLimit", profile.overrideDailyLimit);

    onboarding.setField(
      "hasCompletedOnboarding",
      profile.hasCompletedOnboarding,
    );

    await initializeTransactions(user);
    await initializeDashboard(user);

    useAuthStore.getState().setProfileLoaded(true);
  } catch (error) {
    console.log("Startup Error:", error);

    useAuthStore.getState().setProfileLoaded(true);
  }
}
