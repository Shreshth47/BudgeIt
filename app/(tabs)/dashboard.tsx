import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SummaryCard from "@/components/cards/SummaryCard";
import TransactionCard from "@/components/cards/TransactionCard";
import FloatingNav from "@/components/common/FloatingNav";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";
import CategorySummary from "@/components/dashboard/CategorySummary";
import InsightCard from "@/components/dashboard/InsightCard";
import SavingsProgressCard from "@/components/dashboard/SavingsProgressCard";
import SemiBudgetGauge from "@/components/dashboard/SemiCircularGauge";
import DangerZoneModal from "@/components/modals/DangerZoneModal";
import { COLORS } from "@/constants/colors";
import { syncUserData } from "@/services/syncService";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { getDailyBudget } from "@/utils/getDailyBudget";
import { getEffectiveBudget } from "@/utils/getEffectiveBudget";
import { getRemainingBudget } from "@/utils/getRemainingBudget";
import { sendLocalNotification } from "@/utils/notifications";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Dashboard() {
  const {
    fullName,
    monthlyIncome,
    fixedExpenses,
    savingsTarget,
    secondaryIncome,
    hasCompletedOnboarding,
  } = useOnBoardingStore();

  const { addNotification } = useNotificationStore();

  const dailyBudget = getDailyBudget(
    monthlyIncome + secondaryIncome,
    fixedExpenses,
    savingsTarget,
  );

  const {
    todaysSpend,
    rollover,
    debtCarryForward,
    addDebt,
    simulateNextDay,
    checkAndAdvanceDay,
    lastActiveDate,
    monthlySavings,
    addMonthlySavings,
    checkAndAdvanceMonth,
  } = useDashboardStore();

  const { transactions, addTransaction } = useTransactionStore();

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
  const rotation = useSharedValue(0);
  const refreshAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));
  const handleSync = async () => {
    rotation.value = 0;

    rotation.value = withTiming(-360, {
      duration: 1000,
    });

    await syncUserData();
  };

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
      addNotification({
        id: Date.now().toString(),

        title: "Budget Warning",

        message: "You have entered the danger zone.",

        timestamp: Date.now(),

        read: false,

        type: "warning",
      });
    }
    if (newRemaining <= 0) {
      sendLocalNotification(
        "🚨 Allowance Exhausted",
        "Further spending will create debt.",
      );
      addNotification({
        id: Date.now().toString(),

        title: "Debt Activated",

        message: `₹${debtCarryForward} borrowed from tomorrow.`,

        timestamp: Date.now(),

        read: false,

        type: "danger",
      });
    }
  };

  const profileLoaded = useAuthStore((state) => state.profileLoaded);

  useEffect(() => {
    if (!profileLoaded) {
      return;
    }

    console.log("Running checkAndAdvanceDay with budget:", dailyBudget);

    checkAndAdvanceMonth();
    checkAndAdvanceDay(dailyBudget);
  }, [profileLoaded, dailyBudget]);

  return (
    <ProtectedRoute>
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={["#09090B", "#0B1115", "#09090B"]}
          locations={[0, 0.5, 1]}
          style={{
            flex: 1,
          }}
        >
          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              padding: 24,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                marginTop: 28,
                marginBottom: 24,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    letterSpacing: 1,
                  }}
                >
                  WELCOME
                </Text>

                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "800",
                    color: COLORS.text,
                    marginTop: 4,
                  }}
                >
                  {fullName}
                </Text>
              </View>

              <Pressable
                onPress={handleSync}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 21,

                  backgroundColor: COLORS.card,

                  borderWidth: 1,
                  borderColor: COLORS.border,

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.View style={refreshAnimatedStyle}>
                  <Feather
                    name="refresh-ccw"
                    size={12}
                    color={COLORS.textSecondary}
                  />
                </Animated.View>
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

            {/* <SummaryCard title="Saved" value={`₹${monthlySavings}`} /> */}

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginBottom: 24,
                marginTop: 14,
              }}
            >
              <SummaryCard
                title="Today's Spend"
                value={`₹${todaysSpend}`}
                accentColor="blue"
              />

              <SummaryCard
                title="Rollover"
                value={`₹${rollover}`}
                accentColor="green"
              />
              <SummaryCard
                title="Debt"
                value={`₹${debtCarryForward}`}
                accentColor="red"
              />
            </View>
            <SavingsProgressCard />

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
            {/* <PrimaryButton
          title="Test Notification"
          onPress={() =>
            sendLocalNotification("BudgeIt", "Notification system works!")
          }
        /> */}
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
                  fontWeight: "800",
                  letterSpacing: -0.5,
                  marginBottom: 1,
                  marginTop: 12,
                }}
              >
                Recent Transactions
              </Text>
              <Pressable onPress={() => router.push("/(tabs)/transactions")}>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "700",
                    top: 9,
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
            {/* <Animated.View style={fabStyle}>
          <PrimaryButton
            onPress={() => {
              setAddExpenseVisible(true);
            }}
            title="Add Transaction"
          />
        </Animated.View> */}

            <CategorySummary />
            {/* <PrimaryButton title="Sync Now" onPress={syncUserData} /> */}

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
                addNotification({
                  id: Date.now().toString(),
                  title: "Debt Created",
                  message: `₹${overspent} borrowed. Tomorrow's allowance will reduce to ₹${Math.max(reducedTomorrow, 0)}.`,
                  timestamp: Date.now(),
                  read: false,
                  type: "danger",
                });

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
        </LinearGradient>
        <FloatingNav onAddTransaction={() => setAddExpenseVisible(true)} />
      </View>
    </ProtectedRoute>
  );
}
