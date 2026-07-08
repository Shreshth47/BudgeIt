import { useLocalSearchParams, router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { isEmailVerified, logout } from "@/services/authService";
import { resendVerificationEmail } from "@/services/authService";

import { COLORS } from "@/constants/colors";
import { useState } from "react";

export default function VerifyEmail() {
  const { email } = useLocalSearchParams<{
    email: string;
  }>();
  const [checking, setChecking] = useState(false);

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
          fontSize: 70,
          textAlign: "center",
        }}
      >
        📧
      </Text>

      <Text
        style={{
          color: COLORS.text,
          fontSize: 32,
          fontWeight: "700",
          textAlign: "center",
          marginTop: 24,
        }}
      >
        Verify Your Email
      </Text>

      <Text
        style={{
          color: COLORS.textSecondary,
          textAlign: "center",
          marginTop: 18,
          lineHeight: 24,
        }}
      >
        We've sent a verification link to
      </Text>

      <Text
        style={{
          color: COLORS.primary,
          textAlign: "center",
          marginTop: 6,
          fontWeight: "700",
          fontSize: 16,
        }}
      >
        {email}
      </Text>
      <Text
        style={{
          color: COLORS.danger,
          textAlign: "center",
          marginTop: 4,
          lineHeight: 24,
        }}
      >
        Please check you Spam folder.
      </Text>

      {/* <Pressable
        onPress={async () => {
          const verified = await isEmailVerified();
          setChecking(true);
          try {
            if (!verified) {
              Alert.alert(
                "Email Not Verified",
                "Please verify your email first.",
              );
              return;
            }
            if (verified) {
              await logout();
              Alert.alert(
                "Verified",
                "Email verified successfully. Please login.",
              );

              router.replace("/auth/login");

              return;
            }
          } finally {
            setChecking(false);
          }
        }}
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 18,
          borderRadius: 18,
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          I've Verified
        </Text>
      </Pressable> */}

      <Pressable
        onPress={async () => {
          try {
            await resendVerificationEmail();

            Alert.alert(
              "Email Sent",
              "Verification email has been sent again.",
            );
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        }}
        style={{
          marginTop: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.warning,
            fontWeight: "600",
            marginTop: 12,
          }}
        >
          Resend Verification Email
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/auth/login")}
        style={{
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.textSecondary,
          }}
        >
          Back to Login
        </Text>
      </Pressable>
    </LinearGradient>
  );
}
