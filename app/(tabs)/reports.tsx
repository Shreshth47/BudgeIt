import { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/constants/colors";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FloatingNav from "@/components/common/FloatingNav";
import SummaryCard from "@/components/cards/SummaryCard";
import SavingsProgressCard from "@/components/dashboard/SavingsProgressCard";
import CategoryBarChart from "@/components/reports/CategoryBarChart";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function Reports() {
  const transactions = useTransactionStore(
    (state) => state.transactions,
  );

  const monthlySavings = useDashboardStore(
    (state) => state.monthlySavings,
  );

  const debtCarryForward = useDashboardStore(
    (state) => state.debtCarryForward,
  );

  const savingsTarget = useOnBoardingStore(
    (state) => state.savingsTarget,
  );

  const totalSpent = useMemo(
    () =>
      transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      ),
    [transactions],
  );

  const totalTransactions = transactions.length;

  const averageTransaction = useMemo(
    () =>
      totalTransactions === 0
        ? 0
        : Math.round(totalSpent / totalTransactions),
    [totalSpent, totalTransactions],
  );

  const categoryTotals = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category || "Others";

      acc[category] = (acc[category] || 0) + transaction.amount;

      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  const sortedCategories = useMemo(
    () =>
      Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1],
      ),
    [categoryTotals],
  );

  const topCategory =
    sortedCategories[0]?.[0] ?? "-";

  const merchantTotals = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      acc[transaction.merchant] =
        (acc[transaction.merchant] || 0) +
        transaction.amount;

      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  const topMerchant =
    Object.entries(merchantTotals).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0] ?? "-";

  const chartLabels = useMemo(
    () => Object.keys(categoryTotals),
    [categoryTotals],
  );

  const chartData = useMemo(
    () => Object.values(categoryTotals),
    [categoryTotals],
  );

  const progress =
    savingsTarget === 0
      ? 0
      : Math.min(
          (monthlySavings / savingsTarget) * 100,
          100,
        );

  if (transactions.length === 0) {
    return (
      <ProtectedRoute>
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#09090B", "#0B1115", "#09090B"]}
            locations={[0, 0.5, 1]}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 36,
              }}
            >
              <Text
                style={{
                  fontSize: 64,
                }}
              >
                📊
              </Text>

              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 28,
                  fontWeight: "800",
                  marginTop: 20,
                }}
              >
                No Reports Yet
              </Text>

              <Text
                style={{
                  color: COLORS.textSecondary,
                  textAlign: "center",
                  marginTop: 12,
                  lineHeight: 24,
                }}
              >
                Start adding expenses and BudgeIt
                will generate insights about your
                spending habits.
              </Text>
            </View>
          </LinearGradient>

          <FloatingNav />
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={["#09090B", "#0B1115", "#09090B"]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}
        >
          <ScrollView
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

            <SavingsProgressCard />

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: 18,
              }}
            >
              <SummaryCard
                title="Total Spent"
                value={`₹${totalSpent}`}
                accentColor="red"
              />

              <SummaryCard
                title="Transactions"
                value={`${totalTransactions}`}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <SummaryCard
                title="Average Spend"
                value={`₹${averageTransaction}`}
              />

              <SummaryCard
                title="Top Category"
                value={topCategory}
                accentColor="green"
              />
            </View>

            <CategoryBarChart
              labels={chartLabels}
              data={chartData}
            />

            <View
              style={{
                backgroundColor: COLORS.card,
                padding: 20,
                borderRadius: 20,
                marginBottom: 28,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 12,
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                TOP MERCHANT
              </Text>

              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 26,
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

            {sortedCategories.map(
              ([category, amount]) => {
                const percentage =
                  totalSpent === 0
                    ? 0
                    : (amount / totalSpent) * 100;

                return (
                  <View
                    key={category}
                    style={{
                      backgroundColor: COLORS.card,
                      padding: 16,
                      borderRadius: 18,
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent:
                          "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.text,
                          fontWeight: "700",
                        }}
                      >
                        {category}
                      </Text>

                      <Text
                        style={{
                          color: COLORS.text,
                        }}
                      >
                        ₹{amount} •{" "}
                        {Math.round(
                          percentage,
                        )}
                        %
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 8,
                        backgroundColor:
                          "#1F2937",
                        borderRadius: 999,
                        overflow: "hidden",
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
                  </View>
                );
              },
            )}
          </ScrollView>
        </LinearGradient>

        <FloatingNav />
      </View>
    </ProtectedRoute>
  );
}