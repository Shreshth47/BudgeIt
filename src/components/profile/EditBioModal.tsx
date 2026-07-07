import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { COLORS } from "@/constants/colors";
import AppInput from "@/components/inputs/AppInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";

interface Props {
  visible: boolean;
  bio: string;
  onClose: () => void;
  onSave: (bio: string) => void;
}

export default function EditBioModal({ visible, bio, onClose, onSave }: Props) {
  const [value, setValue] = useState(bio);

  useEffect(() => {
    if (visible) {
      setValue(bio);
    }
  }, [visible, bio]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 24,
            padding: 24,
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 20,
            }}
          >
            Edit Bio
          </Text>

          <AppInput
            placeholder="What's your motivation?"
            value={value}
            onChangeText={setValue}
          />

          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
              marginTop: 10,
            }}
          >
            Keep it short (max 80 characters).
          </Text>

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
                  marginTop: 14,
                }}
              >
                ❌Cancel
              </Text>
            </Pressable>

            <View style={{ width: 140 }}>
              <PrimaryButton
                title="Save"
                onPress={() => {
                  onSave(value.trim().slice(0, 80));

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
