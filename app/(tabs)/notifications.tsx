import { View, Text, ScrollView, Pressable } from "react-native";

import { COLORS } from "@/constants/colors";
import { useNotificationStore } from "@/store/useNotificationStore";

import FloatingNav from "@/components/common/FloatingNav";

import NotificationCard from "@/components/notifications/NotificationCard";

import { LinearGradient } from "expo-linear-gradient";

export default function Notifications() {
  const notifications = useNotificationStore((state) => state.notifications);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#09090B", "#0B1115", "#09090B"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            paddingBottom: 120,
          }}
        >
          <View
            style={{
              marginTop: 32,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 28,
                fontWeight: "800",
              }}
            >
              Activity
            </Text>

            <Text
              style={{
                color: COLORS.textSecondary,
                marginTop: 4,
              }}
            >
              Notifications and alerts
            </Text>
          </View>

          <Pressable
            onPress={markAllAsRead}
            style={{
              alignSelf: "flex-end",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontWeight: "700",
              }}
            >
              Mark all as read
            </Text>
          </Pressable>

          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
          {notifications.length === 0 && (
            <View
              style={{
                alignItems: "center",
                marginTop: 80,
              }}
            >
              <Text
                style={{
                  fontSize: 48,
                }}
              >
                🔔
              </Text>

              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 18,
                  fontWeight: "700",
                  marginTop: 12,
                }}
              >
                No Notifications Yet
              </Text>

              <Text
                style={{
                  color: COLORS.textSecondary,
                  marginTop: 6,
                }}
              >
                BudgeIt alerts will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      <FloatingNav />
    </View>
  );
}
