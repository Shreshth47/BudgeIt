import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { COLORS } from "@/constants/colors";

interface Props {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  value: string;
  onPress?: () => void;
}

export default function ProfileRow({
  icon,
  title,
  value,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "rgba(20,184,166,0.12)",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}
        >
          <Feather
            name={icon}
            size={18}
            color={COLORS.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: COLORS.text,
              fontSize: 16,
              fontWeight: "700",
              marginTop: 3,
            }}
            numberOfLines={1}
          >
            {value}
          </Text>
        </View>
      </View>

      <Feather
        name="chevron-right"
        size={18}
        color={COLORS.textSecondary}
      />
    </Pressable>
  );
}