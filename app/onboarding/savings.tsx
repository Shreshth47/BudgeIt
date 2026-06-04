import { View, Text } from "react-native";
import { Href, router } from "expo-router";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import ProgressIndicator from "@/components/common/ProgressIndicator";
import { COLORS } from "@/constants/colors";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { calculateBudget } from "@/utils/calculateBudget";
import getTotalFixedExpenses from "@/utils/getTotalFixedExpenses";
import DailyBudgetPreview from "@/components/cards/DailyBudgetPreview";
import AppInput from "@/components/inputs/AppInput";
import { getDailyBudget } from "@/utils/getDailyBudget";

export default function savings() {
  const {
    monthlyIncome,
    secondaryIncome,
    savingsTarget,
    emergencyFundGoal,
    fixedExpenses,
    setField,
  } = useOnBoardingStore();

  const totalFixedExpenses =
    getTotalFixedExpenses(fixedExpenses);

  const dailyBudget =
    getDailyBudget(
      monthlyIncome+secondaryIncome,
      fixedExpenses,
      savingsTarget
    );
  const availableIncome =
    monthlyIncome +
    secondaryIncome -
    totalFixedExpenses;

    console.log(
  "ONBOARDING DAILY BUDGET",
  dailyBudget
);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 24,
      }}
    >
      <ProgressIndicator
        currentStep={4}
        totalSteps={4}
      />
      <Text
        style={{
          color: COLORS.text,
          fontSize: 32,
          fontWeight: "700",
          marginBottom: 24,
        }}
      >
        How much do you want to save?
      </Text>
      <AppInput
        value={
          savingsTarget === 0
            ? ""
            : String(savingsTarget)
        }
        placeholder="Savings Goal"
        onChangeText={(text) =>
          setField(
            "savingsTarget",
            Number(text) || 0
          )
        }
        keyboardType="numeric"
      />
      <DailyBudgetPreview
        budget={dailyBudget}
        savingsTarget={savingsTarget}
        fixedExpenses={totalFixedExpenses}
      />
      <PrimaryButton
        title="Finish Setup"
        onPress={() =>
          router.replace("/(tabs)/dashboard" as Href)
        }
      />

    </View>
  )
}