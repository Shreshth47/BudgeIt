import { requestNotificationPermission } from "@/utils/notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { subscribeToAuth } from "@/services/authService";
import { initializeUser } from "@/services/startupService";
import SyncProvider from "@/providers/SyncProvider";
import { auth } from "@/firebase/firebase";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);

  const setLoading = useAuthStore((state) => state.setLoading);

  const setProfileLoaded = useAuthStore((state) => state.setProfileLoaded);


  useEffect(() => {
    requestNotificationPermission();
    console.log("Current User BEFORE listener:", auth.currentUser);
    const unsubscribe = subscribeToAuth(async (user) => {
      console.log("Firebase Auth:", user?.email ?? "No User");

      setUser(user);

      if (user) {
        await initializeUser(user);
      } else {
        setProfileLoaded(true);
      }

      setLoading(false);
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
