import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { COLORS } from "@/constants/colors";
import { logout, signUp } from "@/services/authService";
import { createUserDocument } from "@/services/userService";
import { Feather } from "@expo/vector-icons";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least 6 characters.",
      );
      return;
    }

    try {
      setLoading(true);

      const user = await signUp(email.trim(), password);

      await createUserDocument({
        uid: user.uid,
        email: user.email ?? "",

        fullName: "",
        dateOfBirth: "",
        currency: "INR",
        upiId: "",
        profilePhoto: "",
        bio: "",

        currentBalance: 0,
        monthlyIncome: 0,
        secondaryIncome: 0,

        fixedExpenses: [],

        savingsTarget: 0,
        emergencyFundGoal: 0,
        overrideDailyLimit: null,

        hasCompletedOnboarding: false,

        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      router.replace({
        pathname: "/auth/verifyEmail",
        params: {
          email: user.email ?? "",
        },
      });
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
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
        Create Account
      </Text>

      <Text
        style={{
          color: COLORS.textSecondary,
          marginTop: 8,
          marginBottom: 40,
        }}
      >
        Start your financial journey
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
      <View
        style={{
          backgroundColor: COLORS.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 18,
          marginBottom: 24,
        }}
      >
        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{
            flex: 1,
            color: COLORS.text,
            paddingVertical: 18,
          }}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={16}
            color={COLORS.textSecondary}
          />
        </Pressable>
      </View>

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor={COLORS.textSecondary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        style={{
          backgroundColor: COLORS.card,
          color: COLORS.text,
          borderRadius: 16,
          padding: 18,
          borderWidth: 1,
          borderColor: COLORS.border,
          marginBottom: 28,
        }}
      />

      <Pressable
        onPress={handleSignup}
        disabled={loading}
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 18,
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
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Create Account
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.push("/auth/login")}
        style={{
          marginTop: 28,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.textSecondary,
          }}
        >
          Already have an account?
        </Text>

        <Text
          style={{
            color: COLORS.primary,
            fontWeight: "700",
            marginTop: 6,
          }}
        >
          Login
        </Text>
      </Pressable>
    </LinearGradient>
  );
}
