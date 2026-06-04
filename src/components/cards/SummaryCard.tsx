import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import Animated, {
  FadeInUp,
} from "react-native-reanimated";

interface Props {
  title: string;
  value: string;
}

export default function SummaryCard({
  title,
  value,
}: Props) {
  return (
    <Animated.View
    entering={FadeInUp.duration(600)}
      style={{
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
        padding: 16,
        shadowOpacity: 0.2,
      }}
    >
      <Text
        style={{
          color: COLORS.textSecondary,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: COLORS.text,
          fontSize: 24,
          fontWeight: "700",
          marginTop: 8,
        }}
      >
        {value}
      </Text>
    </Animated.View>
  );
}