import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import { useDashboardStore } from "@/store/useDashboardStore";
import { getCategoryIcon } from "@/utils/getCategoryIcon";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";

export default function CategorySummary() {
  const transactions =
    useDashboardStore(
      (state) => state.transactions
    );

  const categoryTotals =
    transactions.reduce(
      (acc, transaction) => {
        acc[transaction.category] =
          (acc[transaction.category] || 0) +
          transaction.amount;

        return acc;
      },
      {} as Record<string, number>
    );

  const totalSpent =
    Object.values(categoryTotals)
      .reduce(
        (sum, amount) =>
          sum + amount,
        0
      );

  const topCategories =
    Object.entries(categoryTotals)
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, 3);

  if (
    transactions.length === 0
  ) {
    return null;
  }

  return (
    <Animated.View
      entering={
        FadeInDown.delay(300)
      }
      style={{
        backgroundColor:
          COLORS.card,

        borderRadius: 20,

        padding: 20,

        marginBottom: 24,
      }}
    >
      <Text
        style={{
          color: COLORS.text,

          fontSize: 20,

          fontWeight: "700",

          marginBottom: 20,
        }}
      >
        Top Categories
      </Text>

      {topCategories.map(
        ([category, amount]) => {
          const percentage =
            totalSpent === 0
              ? 0
              : Math.round(
                (amount / totalSpent) * 100
              );

          return (
            <View
              key={category}
              style={{
                marginBottom: 18,
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  justifyContent:
                    "space-between",

                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color:
                      COLORS.text,

                    fontWeight:
                      "600",
                  }}
                >
                  {
                    getCategoryIcon(
                      category
                    )
                  }{" "}
                  {category}
                </Text>

                <Text
                  style={{
                    color:
                      COLORS.text,
                  }}
                >
                  ₹{amount}
                </Text>
              </View>

              <View
                style={{
                  height: 8,

                  backgroundColor:
                    "#1F2937",

                  borderRadius: 8,

                  overflow:
                    "hidden",
                }}
              >
                <View
                  style={{
                    width: `${percentage}%`,

                    height: "100%",

                    backgroundColor:
                      COLORS.primary,
                  }}
                />
              </View>

              <Text
                style={{
                  color:
                    COLORS.textSecondary,

                  marginTop: 4,

                  fontSize: 12,
                }}
              >
                {percentage}% of spending
              </Text>
            </View>
          );
        }
      )}
    </Animated.View>
  );
}