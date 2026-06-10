import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import Animated, { FadeInUp } from "react-native-reanimated";

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
  let statusColor = "#22C55E";
  let title = "Budget On Track";
  let message = "You're spending responsibly today.";

  const ratio = remaining / dailyBudget;

  if (debtCarryForward > 0) {
    statusColor = "#EF4444";
    title = "Debt Carry Forward";
    message = `Tomorrow's allowance is reduced by ${debtCarryForward}.`;
  } else if (ratio < 0.2) {
    statusColor = "#F59E0B";
    title = "Approaching Limit";
    message = `Only ${remaining} remains available today.`;
  }
  if (ratio == 0) {
    statusColor = "#EF4444";
    title = "Exhausted";
    message = `No more spendings for today.`;
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      style={{
        backgroundColor: "#101114",
        padding: 14,
        borderRadius: 20,
        marginTop: -100,
        elevation: 12,
        shadowRadius: 20,
        borderLeftWidth: 3,
        borderLeftColor: statusColor,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: statusColor,
          }}
        />

        <Text
          style={{
            color: COLORS.text,
            fontSize: 18,
            fontWeight: "800",
          }}
        >
          {title}
        </Text>
      </View>

      <Text
        style={{
          color: COLORS.textSecondary,
          marginTop: 8,
          lineHeight: 16,
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}
