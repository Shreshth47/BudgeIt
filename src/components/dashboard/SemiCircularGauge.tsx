import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { describeArc } from "@/utils/describeArc";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";

import { useEffect } from "react";
import { COLORS } from "@/constants/colors";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  remaining: number;
  spent: number;
  dailyBudget: number;
}

export default function SemiBudgetGauge({
  remaining,
  spent,
  dailyBudget,
}: Props) {
  const size = 260;
  const radius = 110;
  const center = size / 2;
  const scale = useSharedValue(1);
  const usageRatio = dailyBudget <= 0 ? 1 : Math.min(spent / dailyBudget, 1);
  const filledAngle = usageRatio * 180;
  const greenEnd = Math.min(filledAngle, 90);
  const yellowEnd = Math.min(filledAngle, 144);
  const redEnd = Math.min(filledAngle, 180);
  const gaugeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });
  const amountScale = useSharedValue(1);
  const amountStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: amountScale.value,
      },
    ],
  }));
  useEffect(() => {
    scale.value = withSequence(withSpring(0.85), withSpring(1));
  }, [spent]);
  useEffect(() => {
    amountScale.value = withSequence(withSpring(1.15), withSpring(1));
  }, [remaining]);
  return (
    <Animated.View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
        },
        gaugeStyle,
      ]}
    >
      <Svg width={size} height={size}>
        <Path
          d={describeArc(center, center, radius, 0, 180)}
          stroke="#1F2937"
          strokeWidth={18}
          fill="none"
          strokeLinecap="butt"
        />
        {filledAngle > 0 && (
          <Path
            d={describeArc(center, center, radius, 0, greenEnd)}
            stroke="#22C55E"
            strokeWidth={24}
            fill="none"
            strokeLinecap="butt"
            
          />
        )}
        {filledAngle > 90 && (
          <Path
            d={describeArc(center, center, radius, 90, yellowEnd)}
            stroke="#F59E0B"
            strokeWidth={24}
            fill="none"
            strokeLinecap="butt"
          />
        )}
        {filledAngle > 144 && (
          <Path
            d={describeArc(center, center, radius, 144, redEnd)}
            stroke="#EF4444"
            strokeWidth={24}
            fill="none"
            strokeLinecap="butt"
          />
        )}
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Animated.Text
          style={[
            {
              color: "white",
              fontSize: 47,
              fontWeight: "800",
              marginTop: -60,
              textShadowColor: remaining > 0 ? COLORS.primary : "#EF4444",
              textShadowRadius: 12,
            },
            amountStyle,
          ]}
        >
          ₹{remaining}
        </Animated.Text>
        <Text style={{ color: "#9CA3AF", marginTop: 0 }}>
          {remaining > 0 ? "Available to Spend" : "Daily Budget Exhausted"}
        </Text>
      </View>
    </Animated.View>
  );
}
