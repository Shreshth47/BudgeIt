import { Modal, View, Text, Pressable } from "react-native";

import { COLORS } from "@/constants/colors";
import { getOverSpentAmount } from "@/utils/overSpentAmount";

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
  onBorrowTomorrow,
  dailyBudget,
}: Props) {
  const overspent = transactionAmount - remainingBudget;
  const daysAffected = Math.ceil(overspent / dailyBudget);
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,

          backgroundColor: "rgba(0,0,0,0.8)",

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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: COLORS.textSecondary }}>Purchase</Text>

            <Text style={{ color: COLORS.text }}>₹{transactionAmount}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: COLORS.textSecondary }}>Available</Text>

            <Text style={{ color: COLORS.text }}>₹{remainingBudget}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: COLORS.danger }}>Overspent</Text>

            <Text
              style={{
                color: COLORS.danger,
                fontWeight: "700",
              }}
            >
              ₹{overspent}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(245,158,11,0.08)",

              borderRadius: 16,

              padding: 16,

              borderWidth: 1,

              borderColor: "rgba(245,158,11,0.25)",

              marginBottom: 20,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: COLORS.warning,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Impact
            </Text>

            <Text
              style={{
                color: COLORS.text,
                lineHeight: 22,
              }}
            >
              Your next{" "}
              <Text
                style={{
                  color: COLORS.warning,
                  fontWeight: "700",
                }}
              >
                {daysAffected} day
                {daysAffected > 1 ? "s" : ""}
              </Text>{" "}
              of allowance will be reduced by{" "}
              <Text
                style={{
                  color: COLORS.warning,
                  fontWeight: "700",
                }}
              >
                ₹{overspent}
              </Text>
              .
            </Text>
          </View>
          
          <Pressable
            onPress={onBorrowTomorrow}
            style={{
              backgroundColor: COLORS.warning,

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
              Borrow ₹{`${overspent}`}
            </Text>
          </Pressable>
          <Pressable
            onPress={onCancel}
            style={{
              backgroundColor: "#0B0C0F",

              borderWidth: 1,

              borderColor: COLORS.textSecondary,

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
              Cancel Purchase
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
