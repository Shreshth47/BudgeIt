import Svg, { Circle } from "react-native-svg";
import { View, Text } from "react-native";

interface Props {
  remaining: number;
  spent: number;
  dailyBudget: number;
}

export default function BudgetGauge({
  remaining,
  spent,
  dailyBudget,
}: Props) {
  const size = 220;

  const strokeWidth = 16;

  const radius =
    (size - strokeWidth) / 2;

  const circumference =
    2 * Math.PI * radius;

  const percentage =
    dailyBudget <= 0
      ? 1
      : Math.min(
        spent / dailyBudget,
        1
      );

  const ratio = spent / dailyBudget;

  const progress =
    circumference * (1 - percentage);

  let progressColor = "#22C55E";

  if (ratio >= 0.8 && ratio < 1)
    progressColor = "#EF4444";
  else if (ratio >= 0.5 && ratio < 0.8)
    progressColor = "#F59E0B";
  else if (ratio >= 1)
    progressColor = "#8B5CF6"

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1F2937"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View
        style={{
          position: "absolute",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 36,
            fontWeight: "700",
          }}
        >
          ₹{remaining}
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
          }}
        >
          Today's Remaining
        </Text>
      </View>
    </View>
  );
}