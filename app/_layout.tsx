import { requestNotificationPermission } from "@/utils/notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  // useEffect(() => {
  //   requestNotificationPermission();
  // }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
