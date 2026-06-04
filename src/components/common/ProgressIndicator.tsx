import { View } from "react-native";

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
        marginTop: 32
      }}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor:
              index < currentStep
                ? "#22C55E"
                : "#374151",
          }}
        />
      ))}
    </View>
)};