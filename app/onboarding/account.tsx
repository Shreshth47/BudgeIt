import { View, Text } from "react-native";
import { router } from "expo-router";

import AppInput from "@/components/inputs/AppInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { COLORS } from "@/constants/colors";
import { useOnBoardingStore } from '@/store/useOnBoardingStore';
import ProgressIndicator from "@/components/common/ProgressIndicator";

export default function AccountScreen() {
  const {
    currentBalance,
    monthlyIncome,
    secondaryIncome,
    setField,
  } = useOnBoardingStore();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 24,
      }}
    >
      <ProgressIndicator
        currentStep={2}
        totalSteps={4}
      />

      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "700",
          marginBottom: 24,
        }}
      >
        What's in your account?
      </Text>

      <AppInput
        value={
          currentBalance === 0
            ? ""
            : String(currentBalance)
        }
        placeholder="Current Balance"
        onChangeText={(text) =>
          setField(
            "currentBalance",
            Number(text) || 0
          )
        }
        keyboardType="numeric"
      />

      <AppInput
        value={
          monthlyIncome === 0
            ? ""
            : String(monthlyIncome)
        }
        placeholder="Monthly Income"
        onChangeText={(text) =>
          setField(
            "monthlyIncome",
            Number(text) || 0
          )
        }
        keyboardType="numeric"
      />

      <AppInput
        value={
          secondaryIncome === 0
            ? ""
            : String(secondaryIncome)
        }
        placeholder="Secondary Income"
        onChangeText={(text) =>
          setField(
            "secondaryIncome",
            Number(text) || 0
          )
        }
        keyboardType="numeric"
      />

      <PrimaryButton
        title="Continue"
        onPress={() =>
          router.push("/onboarding/expenses")
        }
      />
    </View>

  )
}