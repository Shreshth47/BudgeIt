import {
  View,
  Text,
} from "react-native";

import { COLORS }
  from "@/constants/colors";

interface Props {
  title: string;
  value: string;
}

export default function ReportCard({
  title,
  value,
}: Props) {
  return (
    <View
      style={{
        backgroundColor:
          COLORS.card,

        borderRadius: 20,

        padding: 20,

        marginBottom: 16,
      }}
    >
      <Text
        style={{
          color:
            COLORS.textSecondary,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color:
            COLORS.text,

          fontSize: 28,

          fontWeight:
            "700",

          marginTop: 8,
        }}
      >
        {value}
      </Text>
    </View>
  );
}