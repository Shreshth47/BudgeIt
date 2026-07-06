import { View, Text, ScrollView, Pressable } from "react-native";

import { COLORS } from "@/constants/colors";
import { useNotificationStore } from "@/store/useNotificationStore";

import FloatingNav from "@/components/common/FloatingNav";

import NotificationCard from "@/components/notifications/NotificationCard";

import { LinearGradient } from "expo-linear-gradient";
import { getNotificationGroup } from "@/utils/getNotificationsGroup";
import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Notifications() {
  const notifications = useNotificationStore((state) => state.notifications);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.read);
  const groupedNotifications = {
    Today: filteredNotifications.filter(
      (n) => getNotificationGroup(n.timestamp) === "Today",
    ),

    Yesterday: filteredNotifications.filter(
      (n) => getNotificationGroup(n.timestamp) === "Yesterday",
    ),

    Older: filteredNotifications.filter(
      (n) => getNotificationGroup(n.timestamp) === "Older",
    ),
  };
  const renderSectionHeader = (title: string) => (
    <Text
      style={{
        color: COLORS.textSecondary,

        fontSize: 12,

        fontWeight: "700",

        letterSpacing: 2,

        marginBottom: 12,

        marginTop: 8,
      }}
    >
      {title.toUpperCase()}
    </Text>
  );
  return (
    <ProtectedRoute>
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
                {notifications.length} notifications
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Pressable
                onPress={() => setFilter("all")}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,

                  borderRadius: 999,

                  backgroundColor:
                    filter === "all" ? COLORS.primary : COLORS.card,

                  borderWidth: 1,

                  borderColor:
                    filter === "all" ? COLORS.primary : COLORS.border,
                }}
              >
                <Text
                  style={{
                    color: filter === "all" ? "#FFF" : COLORS.text,
                    fontWeight: "600",
                  }}
                >
                  All
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setFilter("unread")}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,

                  borderRadius: 999,

                  backgroundColor:
                    filter === "unread" ? COLORS.primary : COLORS.card,

                  borderWidth: 1,

                  borderColor:
                    filter === "unread" ? COLORS.primary : COLORS.border,
                }}
              >
                <Text
                  style={{
                    color: filter === "unread" ? "#FFF" : COLORS.text,
                    fontWeight: "600",
                  }}
                >
                  Unread
                </Text>
              </Pressable>
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

            {groupedNotifications.Today.length > 0 && (
              <>
                {renderSectionHeader("Today")}

                {groupedNotifications.Today.map((filteredNotifications) => (
                  <NotificationCard
                    key={filteredNotifications.id}
                    notification={filteredNotifications}
                  />
                ))}
              </>
            )}

            {groupedNotifications.Yesterday.length > 0 && (
              <>
                {renderSectionHeader("Yesterday")}

                {groupedNotifications.Yesterday.map((filteredNotifications) => (
                  <NotificationCard
                    key={filteredNotifications.id}
                    notification={filteredNotifications}
                  />
                ))}
              </>
            )}

            {groupedNotifications.Older.length > 0 && (
              <>
                {renderSectionHeader("Older")}

                {groupedNotifications.Older.map((filteredNotifications) => (
                  <NotificationCard
                    key={filteredNotifications.id}
                    notification={filteredNotifications}
                  />
                ))}
              </>
            )}
            {filteredNotifications.length === 0 && (
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
                  {filter === "unread"
                    ? "No Unread Notifications"
                    : "No Notifications Yet"}
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
    </ProtectedRoute>
  );
}
