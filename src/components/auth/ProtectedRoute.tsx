import { Redirect } from "expo-router";
import { ReactNode } from "react";

import { useAuthStore } from "@/store/useAuthStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const user = useAuthStore((state) => state.user);

  const loading = useAuthStore((state) => state.loading);

  const profileLoaded = useAuthStore(
    (state) => state.profileLoaded,
  );

  const hasCompletedOnboarding =
    useOnBoardingStore(
      (state) => state.hasCompletedOnboarding,
    );

  if (loading || !profileLoaded) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <>{children}</>;
}