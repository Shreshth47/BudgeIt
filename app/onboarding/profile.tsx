import { View, Text } from "react-native";
import { router } from "expo-router";

import AppInput from "@/components/inputs/AppInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { COLORS } from "@/constants/colors";
import { useOnBoardingStore } from '@/store/useOnBoardingStore';
import ProgressIndicator from "@/components/common/ProgressIndicator";

export default function ProfileScreen() {
  const {
    fullName,
    currency,
    dateOfBirth,
    upiId,
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
          currentStep={1}
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
          Who are we defending for?
        </Text>

      <AppInput
        value={fullName}
        placeholder="Full Name"
        onChangeText={(text) =>
          setField("fullName", text)
        }
      />
      <AppInput
        value={dateOfBirth}
        placeholder="DD/MM/YYYY"
        onChangeText={(text) =>
          setField("dateOfBirth", text)
        }
      />

      <AppInput
        value={currency}
        placeholder="Currency"
        onChangeText={(text) =>
          setField("currency", text)
        }
      />
      <AppInput
        value={upiId}
        placeholder="UPI ID"
        onChangeText={(text) =>
          setField("upiId", text)
        }
      />

      <PrimaryButton
        title="Continue"
        onPress={() =>
          router.push("/onboarding/account")
        }
      />

    </View>
  )
}
