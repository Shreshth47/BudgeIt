import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuthStore } from "./useAuthStore";
import { useSyncStore } from "./useSyncStore";

import {
  addNotificationToCloud,
  deleteNotificationFromCloud,
} from "@/services/notificationService";

import { AppNotification } from "@/types/Notification";

import { persist, createJSONStorage } from "zustand/middleware";

interface NotificationState {
  notifications: AppNotification[];

  addNotification: (notification: AppNotification) => void;

  removeNotification: (id: string) => void;

  markAsRead: (id: string) => void;

  markAllAsRead: () => void;

  setNotifications: (notifications: AppNotification[]) => void;

  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  setNotifications: (notifications) =>
    set({
      notifications,
    }),
  clearNotifications: () =>
    set({
      notifications: [],
    }),
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));

    useSyncStore.getState().markNotificationsDirty();

    const user = useAuthStore.getState().user;

    if (user) {
      addNotificationToCloud(user.uid, notification).catch(console.error);
    }
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));

    useSyncStore.getState().markNotificationsDirty();

    const user = useAuthStore.getState().user;

    if (user) {
      deleteNotificationFromCloud(user.uid, id).catch(console.error);
    }
  },
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
}));
