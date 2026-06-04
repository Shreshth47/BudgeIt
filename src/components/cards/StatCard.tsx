import { COLORS } from '@/constants/colors';
import { View, Text } from "react-native";

interface Props {
  title: string;
  value: string;
}

export default function StatCard({
  title, value }: Props) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          color: COLORS.textSecondary,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: COLORS.text,
          fontSize: 30,
          fontWeight: "700",
          marginTop: 8,
        }}
      >
        {value}
      </Text>
    </View>
  )
}
