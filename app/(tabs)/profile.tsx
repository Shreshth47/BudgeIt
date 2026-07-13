import { useDashboardStore } from "@/store/useDashboardStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import { getDailyBudget } from "@/utils/getDailyBudget";
import { Pressable, ScrollView, Text, TextStyle, View } from "react-native";
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
import ProfileRow from "@/components/profile/ProfileRow";
import { resetUserProfile } from "@/services/userService";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Feather } from "@expo/vector-icons";
import EditBioModal from "@/components/profile/EditBioModal";
import { getRemainingBudget } from "@/utils/getRemainingBudget";
import { getEffectiveBudget } from "@/utils/getEffectiveBudget";

export default function Profile() {
  const {
    fullName,
    dateOfBirth,
    upiId,
    profilePhoto,
    bio,
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
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editBioVisible, setEditBioVisible] = useState(false);

  const pickProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow gallery access to change your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [
          {
            resize: {
              width: 300,
              height: 300,
            },
          },
        ],
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );

      if (!manipulated.base64) return;

      const imageUri = `data:image/jpeg;base64,${manipulated.base64}`;

      setField("profilePhoto", imageUri);

      useSyncStore.getState().markProfileDirty();
    } catch (error) {
      console.log(error);

      Alert.alert("Image Error", "Unable to update profile picture.");
    }
  };

  const sectionStyle = {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: "600" as TextStyle["fontWeight"],
    color: COLORS.textSecondary,
    marginLeft: 4,
  };

  const { debtCarryForward, monthlySavings } = useDashboardStore();
  const dailyBudget = getDailyBudget(
    monthlyIncome + secondaryIncome,
    fixedExpenses,
    savingsTarget,
  );

  const {
    todaysSpend,
    rollover,
  } = useDashboardStore();

  const effectiveBudget = getEffectiveBudget(
    dailyBudget,
    rollover,
    debtCarryForward,
  );

  const remaining = getRemainingBudget(effectiveBudget, todaysSpend, 0);

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

  const handleResetApp = () => {
    Alert.alert(
      "Reset BudgeIt",
      "This will permanently erase your budgeting data and restart onboarding. Your account will remain logged in.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              const user = useAuthStore.getState().user;

              if (!user) {
                return;
              }

              // Reset cloud profile
              await resetUserProfile(user.uid);

              // Reset local stores
              useOnBoardingStore.getState().clearOnboarding();

              useDashboardStore.getState().resetDashboard();

              useTransactionStore.getState().clearTransactions();

              useNotificationStore.getState().clearNotifications();

              router.replace("/onboarding/welcome");
            } catch (error) {
              console.log(error);

              Alert.alert("Reset Failed", "Unable to reset your account.");
            }
          },
        },
      ],
    );
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
                marginTop: 32,
                marginBottom: 30,
              }}
            >
              <Pressable onPress={pickProfileImage}>
                <View
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                    overflow: "hidden",
                    backgroundColor: COLORS.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 3,
                    borderColor: "#134E4A",
                  }}
                >
                  {profilePhoto ? (
                    <Image
                      source={{ uri: profilePhoto }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 40,
                        fontWeight: "800",
                      }}
                    >
                      {fullName.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: COLORS.card,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Feather name="camera" size={16} color={COLORS.primary} />
                </View>
              </Pressable>

              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 28,
                  fontWeight: "800",
                  marginTop: 8,
                }}
              >
                {fullName}
              </Text>
              <Pressable
                onPress={() => setEditBioVisible(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: 15,
                    fontStyle: "italic",
                    textAlign: "center",
                    maxWidth: 250,
                  }}
                >
                  {bio || "Tap to add a bio"}
                </Text>

                <Feather
                  name="edit-2"
                  size={14}
                  color={COLORS.textSecondary}
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Pressable>
            </View>
            <View
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 26,
                borderWidth: 1,
                borderColor: COLORS.border,
                paddingVertical: 22,
                paddingHorizontal: 24,
                marginBottom: 22,
              }}
            >
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 13,
                  letterSpacing: 1,
                  fontWeight: "600",
                }}
              >
                YOUR DAILY ALLOWANCE
              </Text>

              <Text
                style={{
                  color: COLORS.success,
                  fontSize: 46,
                  fontWeight: "800",
                  marginTop: 8,
                }}
              >
                ₹{dailyBudget}
              </Text>

              <Text
                style={{
                  color: COLORS.primary,
                  marginTop: 6,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                Based on your financial goals.
              </Text>
            </View>

            <Text style={sectionStyle}>PERSONAL INFORMATION</Text>

            <ProfileRow
              icon="user"
              title="Full Name"
              value={fullName}
              onPress={() => setEditProfileVisible(true)}
            />

            <ProfileRow
              icon="calendar"
              title="Date of Birth"
              value={dateOfBirth}
              onPress={() => setEditProfileVisible(true)}
            />

            <ProfileRow
              icon="credit-card"
              title="UPI ID"
              value={upiId || "Not Set"}
              onPress={() => setEditProfileVisible(true)}
            />

            <EditBioModal
              visible={editBioVisible}
              bio={bio}
              onClose={() => setEditBioVisible(false)}
              onSave={(newBio) => {
                setField("bio", newBio);

                useSyncStore.getState().markProfileDirty();
              }}
            />
            <EditProfileModal
              visible={editProfileVisible}
              fullName={fullName}
              dateOfBirth={dateOfBirth}
              upiId={upiId}
              onClose={() => setEditProfileVisible(false)}
              onSave={(name, dob, upi) => {
                setField("fullName", name);

                setField("dateOfBirth", dob);

                setField("upiId", upi);

                useSyncStore.getState().markProfileDirty();
              }}
            />

            <Text style={sectionStyle}>FINANCIAL OVERVIEW</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  width: "48%",
                  backgroundColor: COLORS.card,
                  borderRadius: 20,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: 12,
                  }}
                >
                  Today's Allowance Left
                </Text>

                <Text
                  style={{
                    color: COLORS.success,
                    fontSize: 28,
                    fontWeight: "800",
                    marginTop: 10,
                  }}
                >
                  ₹{remaining}
                </Text>
              </View>

              <View
                style={{
                  width: "48%",
                  backgroundColor: COLORS.card,
                  borderRadius: 20,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: 12,
                  }}
                >
                  DEBT
                </Text>

                <Text
                  style={{
                    color:
                      debtCarryForward > 0 ? COLORS.danger : COLORS.success,
                    fontSize: 28,
                    fontWeight: "800",
                    marginTop: 10,
                  }}
                >
                  ₹{debtCarryForward}
                </Text>
              </View>
            </View>

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
            <Text style={sectionStyle}>ACCOUNT</Text>

            <ProfileRow
              icon="refresh-ccw"
              title="Reset Account"
              value=""
              onPress={handleResetApp}
            />

            <ProfileRow
              icon="log-out"
              title="Logout"
              value=""
              onPress={handleLogout}
            />
          </ScrollView>
        </LinearGradient>
        <FloatingNav />
      </View>
    </ProtectedRoute>
  );
}
