import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/constants/colors";
import { useState } from "react";
import { TextInput, Pressable, Alert, ActivityIndicator } from "react-native";

import { signIn } from "@/services/authService";
import { router } from "expo-router";
import { hasCompletedOnboarding } from "@/services/userService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);

      await signIn(email.trim(), password);

      const user = await signIn(email, password);

      const completed = await hasCompletedOnboarding(user.uid);

      if (completed) {
        router.replace("/(tabs)/dashboard");
      } else {
        router.replace("/onboarding/welcome");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={["#09090B", "#0B1115", "#09090B"]}
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          color: COLORS.text,
          fontSize: 36,
          fontWeight: "700",
        }}
      >
        Welcome Back
      </Text>

      <Text
        style={{
          color: COLORS.textSecondary,
          marginTop: 8,
          marginBottom: 40,
        }}
      >
        Sign in to continue using BudgeIt
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          backgroundColor: COLORS.card,
          color: COLORS.text,
          borderRadius: 16,
          padding: 18,
          borderWidth: 1,
          borderColor: COLORS.border,
          marginBottom: 16,
        }}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={COLORS.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: COLORS.card,
          color: COLORS.text,
          borderRadius: 16,
          padding: 18,
          borderWidth: 1,
          borderColor: COLORS.border,
          marginBottom: 24,
        }}
      />
      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: COLORS.primary,
          padding: 18,
          borderRadius: 18,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text
            style={{
              color: "#FFF",
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Login
          </Text>
        )}
      </Pressable>
      <Pressable
        onPress={() => router.push("/auth/signup")}
        style={{
          marginTop: 24,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.textSecondary,
          }}
        >
          Don't have an account?
        </Text>

        <Text
          style={{
            color: COLORS.primary,
            fontWeight: "700",
            marginTop: 6,
          }}
        >
          Create Account
        </Text>
      </Pressable>
    </LinearGradient>
  );
}
