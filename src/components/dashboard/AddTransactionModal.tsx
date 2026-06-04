import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
} from "react-native";

import { useState } from "react";

import { COLORS } from "@/constants/colors";
import { CATEGORIES } from "@/constants/categories";

interface Props {
  visible: boolean;

  onClose: () => void;

  onSubmit: (
    merchant: string,
    amount: number,
    category: string
  ) => void;
}

export default function AddTransactionModal({
  visible, onClose, onSubmit
}: Props) {
  const [merchant, setMerchant] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("Food");

  const handleSave = () => {
    const parsedAmount =
      Number(amount);

    if (
      !merchant ||
      parsedAmount <= 0
    ) {
      return;
    }

    onSubmit(
      merchant,
      parsedAmount,
      category
    );

    setMerchant("");
    setAmount("");
    setCategory("Food");

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor:
            "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor:
              COLORS.card,

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
            Add Expense
          </Text>
          <TextInput
            placeholder="Merchant"

            placeholderTextColor="#6B7280"

            value={merchant}

            onChangeText={setMerchant}

            style={{
              backgroundColor:
                COLORS.background,

              color: COLORS.text,

              padding: 16,

              borderRadius: 16,

              marginBottom: 16,
            }}
          />
          <TextInput
            placeholder="Amount"

            placeholderTextColor="#6B7280"

            keyboardType="numeric"

            value={amount}

            onChangeText={setAmount}

            style={{
              backgroundColor:
                COLORS.background,

              color: COLORS.text,

              padding: 16,

              borderRadius: 16,

              marginBottom: 16,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {CATEGORIES.map((item) => (
              <Pressable
                key={item}
                onPress={() =>
                  setCategory(item)
                }
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,

                  borderRadius: 999,

                  backgroundColor:
                    category === item
                      ? COLORS.primary
                      : COLORS.background,
                }}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={handleSave}
            style={{
              backgroundColor:
                COLORS.primary,

              padding: 18,

              borderRadius: 16,

              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              Add Expense
            </Text>
          </Pressable>
          <Pressable
            onPress={onClose}
            style={{
              padding: 18,
            }}
          >
            <Text
              style={{
                color: COLORS.textSecondary,
                textAlign: "center",
              }}
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

