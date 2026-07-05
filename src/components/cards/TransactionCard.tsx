import { COLORS } from "@/constants/colors";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { getCategoryIcon } from "@/utils/getCategoryIcon";
import { getTransactionDayLabel } from "@/utils/getTransactionDayLabel";
import { isToday } from "@/utils/isToday";
import { Feather } from "@expo/vector-icons";
import { Alert, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  timestamp: number;
}

export default function TransactionCard({
  id,
  merchant,
  amount,
  category,
  timestamp,
}: Props) {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const removeTransaction = useTransactionStore(
  (state) => state.removeTransaction
);
  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeTransaction(id),
        },
      ],
    );
  };
  const canDelete = isToday(timestamp);

  const dayLabel = getTransactionDayLabel(timestamp);
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderLeftWidth: 4,
        borderLeftColor: canDelete ? COLORS.primary : "#374151",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "rgba(14,165,164,0.12)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
            }}
          >
            {getCategoryIcon(category)}
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {merchant}
          </Text>

          <Text
            style={{
              color: COLORS.textSecondary,

              marginTop: 2,
            }}
          >
            {category}
            {" • "}
            {formattedTime}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: COLORS.danger,
          fontWeight: "800",
          fontSize: 22,
          paddingTop: 22,
        }}
      >
        -₹{amount}
      </Text>
      <View
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <View
          style={{
            backgroundColor: canDelete
              ? "rgba(8,160,1,0.3)"
              : "rgba(156,163,175,0.12)",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: 10,
            }}
          >
            {dayLabel}
          </Text>
        </View>

        {canDelete ? (
          <Pressable onPress={handleDelete}>
            <Feather name="trash-2" size={16} color={COLORS.danger} />
          </Pressable>
        ) : (
          <Feather name="lock" size={14} color="#9CA3AF" />
        )}
      </View>
    </Animated.View>
  );
}
