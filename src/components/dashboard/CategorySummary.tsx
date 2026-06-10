import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import { useDashboardStore } from "@/store/useDashboardStore";
import { getCategoryIcon } from "@/utils/getCategoryIcon";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function CategorySummary() {
  const transactions = useDashboardStore((state) => state.transactions);

  const categoryTotals = transactions.reduce(
    (acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount;

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

  if (transactions.length === 0) {
    return null;
  }

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

          marginBottom: 16,
        }}
      >
        SPENDING BREAKDOWN
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {topCategories.map(([category, amount]) => {
          const percentage =
            totalSpent === 0 ? 0 : Math.round((amount / totalSpent) * 100);
          return (
            <View
              key={category}
              style={{
                backgroundColor: "rgba(14,165,164,0.08)",

                borderWidth: 1,

                borderColor: "rgba(14,165,164,0.25)",

                borderRadius: 999,

                paddingHorizontal: 14,

                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  color: COLORS.text,

                  fontWeight: "600",
                }}
              >
                {getCategoryIcon(category)} {category}{" • "} ₹{amount}{" • "} %{percentage}
              </Text>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}
