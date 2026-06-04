import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";
import { getCategoryIcon } from "@/utils/getCategoryIcon";
import Animated, {
  FadeInDown,
} from "react-native-reanimated";
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";

interface Props {
  merchant: string;
  amount: number;
  category: string;
  timestamp: number;
}

export default function TransactionCard({
  merchant, amount, category, timestamp
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
        }}
      >
        -₹{amount}
      </Text>
    </Animated.View>
  );
}