import { requestNotificationPermission } from "@/utils/notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  return (
    <>
      <LinearGradient
        colors={["#09090B", "#0B1115", "#09090B"]}
        locations={[0, 0.5, 1]}
        style={{
          flex: 1,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </LinearGradient>
    </>
  );
}
