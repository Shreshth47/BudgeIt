import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors";

interface Props {
  label: string;
  value: string;
}

export default function ProfileItem({
  label,
  value,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: COLORS.textSecondary,
          fontSize: 12,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: COLORS.text,
          fontSize: 16,
          fontWeight: "600",
          marginTop: 4,
        }}
      >
        {value}
      </Text>
    </View>
  );
}