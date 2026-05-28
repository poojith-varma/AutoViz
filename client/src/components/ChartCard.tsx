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

type Props = {
  chart: any;
  data: any[];
};

export default function ChartCard({
  chart,
  data,
}: Props) {
  const safeData = data.filter(
  (item) => {
    // PIE charts only need xAxis
    if (
      chart.chartType === "pie"
    ) {
      return (
        item[chart.xAxis] !==
        undefined
      );
    }

    // Other charts need both axes
    return (
      item[chart.xAxis] !==
        undefined &&
      item[chart.yAxis] !==
        undefined
    );
  }
);

  const aggregateData = () => {
  // BAR + PIE
  if (
    chart.chartType === "bar" ||
    chart.chartType === "pie"
  ) {
    const grouped: any = {};

    safeData.forEach((row) => {
      const key =
        row[chart.xAxis];

      const value =
        Number(
          row[chart.yAxis]
        ) || 0;

      if (!grouped[key]) {
        grouped[key] = 0;
      }

      grouped[key] += value;
    });

    return Object.entries(
      grouped
    ).map(([key, value]) => ({
      [chart.xAxis]: key,
      [chart.yAxis]: value,
    }));
  }

  // LINE
  if (
    chart.chartType === "line"
  ) {
    const grouped: any = {};

    safeData.forEach((row) => {
      const key =
        row[chart.xAxis];

      const value =
        Number(
          row[chart.yAxis]
        ) || 0;

      if (!grouped[key]) {
        grouped[key] = 0;
      }

      grouped[key] += value;
    });

    return Object.entries(
      grouped
    )
      .map(([key, value]) => ({
        [chart.xAxis]: key,
        [chart.yAxis]: value,
      }))
      .sort((a, b) =>
        String(
          a[
            chart.xAxis
          ]
        ).localeCompare(
          String(
            b[
              chart.xAxis
            ]
          )
        )
      );
  }

  return safeData;
};

const chartData =
  aggregateData();

  const renderChart = () => {
    switch (chart.chartType?.toLowerCase()) {
      case "bar":
        return (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey={chart.xAxis} />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey={chart.yAxis}
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey={chart.xAxis} />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey={chart.yAxis}
                stroke="#10b981"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
  const pieGrouped: any = {};

  safeData.forEach((row) => {
    const key =
      row[chart.xAxis] || "Unknown";

    pieGrouped[key] =
      (pieGrouped[key] || 0) + 1;
  });

  const pieData =
    Object.entries(pieGrouped).map(
      ([key, value]) => ({
        name: key,
        value,
      })
    );

  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          label
        >
          {pieData.map(
            (_, index) => (
              <Cell
                key={index}
                fill={`hsl(${index * 40},70%,60%)`}
              />
            )
          )}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

      case "scatter":
        return (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <ScatterChart>
              <CartesianGrid />

              <XAxis
                dataKey={chart.xAxis}
                name={chart.xAxis}
              />

              <YAxis
                dataKey={chart.yAxis}
                name={chart.yAxis}
              />

              <Tooltip />

              <Scatter
                data={chartData}
                fill="#f59e0b"
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
    <div className="bg-slate-800 p-6 rounded-2xl">
      <h2 className="text-2xl font-bold capitalize mb-2">
        {chart.chartType} Chart
      </h2>

      <p className="text-slate-300 mb-6">
        {chart.reason}
      </p>

      {renderChart()}
    </div>
  );
}