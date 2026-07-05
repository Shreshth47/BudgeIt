import { COLORS } from "@/constants/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useNotificationStore } from "@/store/useNotificationStore";

interface Props {
  onAddTransaction?: () => void;
}

export default function FloatingNav({ onAddTransaction }: Props) {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname === "/(tabs)/dashboard";

  const isReports = pathname.includes("reports");

  const isTransactions = pathname.includes("transactions");

  const isProfile = pathname.includes("profile");

  const isNotification = pathname.includes("notifications");

  const unreadCount = useNotificationStore(
    (state) => state.notifications.filter((n) => !n.read).length,
  );
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0.1,
        left: 1,
        right: 1,
        height: 74,
        backgroundColor: COLORS.card,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 52,
        borderBottomLeftRadius: 52,
        borderWidth: 1,
        borderColor: "#065465",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      <Pressable onPress={() => router.push("/reports")}>
        <MaterialCommunityIcons
          name="chart-bar"
          size={22}
          color={isReports ? COLORS.primary : COLORS.textSecondary}
        />
      </Pressable>

      <Pressable
        onPress={() => router.push("/(tabs)/notifications")}
        style={{
          position: "relative",
        }}
      >
        <MaterialCommunityIcons
          name="bell-outline"
          size={22}
          color={isNotification ? COLORS.primary : COLORS.textSecondary}
        />

        {unreadCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: -6,
              right: -8,
              minWidth: 18,
              height: 18,
              borderRadius: 999,
              backgroundColor: COLORS.danger,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 10,
                fontWeight: "700",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </Pressable>

      {/* CENTER BUTTON */}

      <Pressable
        onPress={() => {
          if (isDashboard) {
            onAddTransaction?.();
          } else {
            router.push("/(tabs)/dashboard");
          }
        }}
        style={{
          position: "absolute",
          top: -24,
          alignSelf: "center",
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: isDashboard ? COLORS.primary : COLORS.textSecondary,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: COLORS.primary,
          shadowOpacity: 0.4,
          shadowRadius: 15,
          elevation: 15,
          borderWidth: 1,
          borderColor: "#065465",
        }}
      >
        {isDashboard ? (
          <Ionicons name="add" size={32} color="#FFF" />
        ) : (
          <Ionicons name="home" size={28} color="#FFF" />
        )}
      </Pressable>

      <View style={{ width: 60 }} />

      <Pressable onPress={() => router.push("/(tabs)/transactions")}>
        <Ionicons
          name="wallet"
          size={22}
          color={isTransactions ? COLORS.primary : COLORS.textSecondary}
        />
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/profile")}>
        <Ionicons
          name="person"
          size={22}
          color={isProfile ? COLORS.primary : COLORS.textSecondary}
        />
      </Pressable>
    </View>
  );
}
