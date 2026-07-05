import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { COLORS } from "@/constants/colors";

import { useAuthStore } from "@/store/useAuthStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";

export default function Index() {
  const loading = useAuthStore((state) => state.loading);
  const profileLoaded = useAuthStore(
    (state) => state.profileLoaded
  );
  const user = useAuthStore((state) => state.user);

  const hasCompletedOnboarding =
    useOnBoardingStore(
      (state) => state.hasCompletedOnboarding
    );

  if (loading || !profileLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  // User not logged in
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Logged in but onboarding not completed
  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding/welcome" />;
  }

  // Logged in and onboarding completed
  return <Redirect href="/(tabs)/dashboard" />;
}