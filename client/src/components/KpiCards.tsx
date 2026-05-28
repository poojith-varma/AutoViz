type Props = {
  data: any[];
};

export default function KpiCards({
  data,
}: Props) {

  if (!data.length)
    return null;

  const numericColumns =
    Object.keys(data[0]).filter(
      (key) =>
        typeof data[0][key] ===
        "number"
    );

  const salesColumn =
    numericColumns.find(
      (col) =>
        col
          .toLowerCase()
          .includes("sales")
    );

  const profitColumn =
    numericColumns.find(
      (col) =>
        col
          .toLowerCase()
          .includes("profit")
    );

  const countryColumn =
    Object.keys(data[0]).find(
      (col) =>
        col
          .toLowerCase()
          .includes("country")
    );

  const totalSales =
    salesColumn
      ? data.reduce(
          (
            acc,
            row
          ) =>
            acc +
            (Number(
              row[
                salesColumn
              ]
            ) || 0),
          0
        )
      : null;

  const averageProfit =
    profitColumn
      ? (
          data.reduce(
            (
              acc,
              row
            ) =>
              acc +
              (Number(
                row[
                  profitColumn
                ]
              ) || 0),
            0
          ) / data.length
        ).toFixed(2)
      : null;

  let topCountry =
    "N/A";

  if (countryColumn) {

    const countryCounts:
      Record<
        string,
        number
      > = {};

    data.forEach(
      (row) => {

        const country =
          row[
            countryColumn
          ];

        if (!country)
          return;

        countryCounts[
          country
        ] =
          (countryCounts[
            country
          ] || 0) + 1;
      }
    );

    topCountry =
      Object.entries(
        countryCounts
      ).sort(
        (a, b) =>
          b[1] - a[1]
      )[0]?.[0] || "N/A";
  }

  const cards = [
    {
      title:
        "Dataset Rows",
      value:
        data.length,
    },

    {
      title:
        "Total Sales",
      value:
        totalSales !==
        null
          ? `$${totalSales.toLocaleString()}`
          : "N/A",
    },

    {
      title:
        "Average Profit",
      value:
        averageProfit !==
        null
          ? `$${averageProfit}`
          : "N/A",
    },

    {
      title:
        "Top Country",
      value:
        topCountry,
    },
  ];

  return (
    <div className="mt-14">

      <h2 className="text-4xl font-black mb-8">
        KPI Overview
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        {cards.map(
          (
            card,
            index
          ) => (
            <div
              key={index}
              className="bg-slate-800/60 backdrop-blur p-6 rounded-3xl shadow-xl border border-slate-700"
            >
              <p className="text-slate-400 text-sm mb-3">
                {card.title}
              </p>

              <h3 className="text-3xl font-black">
                {card.value}
              </h3>
            </div>
          )
        )}
      </div>
    </div>
  );
}
