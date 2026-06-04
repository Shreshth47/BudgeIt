import {
  Modal,
  View,
  Text,
  Pressable,
} from "react-native";

import { COLORS } from "@/constants/colors";
import { getOverSpentAmount } from '@/utils/overSpentAmount'

interface Props {
  visible: boolean;

  transactionAmount: number;

  remainingBudget: number;

  dailyBudget: number;

  onBorrowTomorrow: () => void;

  onCancel: () => void;
}

export default function DangerZoneModal({
  visible,
  onCancel,
  transactionAmount,
  remainingBudget,
  onBorrowTomorrow, dailyBudget }: Props) {
  const overspent =
    transactionAmount -
    remainingBudget;
  const daysAffected =
    Math.ceil(
      overspent /
      dailyBudget
    );
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,

          backgroundColor:
            "rgba(0,0,0,0.8)",

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
              color: COLORS.danger,

              fontSize: 28,

              fontWeight: "700",

              marginBottom: 16,
            }}
          >
            ⚠️ Danger Zone
          </Text>
          <Text
            style={{
              color: COLORS.text,
              marginBottom: 8,
            }}
          >
            Purchase: ₹{transactionAmount}
          </Text>

          <Text
            style={{
              color: COLORS.text,
              marginBottom: 8,
            }}
          >
            Available: ₹{remainingBudget}
          </Text>

          <Text
            style={{
              color: COLORS.danger,
              fontWeight: "700",
              marginBottom: 24,
            }}
          >
            Over Budget: ₹{overspent}
          </Text>
          <Text
            style={{
              color: COLORS.warning,

              marginBottom: 24,
            }}
          >
            Tomorrow's allowance will be
            reduced by ₹{overspent}
          </Text>
          <Text
            style={{
              color: COLORS.warning,
              marginBottom: 24,
            }}
          >
            This purchase will affect
            the next {daysAffected} day
            {daysAffected > 1 ? "s" : ""}
            of allowance.
          </Text>
          <Pressable
            onPress={onBorrowTomorrow}
            style={{
              backgroundColor:
                COLORS.warning,

              padding: 16,

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
              Borrow From Tomorrow
            </Text>
          </Pressable>
          <Pressable
            onPress={onCancel}
            style={{
              backgroundColor:
                COLORS.card,

              borderWidth: 1,

              borderColor:
                COLORS.textSecondary,

              padding: 16,

              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: COLORS.text,

                textAlign: "center",
              }}
            >
              I'll Be Careful
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}