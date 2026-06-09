import { router, usePathname } from "expo-router";
import { View, Text, Pressable } from "react-native";

interface Props {
  onAddTransaction?: () => void;
}

export default function FloatingNav({ onAddTransaction }: Props) {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname === "/(tabs)/dashboard";
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,

        backgroundColor: "#151A21",

        borderRadius: 30,

        flexDirection: "row",

        justifyContent: "space-around",

        paddingVertical: 16,
      }}
    >
      <Pressable onPress={() => router.push("/(tabs)/reports")}>
        <Text>📊</Text>
      </Pressable>
      <Text>🧾</Text>
      <Pressable
        onPress={() => {
          if (isDashboard) {
            onAddTransaction?.();
          } else {
            router.push("/(tabs)/dashboard");
          }
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
          }}
        >
          {isDashboard ? "➕" : "💵"}
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(tabs)/transactions")}>
        <Text>💰</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(tabs)/profile")}>
        <Text>👤</Text>
      </Pressable>
    </View>
  );
}
