import { Dimensions } from "react-native";
import { BarChart, StackedBarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface Props {
  labels: string[];
  data: number[];
}

export default function CategoryBarChart({ labels, data }: Props) {
  return (
    <BarChart
      data={{
        labels,
        datasets: [
          {
            data,
          },
        ],
      }}
      width={screenWidth - 48}
      height={240}
      yAxisLabel="₹"
      yAxisSuffix="" // <- add this
      fromZero
      chartConfig={{
        backgroundGradientFrom: "#111827",
        backgroundGradientTo: "#111827",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(34,197,94,${opacity})`,
        labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
      }}
      style={{
        borderRadius: 20,
        marginBottom: 18,
      }}
    />
  );
}
