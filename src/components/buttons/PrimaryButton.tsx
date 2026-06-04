import { Pressable, Text } from "react-native";
import { COLORS } from "../../constants/colors";

interface Props {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 52,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "600",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}