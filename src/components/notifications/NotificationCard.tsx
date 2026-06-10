import { useState } from "react";
import {
  View,
  Text,
  Pressable,
} from "react-native";

import { COLORS } from "@/constants/colors";

import {
  AppNotification,
  useNotificationStore,
} from "@/store/useNotificationStore";

interface Props {
  notification: AppNotification;
}

export default function NotificationCard({
  notification,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);

  const markAsRead =
    useNotificationStore(
      (state) => state.markAsRead
    );

  const handlePress = () => {
    setExpanded(!expanded);

    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const formattedTime =
    new Date(
      notification.timestamp
    ).toLocaleString([], {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor:
          notification.read
            ? "#0D0D10"
            : COLORS.card,

        borderWidth: 1,

        borderColor:
          notification.read
            ? COLORS.border
            : COLORS.primary,

        borderRadius: 20,

        padding: 18,

        marginBottom: 14,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
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

        {!notification.read && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor:
                COLORS.primary,
            }}
          />
        )}
      </View>

      <Text
        style={{
          color:
            COLORS.textSecondary,
          fontSize: 12,
          marginTop: 6,
        }}
      >
        {formattedTime}
      </Text>

      {expanded && (
        <Text
          style={{
            color: COLORS.text,
            marginTop: 14,
            lineHeight: 22,
          }}
        >
          {notification.message}
        </Text>
      )}
    </Pressable>
  );
}