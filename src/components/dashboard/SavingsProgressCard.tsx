import { View, Text } from "react-native";

import { COLORS } from "@/constants/colors";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";

export default function SavingsProgressCard() {
  const savingsTarget =
    useOnBoardingStore(
      (state) => state.savingsTarget
    );

  const actualSavings =
    useDashboardStore(
      (state) => state.monthlySavings
    );

  const rollover =
    useDashboardStore(
      (state) => state.rollover
    );

  const projectedSavings =
    actualSavings +
    rollover;

  const percentage =
    savingsTarget === 0
      ? 0
      : Math.min(
        (projectedSavings /
          savingsTarget) * 100,
        100
      );

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        marginTop: 8
      }}
    >
      <Text
        style={{
          color: COLORS.text,
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        💰 Savings Progress
      </Text>

      <Text
        style={{
          color: COLORS.text,
          fontSize: 28,
          fontWeight: "700",
        }}
      >
        ₹{projectedSavings}
      </Text>

      <Text
        style={{
          color: COLORS.textSecondary,
          marginBottom: 16,
        }}
      >
        Target ₹{savingsTarget}{"\n"}
        Actual Saved ₹{actualSavings}
      </Text>

      <View
        style={{
          height: 10,
          backgroundColor: "#1F2937",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor:
              COLORS.success,
          }}
        />
      </View>

      <Text
        style={{
          color: COLORS.textSecondary,
          marginTop: 8,
        }}
      >
        {Math.round(percentage)}%
        completed
      </Text>
    </View>
  );
}