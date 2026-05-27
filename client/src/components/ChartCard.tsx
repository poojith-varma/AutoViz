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
    (item) =>
      item[chart.xAxis] !== undefined &&
      item[chart.yAxis] !== undefined
  );

  const renderChart = () => {
    switch (chart.chartType?.toLowerCase()) {
      case "bar":
        return (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={safeData}>
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
            <LineChart data={safeData}>
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
        return (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={safeData}
                dataKey={chart.yAxis}
                nameKey={chart.xAxis}
                outerRadius={100}
                label
              >
                {safeData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={`hsl(${index * 40},70%,60%)`}
                  />
                ))}
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
                data={safeData}
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