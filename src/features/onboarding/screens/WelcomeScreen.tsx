import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen() {
  const clearAllData = async () => {
    await AsyncStorage.clear();
  };
  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.background,
      paddingHorizontal: 24,
      justifyContent: "center",
    }}>
      <Text
        style={{
          color: COLORS.textSecondary,
          fontSize: 16,
          lineHeight: 24,
          marginBottom: 40,
        }}
      >
        Stay ahead of overspending with
        dynamic daily budgets and smart
        alerts.
      </Text>
      <PrimaryButton
        title="Let's Get Started"
        onPress={() => router.push("/onboarding/profile")}
      />
    </View>
  )
}