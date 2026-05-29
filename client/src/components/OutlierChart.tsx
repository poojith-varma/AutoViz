import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import PremiumCard from "./ui/PremiumCard";

type Props = {
  data: any[];
  outliers: any[];
};

export default function OutlierChart({
  data,
  outliers,
}: Props) {

  if (
    !outliers.length ||
    !data.length
  ) {
    return null;
  }

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-semibold tracking-tight dark:text-white text-slate-900 mb-10">
        Outlier Visualization
      </h2>

      <div className="grid gap-8">

        {outliers.map(
          (
            item,
            index
          ) => {

            const normalData: any[] =
              [];

            const outlierData: any[] =
              [];

            data.forEach(
              (
                row,
                rowIndex
              ) => {

                const value =
                  Number(
                    row[
                      item.column
                    ]
                  );

                if (
                  isNaN(value)
                ) {
                  return;
                }

                const point = {
                  index:
                    rowIndex,

                  value,
                };

                if (
                  item.values.includes(
                    value
                  )
                ) {

                  outlierData.push(
                    point
                  );

                } else {

                  normalData.push(
                    point
                  );
                }
              }
            );

            return (
              <PremiumCard
                key={index}
                className="p-8"
              >

                <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-6">
                  {item.column}
                </h3>

                <div className="h-[350px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <ScatterChart>

                      <CartesianGrid />

                      <XAxis
                        dataKey="index"
                        name="Row"
                      />

                      <YAxis
                        dataKey="value"
                        name={
                          item.column
                        }
                      />

                      <Tooltip />

                      <Scatter
                        name="Normal"
                        data={
                          normalData
                        }
                        fill="#3b82f6"
                      />

                      <Scatter
                        name="Outlier"
                        data={
                          outlierData
                        }
                        fill="#ef4444"
                      />

                    </ScatterChart>

                  </ResponsiveContainer>

                </div>

              </PremiumCard>
            );
          }
        )}

      </div>

    </div>
  );
}