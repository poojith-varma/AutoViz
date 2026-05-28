type Props = {
  data: any[];

  filters: Record<
    string,
    string
  >;

  setFilters:
    React.Dispatch<
      React.SetStateAction<
        Record<
          string,
          string
        >
      >
    >;
};

export default function FilterBar({
  data,
  filters,
  setFilters,
}: Props) {

  if (!data.length)
    return null;

  const possibleFilters =
    Object.keys(data[0]).filter(
      (key) => {

        const sample =
          data
            .slice(0, 20)
            .map(
              (row) =>
                row[key]
            );

        const unique =
          new Set(sample);

        return (
  typeof sample[0] ===
    "string" &&
  unique.size > 1 &&
  unique.size <= 20
);
      }
    );

  return (
    <div className="mt-14">

      <h2 className="text-4xl font-black mb-8">
        Dataset Filters
      </h2>

      <div className="grid md:grid-cols-4 gap-5">

        {possibleFilters.map(
          (column) => {

            const options =
              Array.from(
                new Set(
                  data.map(
                    (
                      row
                    ) =>
                      row[
                        column
                      ]
                  )
                )
              );

            return (
              <div
                key={column}
              >
                <label className="block mb-2 font-semibold">
                  {column}
                </label>

                <select
                  value={
                    filters[
                      column
                    ] || ""
                  }
                  onChange={(
                    e
                  ) =>
                    setFilters(
                      (
                        prev
                      ) => ({
                        ...prev,

                        [column]:
                          e
                            .target
                            .value,
                      })
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3"
                >
                  <option value="">
                    All
                  </option>

                  {options.map(
                    (
                      option,
                      index
                    ) => (
                      <option
                        key={
                          index
                        }
                        value={String(
                          option
                        )}
                      >
                        {String(
                          option
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}