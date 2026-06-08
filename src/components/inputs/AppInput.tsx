import { TextInput } from "react-native";
import { COLORS } from "@/constants/colors";

interface Props {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  keyboardType?: "numeric";
}

export default function AppInput ({value,placeholder,onChangeText,keyboardType}: Props) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textSecondary}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={{
        backgroundColor: COLORS.card,
        color: COLORS.text,
        borderRadius: 16,
        borderColor: COLORS.primary,
        borderWidth: 1,
        padding: 12,
        marginBottom: 16,
      }}
    />
  )
}