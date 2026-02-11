import { useMemo } from "react";
import { Trans } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface DataContent {
  date: string;
  value: number;
}

interface ProgressChartProps {
  historyData: Array<DataContent>;
  yAxisTitle?: string;
}

const ProgressChart = ({ historyData, yAxisTitle }: ProgressChartProps) => {
  const processedData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];

    const bestEntries = historyData.reduce(
      (acc, curr) => {
        const existingValue = acc[curr.date]?.value ?? -Infinity;

        if (curr.value > existingValue) {
          acc[curr.date] = { ...curr };
        }

        return acc;
      },
      {} as Record<string, DataContent>,
    );

    return Object.values(bestEntries).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [historyData]);

  if (processedData.length === 0) {
    return (
      <div className="flex flex-col text-xl justify-center text-gray-400 dark:text-gray-500 h-full text-center ">
        <Trans i18nKey="noProgressChartData" />
      </div>
    );
  }

  return (
    <div className="h-64 min-h-48 outline-none focus:outline-none mt-3">
      <ResponsiveContainer
        width="100%"
        minWidth={0}
        minHeight={undefined}
        aspect={undefined}
        height="100%"
        className="focus:outline-none"
      >
        <LineChart data={processedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border-light dark:stroke-border-dark"
          />

          <XAxis dataKey="date" stroke="#ccc" fontSize={12} />

          <YAxis
            stroke="#ccc"
            fontSize={12}
            label={{
              value: yAxisTitle || "",
              angle: -90,
              textAnchor: "middle",
              position: "insideLeft",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              color: "white",
              border: "none",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
