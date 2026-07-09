import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/constants/colors";
import { useTransactionStore } from "@/store/useTransactionStore";
import { getCategoryIcon } from "@/utils/getCategoryIcon";

export default function CategorySummary() {
  const transactions = useTransactionStore(
    (state) => state.transactions,
  );

  if (transactions.length === 0) {
    return null;
  }

  const categoryTotals = transactions.reduce(
    (acc, transaction) => {
      const category = transaction.category || "Others";

      acc[category] =
        (acc[category] || 0) + transaction.amount;

      return acc;
    },
    {} as Record<string, number>,
  );

  const totalSpent = Object.values(categoryTotals).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <Animated.View
      entering={FadeInDown.delay(300)}
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <Text
        style={{
          color: COLORS.textSecondary,
          fontSize: 12,
          letterSpacing: 2,
          fontWeight: "600",
          marginBottom: 18,
        }}
      >
        TOP SPENDING CATEGORIES
      </Text>

      <View
        style={{
          gap: 12,
        }}
      >
        {topCategories.map(([category, amount]) => {
          const percentage =
            totalSpent === 0
              ? 0
              : Math.round((amount / totalSpent) * 100);

          return (
            <View
              key={category}
              style={{
                backgroundColor: "rgba(14,165,164,0.08)",
                borderWidth: 1,
                borderColor: "rgba(14,165,164,0.20)",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontWeight: "700",
                    fontSize: 15,
                  }}
                >
                  {getCategoryIcon(category)} {category}
                </Text>

                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "700",
                  }}
                >
                  ₹{amount}
                </Text>
              </View>

              <View
                style={{
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: "#1F2937",
                  marginTop: 12,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: COLORS.primary,
                    borderRadius: 999,
                  }}
                />
              </View>

              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                {percentage}% of total spending
              </Text>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}