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
    <div className="mt-20">

      <h2 className="text-3xl font-semibold tracking-tight mb-10 dark:text-white text-slate-900">
        Dataset Filters
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

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

                <label className="block mb-3 text-sm font-medium dark:text-zinc-300 text-slate-700">
                  {column}
                </label>

                <select
                  value={
                    filters[
                      column
                    ] || ""
                  }
                  onChange={(e) =>
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
                  className="
                    w-full
                    rounded-2xl
                    border
                    dark:border-white/[0.08]
                    border-black/[0.08]
                    dark:bg-[#18181b]
                    bg-white
                    px-4
                    py-3.5
                    dark:text-white
                    text-slate-900
                    outline-none
                    transition-all
                    shadow-sm
                    focus:ring-2
                    focus:ring-blue-500/20
                    focus:border-blue-500/30
                  "
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
