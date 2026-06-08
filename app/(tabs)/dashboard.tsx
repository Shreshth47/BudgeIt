import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { getDailyBudget } from "@/utils/getDailyBudget";
import { ScrollView, View, Text, Pressable, Alert } from "react-native";
import { COLORS } from "@/constants/colors";
import StatCard from "@/components/cards/StatCard";
import { getRemainingBudget } from "@/utils/getRemainingBudget";
import { useDashboardStore } from "@/store/useDashboardStore";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import BudgetGauge from "@/components/dashboard/BudgetGauge";
import SemiBudgetGauge from "@/components/dashboard/SemiCircularGauge";
import TransactionCard from "@/components/cards/TransactionCard";
import SummaryCard from "@/components/cards/SummaryCard";
import FloatingNav from "@/components/common/FloatingNav";
import { useEffect, useState } from "react";
import DangerZoneModal from "@/components/modals/DangerZoneModal";
import { getEffectiveBudget } from "@/utils/getEffectiveBudget";
import { getOverSpentAmount } from "@/utils/overSpentAmount";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import InsightCard from "@/components/dashboard/InsightCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import CategorySummary from "@/components/dashboard/CategorySummary";
import SavingsProgressCard from "@/components/dashboard/SavingsProgressCard";
import { sendLocalNotification } from "@/utils/notifications";

export default function Dashboard() {
  const {
    fullName,
    monthlyIncome,
    fixedExpenses,
    savingsTarget,
    secondaryIncome,
    hasCompletedOnboarding,
  } = useOnBoardingStore();

  const dailyBudget = getDailyBudget(
    monthlyIncome + secondaryIncome,
    fixedExpenses,
    savingsTarget,
  );

  const {
    todaysSpend,
    rollover,
    addTransaction,
    transactions,
    debtCarryForward,
    addDebt,
    simulateNextDay,
    checkAndAdvanceDay,
    lastActiveDate,
    monthlySavings,
    addMonthlySavings,
    checkAndAdvanceMonth,
  } = useDashboardStore();

  const effectiveBudget = getEffectiveBudget(
    dailyBudget,
    rollover,
    debtCarryForward,
  );

  const remaining = getRemainingBudget(effectiveBudget, todaysSpend, 0);

  const gaugeBudget = Math.max(effectiveBudget + debtCarryForward, 1);

  const unused = Math.max(effectiveBudget - todaysSpend, 0);

  const [dangerVisible, setDangerVisible] = useState(false);

  const [pendingTransaction, setPendingTransaction] = useState<{
    amount: number;
    merchant: string;
    category: string;
  } | null>(null);

  const [addExpenseVisible, setAddExpenseVisible] = useState(false);

  const scale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  const handleTransactionAttempt = (
    amount: number,
    merchant: string,
    category: string,
  ) => {
    if (amount > remaining) {
      setPendingTransaction({
        amount,
        merchant,
        category,
      });
      setDangerVisible(true);
      return;
    }

    addTransaction({
      id: Date.now().toString(),

      merchant,

      amount,
      category,

      timestamp: Date.now(),
      debtCreated: 0,
    });
    const newRemaining = remaining - amount;

    if (newRemaining > 0 && newRemaining <= effectiveBudget * 0.1) {
      sendLocalNotification(
        "⚠️ Budget Warning",
        `Only ₹${newRemaining} left today`,
      );
    }
    if (newRemaining <= 0) {
      sendLocalNotification(
        "🚨 Allowance Exhausted",
        "Further spending will create debt.",
      );
    }
  };

  const handleResetApp = () => {
    Alert.alert(
      "Reset BudgeIt",
      "This will delete all onboarding and transaction data.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            hasCompletedOnboarding: false;
            await AsyncStorage.clear();

            router.replace("/onboarding/welcome");
          },
        },
      ],
    );
  };

  useEffect(() => {
    checkAndAdvanceDay(dailyBudget);
  }, []);

  useEffect(() => {
    checkAndAdvanceMonth();

    checkAndAdvanceDay(dailyBudget);
  }, []);

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
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              marginTop: 32,
            }}
          >
            Good Morning 👋
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: COLORS.text,
            }}
          >
            {fullName}
          </Text>
          <Pressable
            onPress={handleResetApp}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: "#991B1B",
              width: 40,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
              }}
            >
              🗑
            </Text>
          </Pressable>
        </View>
        <SemiBudgetGauge
          remaining={remaining}
          spent={todaysSpend}
          dailyBudget={gaugeBudget}
        />
        <InsightCard
          remaining={remaining}
          dailyBudget={effectiveBudget}
          debtCarryForward={debtCarryForward}
        />
        <SavingsProgressCard />
        {/* <SummaryCard title="Saved" value={`₹${monthlySavings}`} /> */}

        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 24,
            marginTop: 14,
          }}
        >
          <SummaryCard title="Today's Spend" value={`₹${todaysSpend}`} />

          <SummaryCard title="Rollover" value={`₹${rollover}`} />
          <SummaryCard title="Debt" value={`₹${debtCarryForward}`} />
        </View>
        <AddTransactionModal
          visible={addExpenseVisible}
          onClose={() => setAddExpenseVisible(false)}
          onSubmit={(merchant, amount, category) => {
            handleTransactionAttempt(amount, merchant, category);
          }}
        />

        {/*<PrimaryButton
          title="Add 100"
          onPress={() =>
            handleTransactionAttempt(100,"Food","Food")
          }
        />
        {/*<PrimaryButton
          title="Add 1000"
          onPress={() =>
            handleTransactionAttempt(1000)
          }
        />
        <PrimaryButton
          title="Test Danger Zone"
          onPress={() =>
            setDangerVisible(true)
          }
        /> */}

        {/* <PrimaryButton
          title="Test Savings"
          onPress={() => addMonthlySavings(500)}
        />
        <PrimaryButton
          title="Test Month Change"
          onPress={() =>
            useDashboardStore.setState({
              lastActiveMonth: "2025-01",
            })
          }
        /> */}
        <PrimaryButton
          title="Test Notification"
          onPress={() =>
            sendLocalNotification("BudgeIt", "Notification system works!")
          }
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 16,
            }}
          >
            Recent Transactions
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/transactions")}>
            <Text
              style={{
                color: COLORS.primary,
                fontWeight: "600",
              }}
            >
              View All
            </Text>
          </Pressable>
        </View>

        {transactions.length === 0 ? (
          <Text
            style={{
              color: COLORS.textSecondary,
            }}
          >
            No transactions yet
          </Text>
        ) : (
          transactions
            .slice(0, 5)
            .map((transaction) => (
              <TransactionCard
                key={transaction.id}
                id={transaction.id}
                merchant={transaction.merchant}
                amount={transaction.amount}
                category={transaction.category}
                timestamp={transaction.timestamp}
              />
            ))
        )}
        <Animated.View style={fabStyle}>
          <PrimaryButton
            onPress={() => {
              setAddExpenseVisible(true);
            }}
            title="Add Transaction"
          />
        </Animated.View>

        <CategorySummary />

        <DangerZoneModal
          visible={dangerVisible}
          transactionAmount={pendingTransaction?.amount ?? 0}
          remainingBudget={remaining}
          dailyBudget={dailyBudget}
          onBorrowTomorrow={() => {
            if (!pendingTransaction) return;
            const overspent = Math.max(
              pendingTransaction.amount - remaining,
              0,
            );

            addDebt(overspent);
            const reducedTomorrow = dailyBudget - overspent;
            sendLocalNotification(
              "⚠️ Budget Borrowed",
              `₹${overspent} borrowed. Tomorrow's allowance will reduce to ₹${Math.max(reducedTomorrow, 0)}.`,
            );

            addTransaction({
              id: Date.now().toString(),
              merchant: pendingTransaction?.merchant ?? "Unknown",
              amount: pendingTransaction?.amount ?? 0,
              category: pendingTransaction?.category ?? "Unknown",
              timestamp: Date.now(),
              debtCreated: overspent,
            });
            setPendingTransaction(null);
            setDangerVisible(false);
          }}
          onCancel={() => {
            setPendingTransaction(null);
            setDangerVisible(false);
          }}
        />
      </ScrollView>
      <FloatingNav />
    </View>
  );
}
