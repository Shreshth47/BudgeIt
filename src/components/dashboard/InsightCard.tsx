import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import Animated, {
  FadeInUp,
} from "react-native-reanimated";

interface Props {
  remaining: number;
  dailyBudget: number;
  debtCarryForward: number;
}

export default function InsightCard({
  remaining,
  dailyBudget,
  debtCarryForward,
}: Props) {
  let emoji = "🟢";
  let title = "Looking Good";
  let message = "You're spending responsibly today.";

  const ratio = remaining / dailyBudget;

  if (debtCarryForward > 0) {
    emoji = "🔴";
    title = "Debt Active";
    message =
      `Tomorrow's allowance is reduced by ₹${debtCarryForward}.`;
  } else if (ratio < 0.2) {
    emoji = "🟠";
    title = "Danger Zone";
    message =
      `Only ₹${remaining} left today. Spend carefully.`;
  }

  return (
    <Animated.View
    entering={FadeInUp.duration(600)}
      style={{
        backgroundColor: COLORS.card,
        padding: 18,
        borderRadius: 20,
        marginTop: -100,
      }}
    >
      <Text
        style={{
          color: COLORS.text,
          fontSize: 18,
          fontWeight: "700",
        }}
      >
        {emoji} {title}
      </Text>

      <Text
        style={{
          color: COLORS.textSecondary,
          marginTop: 8,
          lineHeight: 22,
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}