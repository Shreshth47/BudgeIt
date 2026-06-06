import {
  View,
  Text,
  Pressable,
  Alert,
} from "react-native"; import { COLORS } from "@/constants/colors";
import { getCategoryIcon } from "@/utils/getCategoryIcon";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";
import { Feather } from "@expo/vector-icons";
import { useDashboardStore } from "@/store/useDashboardStore";
import { isToday }
  from "@/utils/isToday";
import { getTransactionDayLabel }
  from "@/utils/getTransactionDayLabel";

interface Props {
  id: string,
  merchant: string;
  amount: number;
  category: string;
  timestamp: number;
}

export default function TransactionCard({
  id, merchant, amount, category, timestamp
}: Props) {
  const formattedTime =
    new Date(timestamp)
      .toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
  const removeTransaction =
    useDashboardStore(
      (state) =>
        state.removeTransaction
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
          onPress: () =>
            removeTransaction(id),
        },
      ]
    );
  };
  const canDelete =
    isToday(timestamp);

  const dayLabel =
    getTransactionDayLabel(
      timestamp
    );
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
        borderLeftWidth: 4,

        borderLeftColor: canDelete
          ? "#22C55E"
          : "#4B5563",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 26,
          }}
        >
          {getCategoryIcon(category)}
        </Text>

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
              color:
                COLORS.textSecondary,

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

          fontWeight: "700",

          fontSize: 18,
          top: 12
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
        <Text
          style={{
            color: canDelete
              ? "#22C55E"
              : "#9CA3AF",

            fontSize: 11,

            fontWeight: "700",
          }}
        >
          {dayLabel}
        </Text>

        {canDelete ? (
          <Pressable
            onPress={handleDelete}
          >
            <Feather
              name="trash-2"
              size={16}
              color={
                COLORS.danger
              }
            />
          </Pressable>
        ) : (
          <Feather
            name="lock"
            size={14}
            color="#9CA3AF"
          />
        )}
      </View>
    </Animated.View >
  );
}