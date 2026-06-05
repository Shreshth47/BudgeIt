import { Redirect } from "expo-router";

import { useOnBoardingStore }
  from "@/store/useOnBoardingStore";

export default function Index() {
  const hasCompletedOnboarding =
    useOnBoardingStore(
      (state) =>
        state.hasCompletedOnboarding
    );

  if (hasCompletedOnboarding) {
    return (
      <Redirect
        href="/(tabs)/dashboard"
      />
    );
  }

  return (
    <Redirect
      href="/onboarding/welcome"
    />
  );
}