import { useDashboardStore } from "@/store/useDashboardStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { getDailyBudget } from "@/utils/getDailyBudget";
import { ScrollView, Text, TextStyle, View } from "react-native";
import { COLORS } from "@/constants/colors";
import ProfileItem from "@/components/profile/ProfileItem";
import FloatingNav from "@/components/common/FloatingNav";
import { useState } from "react";
import EditFinancialModal from "@/components/profile/EditFinancialModal";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { LinearGradient } from "expo-linear-gradient";

import { Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { logout } from "@/services/authService";
import { syncUserData } from "@/services/syncService";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useSyncStore } from "@/store/useSyncStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Profile() {
  const {
    fullName,
    dateOfBirth,
    upiId,
    monthlyIncome,
    secondaryIncome,
    savingsTarget,
    fixedExpenses,
  } = useOnBoardingStore();

  const { setField } = useOnBoardingStore();

  const clearOnboarding = useOnBoardingStore((state) => state.clearOnboarding);

  const resetDashboard = useDashboardStore((state) => state.resetDashboard);

  const clearTransactions = useTransactionStore(
    (state) => state.clearTransactions,
  );

  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );

  const setUser = useAuthStore((state) => state.setUser);

  const setProfileLoaded = useAuthStore((state) => state.setProfileLoaded);

  const [editVisible, setEditVisible] = useState(false);

  const sectionStyle = {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "400" as TextStyle["fontWeight"],
    color: COLORS.textSecondary,
  };

  const { debtCarryForward, monthlySavings } = useDashboardStore();
  const dailyBudget = getDailyBudget(
    monthlyIncome + secondaryIncome,
    fixedExpenses,
    savingsTarget,
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Final cloud backup
            await syncUserData();

            // Firebase logout
            await logout();

            // Clear local persisted storage
            await AsyncStorage.clear();

            // Reset all stores
            clearOnboarding();
            resetDashboard();
            clearTransactions();
            clearNotifications();
            useSyncStore.getState().clearDirtyFlags();

            setUser(null);
            setProfileLoaded(false);

            router.replace("/auth/login");
          } catch (error) {
            console.log("Logout Error:", error);
          }
        },
      },
    ]);
  };

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
          >
            <View
              style={{
                alignItems: "center",
                marginBottom: 24,
                marginTop: 32,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: "rgba(14,164,130,1)",
                  backgroundColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 36,
                    fontWeight: "700",
                  }}
                >
                  {fullName?.charAt(0)}
                </Text>
              </View>

              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 24,
                  fontWeight: "700",
                  marginTop: 12,
                }}
              >
                {fullName}
              </Text>
              <Text
                style={{
                  color: COLORS.textSecondary,
                  marginTop: 4,
                  fontSize: 14,
                }}
              >
                BudgeIt Member
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.card,

                borderRadius: 24,

                borderWidth: 1,

                borderColor: COLORS.border,

                padding: 24,

                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  color: COLORS.textSecondary,

                  fontSize: 12,

                  letterSpacing: 2,
                }}
              >
                DAILY ALLOWANCE
              </Text>

              <Text
                style={{
                  color: COLORS.text,

                  fontSize: 42,

                  fontWeight: "800",

                  marginTop: 8,
                }}
              >
                ₹{dailyBudget}
              </Text>

              <Text
                style={{
                  color: COLORS.primary,

                  marginTop: 8,

                  fontWeight: "600",
                }}
              >
                Based on your current goals
              </Text>
            </View>
            <Text style={sectionStyle}>PERSONAL DETAILS</Text>
            <ProfileItem label="Date of Birth" value={dateOfBirth} />

            <ProfileItem label="UPI ID" value={upiId || "Not Set"} />
            <Text style={sectionStyle}>FINANCIAL OVERVIEW</Text>

            <ProfileItem label="Daily Budget" value={`₹${dailyBudget}`} />

            <ProfileItem label="Current Savings" value={`₹${monthlySavings}`} />

            <ProfileItem label="Current Debt" value={`₹${debtCarryForward}`} />

            <PrimaryButton
              title="Update Financial Goals"
              onPress={() => setEditVisible(true)}
            />
            <EditFinancialModal
              visible={editVisible}
              monthlyIncome={monthlyIncome}
              secondaryIncome={secondaryIncome}
              savingsTarget={savingsTarget}
              fixedExpenses={fixedExpenses}
              onClose={() => setEditVisible(false)}
              onSave={(income, secondary, savings) => {
                setField("monthlyIncome", income);

                setField("secondaryIncome", secondary);

                setField("savingsTarget", savings);
              }}
            />
            <Text
              style={{
                marginTop: 32,
                marginBottom: 12,
                fontSize: 12,
                letterSpacing: 2,
                fontWeight: "400",
                color: COLORS.textSecondary,
              }}
            >
              ACCOUNT
            </Text>

            <PrimaryButton title="Logout" onPress={handleLogout} />
          </ScrollView>
        </LinearGradient>
        <FloatingNav />
      </View>
    </ProtectedRoute>
  );
}
