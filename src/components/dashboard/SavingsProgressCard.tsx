import { View, Text } from "react-native";

import { COLORS } from "@/constants/colors";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useOnBoardingStore } from "@/store/useOnBoardingStore";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function SavingsProgressCard() {
  const savingsTarget = useOnBoardingStore((state) => state.savingsTarget);

  const actualSavings = useDashboardStore((state) => state.monthlySavings);

  const rollover = useDashboardStore((state) => state.rollover);

  const projectedSavings = actualSavings + rollover;

  const percentage =
    savingsTarget === 0
      ? 0
      : Math.min((projectedSavings / savingsTarget) * 100, 100);

  const progress = useSharedValue(percentage);

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 700,
    });
  }, [percentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 20,
        marginTop: 8,
        elevation: 8
      }}
    >
      <Text
        style={{
          color: COLORS.textSecondary,
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 2,
        }}
      >
        MONTHLY SAVINGS
      </Text>

      <Text
        style={{
          color: COLORS.text,
          fontSize: 30,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        ₹{projectedSavings}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <View>
          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
            }}
          >
            TARGET
          </Text>

          <Text
            style={{
              color: COLORS.text,
              fontWeight: "700",
            }}
          >
            ₹{savingsTarget}
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
            }}
          >
            SAVED
          </Text>

          <Text
            style={{
              color: COLORS.text,
              fontWeight: "700",
            }}
          >
            ₹{actualSavings}
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 12,
          backgroundColor: "#1F2937",
          borderRadius: 999,
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: COLORS.primary,
              borderRadius: 999,
            },
            progressStyle,
          ]}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >


        <View
          style={{
            backgroundColor: "rgba(14,165,164,0.15)",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontWeight: "700",
            }}
          >
            {Math.round(percentage)}%
          </Text>
        </View>
      </View>
    </View>
  );
}
