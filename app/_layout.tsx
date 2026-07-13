import { requestNotificationPermission } from "@/utils/notifications";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { useEffect } from "react";

import SyncProvider from "@/providers/SyncProvider";
import { subscribeToAuth } from "@/services/authService";
import { initializeUser } from "@/services/startupService";
import { useAuthStore } from "@/store/useAuthStore";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);

  const setLoading = useAuthStore((state) => state.setLoading);

  const setProfileLoaded = useAuthStore((state) => state.setProfileLoaded);

  useEffect(() => {
    requestNotificationPermission();
    const unsubscribe = subscribeToAuth(async (user) => {
      try {
        console.log("Firebase Auth:", user?.email ?? "No User");

        setUser(user);

        if (user) {
          await initializeUser(user);
        } else {
          setProfileLoaded(true);
        }

        setLoading(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <SyncProvider />
      <LinearGradient
        colors={["#09090B", "#0B1115", "#09090B"]}
        locations={[0, 0.5, 1]}
        style={{ flex: 1 }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
      </LinearGradient>
    </>
  );
}
