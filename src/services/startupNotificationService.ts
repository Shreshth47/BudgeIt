import { User } from "firebase/auth";

import { downloadNotifications } from "./notificationService";
import { useNotificationStore } from "@/store/useNotificationStore";

export async function initializeNotifications(
  user: User,
) {
  try {
    const notifications =
      await downloadNotifications(user.uid);

    useNotificationStore
      .getState()
      .setNotifications(notifications);

    console.log(
      "Loaded",
      notifications.length,
      "notifications",
    );
  } catch (error) {
    console.log(
      "Notification Startup Error:",
      error,
    );
  }
}