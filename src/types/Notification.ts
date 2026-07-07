export interface AppNotification {
  id: string;

  title: string;

  message: string;

  timestamp: number;

  read: boolean;

  type: "success" | "warning" | "danger" | "info";
}