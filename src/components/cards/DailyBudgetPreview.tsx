import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";

interface Props {
  budget: number;
  savingsTarget: number;
  fixedExpenses: number;
}

export default function DailyBudgetPreview({
  budget,
  savingsTarget,
  fixedExpenses,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        padding: 24,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 24,
      }}
    >
      <Text
        style={{
          color: COLORS.textSecondary,
          marginBottom: 10,
        }}
      >
        YOUR TRUE DAILY BUDGET
      </Text>

      <Text
        style={{
          color: COLORS.success,
          fontSize: 42,
          fontWeight: "700",
        }}
      >
        ₹{budget}<Text
          style={{
            color: "white",
            fontSize: 24
          }}
        >
          /day
        </Text>
      </Text>

      <Text
        style={{
          color: COLORS.textSecondary,
          textAlign: "center",
        }}
      >
        Fixed Expenses: ₹{fixedExpenses}
      </Text>

      <Text
        style={{
          color: COLORS.textSecondary,
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Savings Goal: ₹{savingsTarget}
      </Text>


    </View>
  );
}