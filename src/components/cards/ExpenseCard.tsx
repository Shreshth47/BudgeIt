import { View, Text, Pressable } from "react-native";
import { COLORS } from "@/constants/colors";

interface Props {
  name: string;
  amount: number;
  onDelete?: () => void;
}

export default function ExpenseCard({ amount, name, onDelete }: Props) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text
          style={{
            color: COLORS.text,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {name}
        </Text>

        <Text
          style={{
            color: COLORS.textSecondary,
            marginTop: 4,
          }}
        >
          ₹{amount}
        </Text>
      </View>

      {onDelete && (
        <Pressable onPress={onDelete}>
          <Text
            style={{
              color: COLORS.danger,
              fontWeight: "600",
            }}
          >
            Remove
          </Text>
        </Pressable>
      )}
    </View>
  )
}