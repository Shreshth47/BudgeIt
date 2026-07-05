import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { persist, createJSONStorage } from "zustand/middleware";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;

  read: boolean;

  type: "success" | "warning" | "debt" | "system";
}

interface NotificationState {
  notifications: AppNotification[];

  addNotification: (notification: AppNotification) => void;

  markAsRead: (id: string) => void;

  markAllAsRead: () => void;

  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100),
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id
              ? {
                  ...n,
                  read: true,
                }
              : n,
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
          })),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () =>
        set({
          notifications: [],
        }),
    }),

    {
      name: "budgeit-notifications",

      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
