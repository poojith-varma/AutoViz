import PremiumCard from "./ui/PremiumCard";

type Props = {
  outliers: any[];
};

export default function OutlierAnalysis({
  outliers,
}: Props) {

  if (!outliers.length)
    return null;

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-semibold tracking-tight dark:text-white text-slate-900 mb-10">
        Outlier Analysis
      </h2>

      <div className="grid gap-6">

        {outliers.map(
          (item, index) => (
            <PremiumCard
              key={index}
              className="p-6"
            >

              <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-4">
                {item.column}
              </h3>

              <p className="dark:text-zinc-400 text-slate-600">
                Normal Range:
                {" "}
                {item.lowerBound.toFixed(2)}
                {" "}
                -
                {" "}
                {item.upperBound.toFixed(2)}
              </p>

              <p className="mt-2 dark:text-zinc-400 text-slate-600">
                Outlier Count:
                {" "}
                {item.count}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                {item.values.map(
                  (
                    value: number,
                    i: number
                  ) => (
                    <span
                      key={i}
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-red-500/10
                        text-red-500
                        text-sm
                      "
                    >
                      {value}
                    </span>
                  )
                )}

              </div>

            </PremiumCard>
          )
        )}

      </div>
    </div>
  );
}