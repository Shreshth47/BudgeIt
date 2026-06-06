import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function FloatingNav() {
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
      <Pressable
        onPress={() =>
          router.push(
            "/(tabs)/reports"
          )
        }
      >
        <Text>📊</Text></Pressable>
      <Text>🧾</Text>
      <Pressable onPress={() =>
        router.push("/(tabs)/dashboard")
      }><Text>💵</Text></Pressable>
      <Pressable onPress={()=>router.push("/(tabs)/transactions")}><Text>💰</Text></Pressable>
      <Text>👤</Text>
    </View>
  )
} 