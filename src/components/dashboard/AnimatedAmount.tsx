import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

interface Props {
  value: number;
}

const AnimatedText =
  Animated.createAnimatedComponent(Text);

export default function AnimatedAmount({
  value,
}: Props) {
  const animatedValue =
    useSharedValue(value);

  useEffect(() => {
    animatedValue.value =
      withTiming(value, {
        duration: 400,
      });
  }, [value]);

  const animatedProps =
    useAnimatedProps(() => {
      return {
        text:
          `₹${Math.round(
            animatedValue.value
          )}`,
      } as any;
    });

  return (
    <AnimatedText
      animatedProps={animatedProps}
      style={{
        color: "white",
        fontSize: 42,
        fontWeight: "700",
      }}
    />
  );
}