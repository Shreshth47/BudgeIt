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

import { useAuthStore } from "@/store/useAuthStore";
import { updateUserProfile } from "@/services/userService";
import { Alert } from "react-native";

export default function savings() {
  const {
    monthlyIncome,
    secondaryIncome,
    savingsTarget,
    emergencyFundGoal,
    fixedExpenses,
    setField,
    markOnboardingComplete,
  } = useOnBoardingStore();

  const user = useAuthStore((state) => state.user);

  const totalFixedExpenses = getTotalFixedExpenses(fixedExpenses);

  const dailyBudget = getDailyBudget(
    monthlyIncome + secondaryIncome,
    fixedExpenses,
    savingsTarget,
  );
  const availableIncome = monthlyIncome + secondaryIncome - totalFixedExpenses;

  console.log("ONBOARDING DAILY BUDGET", dailyBudget);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 24,
      }}
    >
      <ProgressIndicator currentStep={4} totalSteps={4} />
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
        value={savingsTarget === 0 ? "" : String(savingsTarget)}
        placeholder="Savings Goal"
        onChangeText={(text) => setField("savingsTarget", Number(text) || 0)}
        keyboardType="numeric"
      />
      <DailyBudgetPreview
        budget={dailyBudget}
        savingsTarget={savingsTarget}
        fixedExpenses={totalFixedExpenses}
      />
      <PrimaryButton
        title="Finish Setup"
        onPress={async () => {
          if (!user) {
            Alert.alert("Error", "You are not logged in.");
            return;
          }

          try {
            await updateUserProfile(user.uid, {
              fullName: useOnBoardingStore.getState().fullName,
              dateOfBirth: useOnBoardingStore.getState().dateOfBirth,
              currency: useOnBoardingStore.getState().currency,
              upiId: useOnBoardingStore.getState().upiId,

              currentBalance: useOnBoardingStore.getState().currentBalance,

              monthlyIncome,
              secondaryIncome,

              fixedExpenses,

              savingsTarget,
              emergencyFundGoal,

              overrideDailyLimit:
                useOnBoardingStore.getState().overrideDailyLimit,

              hasCompletedOnboarding: true,

              updatedAt: Date.now(),
            });

            markOnboardingComplete();

            router.replace("/(tabs)/dashboard");
          } catch (error) {
            console.log(error);

            Alert.alert("Error", "Could not save your profile.");
          }
        }}
      />
    </View>
  );
}
