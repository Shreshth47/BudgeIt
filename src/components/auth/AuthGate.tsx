import { Redirect } from "expo-router";

import { useAuthStore } from "@/store/useAuthStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";

export default function AuthGate() {
  const user = useAuthStore((state) => state.user);

  const loading = useAuthStore((state) => state.loading);

  const profileLoaded =
    useAuthStore((state) => state.profileLoaded);

  const hasCompletedOnboarding =
    useOnBoardingStore(
      (state) => state.hasCompletedOnboarding
    );

  if (loading || !profileLoaded) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  if (!hasCompletedOnboarding) {
    return (
      <Redirect href="/onboarding/welcome" />
    );
  }

  return (
    <Redirect href="/(tabs)/dashboard" />
  );
}