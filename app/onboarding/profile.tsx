import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import AppInput from "@/components/inputs/AppInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { COLORS } from "@/constants/colors";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import ProgressIndicator from "@/components/common/ProgressIndicator";
import ProfileRow from "@/components/profile/ProfileRow";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

export default function ProfileScreen() {
  const { fullName, currency, dateOfBirth, upiId, setField } =
    useOnBoardingStore();
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(dateOfBirth);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const parseDate = (value: string) => {
    const parsed = new Date(value);

    if (isNaN(parsed.getTime())) {
      return new Date();
    }

    return parsed;
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 24,
      }}
    >
      <ProgressIndicator currentStep={1} totalSteps={4} />
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
        onChangeText={(text) => setField("fullName", text)}
      />
      <Text
        style={{
          color: COLORS.textSecondary,
          marginBottom: 8,
          marginTop: 8,
        }}
      >
        Date of Birth
      </Text>

      {showDatePicker && (
        <DateTimePicker
          value={parseDate(dob)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              setDob(formatDate(selectedDate));
              setField("dateOfBirth", formatDate(selectedDate));
            }
          }}
        />
      )}

      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={{
          backgroundColor: "#111827",
          borderRadius: 14,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text
          style={{
            color: COLORS.text,
            fontSize: 16,
          }}
        >
          {dob || "Select Date"}
        </Text>
      </Pressable>

      <AppInput
        value={currency}
        placeholder="Currency"
        onChangeText={(text) => setField("currency", text)}
      />
      <AppInput
        value={upiId}
        placeholder="UPI ID"
        onChangeText={(text) => setField("upiId", text)}
      />

      <PrimaryButton
        title="Continue"
        onPress={() => router.push("/onboarding/account")}
      />
    </View>
  );
}
