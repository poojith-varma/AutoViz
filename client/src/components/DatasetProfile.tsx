import PremiumCard from "./ui/PremiumCard";

type Props = {
  data: any[];
  columnTypes: Record<
    string,
    string
  >;
  removedRows: number;
  duplicateRows: number;
  outliers: any[];
};

export default function DatasetProfile({
  data,
  columnTypes,
  removedRows,
  duplicateRows,
  outliers,
}: Props) {

  if (!data.length)
    return null;

  const totalColumns =
    Object.keys(
      columnTypes
    ).length;

  const numericColumns =
    Object.values(
      columnTypes
    ).filter(
      (type) =>
        type === "number"
    ).length;

  const dateColumns =
    Object.values(
      columnTypes
    ).filter(
      (type) =>
        type === "date"
    ).length;

  const stringColumns =
    Object.values(
      columnTypes
    ).filter(
      (type) =>
        type === "string"
    ).length;

  const totalOutliers =
    outliers.reduce(
      (
        total,
        item
      ) =>
        total +
        item.count,
      0
    );

  const totalIssues =
  removedRows +
  duplicateRows +
  totalOutliers;

const qualityScore =
  Math.max(
    0,
    Math.round(
      100 -
        (totalIssues /
          Math.max(
            data.length,
            1
          )) *
          100
    )
  );

  const qualityCard = {
  label:
    "Data Quality Score",
  value:
    `${qualityScore}/100`,
};

  const stats = [
    {
      label: "Rows",
      value: data.length,
    },
    {
      label: "Columns",
      value: totalColumns,
    },
    {
      label:
        "Numeric Columns",
      value:
        numericColumns,
    },
    {
      label:
        "Categorical Columns",
      value:
        stringColumns,
    },
    {
      label:
        "Date Columns",
      value:
        dateColumns,
    },
    {
      label:
        "Empty Rows Removed",
      value:
        removedRows,
    },
    {
      label:
        "Duplicates Removed",
      value:
        duplicateRows,
    },
    {
      label:
        "Outliers Detected",
      value:
        totalOutliers,
    },
  ];

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-semibold tracking-tight dark:text-white text-slate-900 mb-10">
        Dataset Profile
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        <PremiumCard className="p-6">

  <p className="text-sm dark:text-zinc-400 text-slate-600 mb-3">
    {qualityCard.label}
  </p>

  <h3
    className={`
      text-3xl
      font-semibold
      tracking-tight
      ${
        qualityScore >= 90
          ? "text-green-500"
          : qualityScore >= 70
          ? "text-yellow-500"
          : "text-red-500"
      }
    `}
  >
    {qualityCard.value}
  </h3>

</PremiumCard>

        {stats.map(
          (
            stat,
            index
          ) => (

            <PremiumCard
              key={index}
              className="p-6"
            >

              <p className="text-sm dark:text-zinc-400 text-slate-600 mb-3">
                {stat.label}
              </p>

              <h3 className="text-3xl font-semibold tracking-tight dark:text-white text-slate-900">
                {stat.value}
              </h3>

            </PremiumCard>
          )
        )}

      </div>

    </div>
  );
}   