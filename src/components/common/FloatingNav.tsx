import { View, Text } from "react-native";

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
      <Text>📊</Text>
      <Text>🧾</Text>
      <Text>💰</Text>
      <Text>👤</Text>
    </View>
  )
}