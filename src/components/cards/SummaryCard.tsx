import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import Animated, { FadeInUp } from "react-native-reanimated";

interface Props {
  title: string;
  value: string;
  accentColor?: string
}

export default function SummaryCard({ title, value, accentColor }: Props) {
  let col = null;
  if(accentColor==="green"){col="#22C55E"}
  else if(accentColor==="red"){col="#EF4444"}
  else col="#0891B2";

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      style={{
        flex: 1,
        backgroundColor: "#101114",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.primary,
        padding: 16,
        marginTop: 8,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation:4,
        transform: [{ scale: 1 }]
      }}
    >
      <View
        style={{
          width: 28,
          height: 4,
          borderRadius: 999,
          backgroundColor: col,
          marginBottom: 14,

        }}
      />
      <Text
        style={{
          color: COLORS.text,
          fontSize: 18,
          fontWeight: "800",
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: COLORS.textSecondary,
          fontSize: 9,
          letterSpacing: 1.2,
          marginTop: 8,
        }}
      >
        {title.toUpperCase()}
      </Text>
    </Animated.View>
  );
}
