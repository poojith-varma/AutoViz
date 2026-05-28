export const aggregateChartData = (
  chart: any,
  data: any[]
) => {
  const {
    chartType,
    xAxis,
    yAxis,
  } = chart;

  // PIE + BAR aggregation
  if (
    chartType === "bar" ||
    chartType === "pie"
  ) {
    const grouped: Record<
      string,
      number
    > = {};

    data.forEach((row) => {
      const key =
        row[xAxis];

      const value =
        Number(row[yAxis]) || 0;

      if (!grouped[key]) {
        grouped[key] = 0;
      }

      grouped[key] += value;
    });

    return Object.entries(
      grouped
    ).map(([key, value]) => ({
      [xAxis]: key,
      [yAxis]: value,
    }));
  }

  // LINE chart aggregation
  if (
    chartType === "line"
  ) {
    const grouped: Record<
      string,
      number
    > = {};

    data.forEach((row) => {
      const key =
        row[xAxis];

      const value =
        Number(row[yAxis]) || 0;

      if (!grouped[key]) {
        grouped[key] = 0;
      }

      grouped[key] += value;
    });

    return Object.entries(
      grouped
    )
      .map(([key, value]) => ({
        [xAxis]: key,
        [yAxis]: value,
      }))
      .sort((a, b) =>
        String(
          a[xAxis]
        ).localeCompare(
          String(b[xAxis])
        )
      );
  }

  // Scatter chart
  return data;
};