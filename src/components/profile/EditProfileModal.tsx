import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { COLORS } from "@/constants/colors";
import AppInput from "@/components/inputs/AppInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

interface Props {
  visible: boolean;

  fullName: string;

  dateOfBirth: string;

  upiId: string;

  onClose: () => void;

  onSave: (fullName: string, dateOfBirth: string, upiId: string) => void;
}

export default function EditProfileModal({
  visible,
  fullName,
  dateOfBirth,
  upiId,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(fullName);

  const [dob, setDob] = useState(dateOfBirth);

  const [upi, setUpi] = useState(upiId);

  const [showDatePicker, setShowDatePicker] = useState(false);

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

  useEffect(() => {
    if (visible) {
      setName(fullName);
      setDob(dateOfBirth);
      setUpi(upiId);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.card,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: 24,
              fontWeight: "700",
              marginBottom: 20,
            }}
          >
            Edit Profile
          </Text>

          <Text
            style={{
              color: COLORS.textSecondary,
              marginBottom: 8,
              marginTop: 8,
            }}
          >
            Full Name
          </Text>
          <AppInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
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
          <Text
            style={{
              color: COLORS.textSecondary,
              marginBottom: 8,
              marginTop: 8,
            }}
          >
            UPI ID
          </Text>

          <AppInput placeholder="UPI ID" value={upi} onChangeText={setUpi} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 24,
            }}
          >
            <Pressable onPress={onClose}>
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 15,
                  paddingLeft: 18,
                  marginTop: 14
                }}
              >
                ❌Cancel
              </Text>
            </Pressable>

            <View style={{ width: 140 }}>
              <PrimaryButton
                title="Save"
                onPress={() => {
                  onSave(name.trim(), dob.trim(), upi.trim());

                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
