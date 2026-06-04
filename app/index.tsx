import { View, Text, Button, Pressable } from "react-native";
import WelcomeScreen from "../src/features/onboarding/screens/WelcomeScreen";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { router } from "expo-router";

export default function Home() {

  return (<>
    <WelcomeScreen />
  </>
  );
};