import { Modal, View, Text, Pressable } from "react-native";
import { useState } from "react";

import AppInput from "@/components/inputs/AppInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";

import { getDailyBudget } from "@/utils/getDailyBudget";

import { COLORS } from "@/constants/colors";

interface Props {
  visible: boolean;

  monthlyIncome: number;
  secondaryIncome: number;
  savingsTarget: number;
  fixedExpenses: {
    amount: number;
  }[];

  onClose: () => void;

  onSave: (
    monthlyIncome: number,
    secondaryIncome: number,
    savingsTarget: number,
  ) => void;
}

export default function EditFinancialModal({
  visible,
  monthlyIncome,
  secondaryIncome,
  savingsTarget,
  fixedExpenses,
  onClose,
  onSave,
}: Props) {
  const [income, setIncome] = useState(String(monthlyIncome));

  const [secondary, setSecondary] = useState(String(secondaryIncome));

  const [savings, setSavings] = useState(String(savingsTarget));

  const previewBudget = getDailyBudget(
    Number(income) + Number(secondary),
    fixedExpenses,
    Number(savings),
  );

  const sectionStyle = {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "700" as const,
    marginBottom: 4,
    paddingLeft: 8,
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
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
              fontSize: 24,
              fontWeight: "700",
              marginBottom: 20,
            }}
          >
            Edit Financial Details
          </Text>

          <Text style={sectionStyle}>Income</Text>
          <AppInput
            value={income}
            placeholder="Monthly Income"
            keyboardType="numeric"
            onChangeText={setIncome}
          />

          <Text style={sectionStyle}>Secondary Income</Text>
          <AppInput
            value={secondary}
            placeholder="Secondary Income"
            keyboardType="numeric"
            onChangeText={setSecondary}
          />

          <Text style={sectionStyle}>Savings Target</Text>
          <AppInput
            value={savings}
            placeholder="Savings Goal"
            keyboardType="numeric"
            onChangeText={setSavings}
          />
          <View
            style={{
              backgroundColor: "rgba(34,197,94,0.12)",

              borderRadius: 12,

              padding: 14,

              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#22C55E",

                fontWeight: "700",

                textAlign: "center",
              }}
            >
              Daily Allowance Preview
            </Text>

            <Text
              style={{
                color: "#22C55E",

                fontSize: 24,

                fontWeight: "700",

                textAlign: "center",

                marginTop: 4,
              }}
            >
              ₹{previewBudget}/day
            </Text>
          </View>

          <PrimaryButton
            title="Save Changes"
            onPress={() => {
              onSave(
                Number(income) || 0,
                Number(secondary) || 0,
                Number(savings) || 0,
              );
              onClose();
            }}
          />

          <Pressable onPress={onClose}>
            <Text
              style={{
                color: COLORS.textSecondary,
                textAlign: "center",
              }}
            >
              ❌
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
