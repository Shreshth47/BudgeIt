import { useDashboardStore } from "@/store/useDashboardStore";
import { View, Text, ScrollView } from "react-native";

import { COLORS } from "@/constants/colors";
import SummaryCard from "@/components/cards/SummaryCard";
import FloatingNav from "@/components/common/FloatingNav";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import SavingsProgressCard from "@/components/dashboard/SavingsProgressCard";
import CategoryBarChart from "@/components/reports/CategoryBarChart";

export default function Reports() {
  const transactions = useDashboardStore((state) => state.transactions);

  const monthlySavings = useDashboardStore((state) => state.monthlySavings);

  const debtCarryForward = useDashboardStore((state) => state.debtCarryForward);

  const savingsTarget = useOnBoardingStore((state) => state.savingsTarget);

  const totalSpent = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const totalTransactions = transactions.length;

  const averageTransaction =
    totalTransactions === 0 ? 0 : Math.round(totalSpent / totalTransactions);
  const categoryTotals = transactions.reduce(
    (acc, transaction) => {
      const category = transaction.category || "Others";

      acc[category] = (acc[category] || 0) + transaction.amount;

      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedCategories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  );
  const topCategory = sortedCategories[0]?.[0] || "-";
  const merchantTotals = transactions.reduce(
    (acc, transaction) => {
      acc[transaction.merchant] =
        (acc[transaction.merchant] || 0) + transaction.amount;

      return acc;
    },
    {} as Record<string, number>,
  );

  const topMerchant = Object.entries(merchantTotals).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const progress =
    savingsTarget === 0
      ? 0
      : Math.min((monthlySavings / savingsTarget) * 100, 100);

  const chartLabels = Object.keys(categoryTotals);

  const chartData = Object.values(categoryTotals);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
        }}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 120,
        }}
      >
        <Text
          style={{
            color: COLORS.text,
            fontSize: 32,
            fontWeight: "700",
            marginTop: 32,
            marginBottom: 24,
          }}
        >
          Reports
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <SummaryCard title="Spent" value={`₹${totalSpent}`} />

          <SummaryCard title="Txns" value={`${totalTransactions}`} />
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <SummaryCard title="Avg Txn" value={`₹${averageTransaction}`} />

          <SummaryCard title="Top Cat" value={topCategory} />
        </View>
        <CategoryBarChart labels={chartLabels} data={chartData} />

        <View
          style={{
            backgroundColor: COLORS.card,
            padding: 20,
            borderRadius: 20,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: COLORS.textSecondary,
              marginBottom: 8,
            }}
          >
            Top Merchant
          </Text>

          <Text
            style={{
              color: COLORS.text,
              fontSize: 24,
              fontWeight: "700",
            }}
          >
            {topMerchant}
          </Text>
        </View>
        <Text
          style={{
            color: COLORS.text,
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 16,
          }}
        >
          Category Breakdown
        </Text>
        {sortedCategories.map(([category, amount]) => {
          const percentage = totalSpent === 0 ? 0 : (amount / totalSpent) * 100;

          return (
            <View
              key={category}
              style={{
                backgroundColor: COLORS.card,
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontWeight: "600",
                  }}
                >
                  {category}
                </Text>

                <Text
                  style={{
                    color: COLORS.text,
                  }}
                >
                  ₹{amount}
                </Text>
              </View>

              <View
                style={{
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: "#1F2937",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: COLORS.primary,
                  }}
                />
              </View>
            </View>
          );
        })}
        <SavingsProgressCard />
      </ScrollView>
      <FloatingNav />
    </View>
  );
}
