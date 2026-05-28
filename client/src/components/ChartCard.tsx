import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import html2canvas from "html2canvas";

import { useRef } from "react";

import PremiumCard from "./ui/PremiumCard";

const axisStyle = {
  stroke: "#71717a",
  fontSize: 12,
};

const gridStyle = {
  stroke:
    "rgba(255,255,255,0.06)",
};

const tooltipStyle = {
  backgroundColor:
    "#18181b",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "16px",

  color: "#fafafa",
};

const pieColors = [
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#38bdf8",
  "#94a3b8",
];

type Props = {
  chart: any;
  data: any[];
};

export default function ChartCard({
  chart,
  data,
}: Props) {

  const chartRef =
    useRef<HTMLDivElement>(null);

  const safeData = data.filter(
    (item) => {

      if (
        chart.chartType ===
        "pie"
      ) {
        return (
          item[
            chart.xAxis
          ] !== undefined
        );
      }

      return (
        item[
          chart.xAxis
        ] !== undefined &&
        item[
          chart.yAxis
        ] !== undefined
      );
    }
  );

  const aggregateData = () => {

    if (
      chart.chartType ===
        "bar" ||
      chart.chartType ===
        "pie"
    ) {

      const grouped: any =
        {};

      safeData.forEach(
        (row) => {

          const key =
            row[
              chart.xAxis
            ];

          const value =
            Number(
              row[
                chart
                  .yAxis
              ]
            ) || 0;

          if (
            !grouped[key]
          ) {
            grouped[key] = 0;
          }

          grouped[key] +=
            value;
        }
      );

      return Object.entries(
        grouped
      ).map(
        ([key, value]) => ({
          [chart.xAxis]:
            key,

          [chart.yAxis]:
            value,
        })
      );
    }

    if (
      chart.chartType ===
      "line"
    ) {

      const grouped: any =
        {};

      safeData.forEach(
        (row) => {

          const key =
            row[
              chart.xAxis
            ];

          const value =
            Number(
              row[
                chart
                  .yAxis
              ]
            ) || 0;

          if (
            !grouped[key]
          ) {
            grouped[key] = 0;
          }

          grouped[key] +=
            value;
        }
      );

      return Object.entries(
        grouped
      )
        .map(
          ([key, value]) => ({
            [chart.xAxis]:
              key,

            [chart.yAxis]:
              value,
          })
        )
        .sort((a, b) =>
          String(
            a[
              chart
                .xAxis
            ]
          ).localeCompare(
            String(
              b[
                chart
                  .xAxis
              ]
            )
          )
        );
    }

    return safeData;
  };

  const chartData =
    aggregateData();

  const exportChart =
    async () => {

      if (
        !chartRef.current
      ) {
        return;
      }

      const canvas =
        await html2canvas(
          chartRef.current,
          {
            backgroundColor:
              "#0f172a",

            scale: 3,

            useCORS: true,
          }
        );

      const image =
        canvas.toDataURL(
          "image/png",
          1.0
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = image;

      link.download =
        `${chart.chartType}-chart.png`;

      link.click();
    };

  const renderChart = () => {

    switch (
      chart.chartType?.toLowerCase()
    ) {

      case "bar":
        return (
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <BarChart
              data={chartData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  gridStyle.stroke
                }
              />

              <XAxis
                dataKey={
                  chart.xAxis
                }
                tick={axisStyle}
              />

              <YAxis
                tick={axisStyle}
              />

              <Tooltip
                contentStyle={
                  tooltipStyle
                }
              />

              <Bar
                dataKey={
                  chart.yAxis
                }
                fill="#60a5fa"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart
              data={chartData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  gridStyle.stroke
                }
              />

              <XAxis
                dataKey={
                  chart.xAxis
                }
                tick={axisStyle}
              />

              <YAxis
                tick={axisStyle}
              />

              <Tooltip
                contentStyle={
                  tooltipStyle
                }
              />

              <Line
                type="monotone"
                dataKey={
                  chart.yAxis
                }
                stroke="#38bdf8"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":

        const pieGrouped: any =
          {};

        safeData.forEach(
          (row) => {

            const key =
              row[
                chart.xAxis
              ] ||
              "Unknown";

            pieGrouped[key] =
              (pieGrouped[
                key
              ] || 0) + 1;
          }
        );

        const pieData =
          Object.entries(
            pieGrouped
          ).map(
            ([
              key,
              value,
            ]) => ({
              name: key,
              value,
            })
          );

        return (
          <ResponsiveContainer
            width="100%"
            height={360}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                innerRadius={70}
                paddingAngle={3}
                label
              >
                {pieData.map(
                  (
                    _,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        pieColors[
                          index %
                            pieColors.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                contentStyle={
                  tooltipStyle
                }
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <ScatterChart>
              <CartesianGrid
                stroke={
                  gridStyle.stroke
                }
              />

              <XAxis
                dataKey={
                  chart.xAxis
                }
                name={
                  chart.xAxis
                }
                tick={axisStyle}
              />

              <YAxis
                dataKey={
                  chart.yAxis
                }
                name={
                  chart.yAxis
                }
                tick={axisStyle}
              />

              <Tooltip
                contentStyle={
                  tooltipStyle
                }
              />

              <Scatter
                data={chartData}
                fill="#818cf8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <p className="text-red-400">
            Unsupported chart type
          </p>
        );
    }
  };

  return (
    <PremiumCard className="p-8">

      <div ref={chartRef}>

        <div className="mb-6">

          <h2 className="text-xl font-semibold tracking-tight capitalize">
            {chart.chartType} Chart
          </h2>

          <p className="text-sm leading-7 dark:text-zinc-400 text-slate-600 mt-3 mb-6">
            {chart.reason}
          </p>

          <button
            onClick={
              exportChart
            }
            className="
              inline-flex
              items-center
              rounded-2xl
              border
              border-white/[0.08]
              bg-white/[0.03]
              px-5
              py-3
              text-sm
              font-medium
              text-zinc-200
              hover:bg-white/[0.06]
              transition-all
            "
          >
            Export PNG
          </button>
        </div>

        {renderChart()}
      </div>
    </PremiumCard>
  );
}
