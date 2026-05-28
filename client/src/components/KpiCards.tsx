import PremiumCard from "./ui/PremiumCard";

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
      <h2 className="text-3xl font-semibold tracking-tight mb-10 dark:text-white text-slate-900">
        KPI Overview
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        {cards.map(
          (
            card,
            index
          ) => (
            <PremiumCard
  key={index}
  className="p-6"
>

<p className="text-sm dark:text-zinc-400 text-slate-600 mb-3">
  {card.title}
</p>

<h3 className="text-4xl font-semibold tracking-tight dark:text-white text-slate-900">
  {card.value}
</h3>

            </PremiumCard>
          )
        )}
      </div>
    </div>
  );
}
