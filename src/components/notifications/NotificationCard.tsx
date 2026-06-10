import { useState } from "react";
import { View, Text, Pressable } from "react-native";

import { COLORS } from "@/constants/colors";

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { Alert } from "react-native";

import {
  AppNotification,
  useNotificationStore,
} from "@/store/useNotificationStore";

import { Ionicons } from "@expo/vector-icons";

interface Props {
  notification: AppNotification;
}

export default function NotificationCard({ notification }: Props) {
  const [expanded, setExpanded] = useState(false);

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const handlePress = () => {
    setExpanded(!expanded);

    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;

    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Just now";

    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);

    if (days === 1) return "Yesterday";

    return `${days} days ago`;
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "warning":
        return {
          icon: "warning",
          color: COLORS.warning,
        };

      case "debt":
        return {
          icon: "trending-down",
          color: COLORS.danger,
        };

      case "success":
        return {
          icon: "checkmark-circle",
          color: COLORS.success,
        };

      default:
        return {
          icon: "notifications",
          color: COLORS.primary,
        };
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Notification", "Remove this notification?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteNotification(notification.id),
      },
    ]);
  };

  const iconData = getNotificationIcon();

  const formattedTime = new Date(notification.timestamp).toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const deleteNotification = useNotificationStore(
    (state) => state.deleteNotification,
  );

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(50).stiffness(300)}
    >
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: notification.read ? "#0B0C0F" : COLORS.card,
          borderWidth: 1,
          borderColor: notification.read ? COLORS.border : COLORS.primary,
          borderRadius: 20,
          padding: 18,
          marginBottom: 14,
          opacity: notification.read ? 0.75 : 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              flex: 1,
            }}
          >
            <Ionicons
              name={iconData.icon as any}
              size={20}
              color={iconData.color}
            />

            <Text
              style={{
                color: COLORS.text,
                fontSize: 16,
                fontWeight: "700",
                flex: 1,
              }}
            >
              {notification.title}
            </Text>
          </View>

          {!notification.read && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: COLORS.primary,
              }}
            />
          )}
        </View>

        <Text
          style={{
            color: COLORS.textSecondary,
            fontSize: 12,
            marginTop: 6,
          }}
        >
          {getRelativeTime(notification.timestamp)}
        </Text>

        {expanded && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(100)}>
            <Text
              style={{
                color: COLORS.text,
                marginTop: 14,
                lineHeight: 22,
              }}
            >
              {notification.message}
            </Text>

            <Pressable
              onPress={handleDelete}
              style={{
                marginTop: 16,
                alignSelf: "flex-end",
              }}
            >
              <Text
                style={{
                  color: COLORS.danger,
                  fontWeight: "700",
                }}
              >
                Delete
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}
