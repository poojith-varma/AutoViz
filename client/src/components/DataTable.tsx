import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";

import {
  useState,
  useMemo,
} from "react";

type Props = {
  data: any[];
};

export default function DataTable({
  data,
}: Props) {

  const [search, setSearch] =
    useState("");

  const safeData = useMemo(
    () =>
      Array.isArray(data)
        ? data
        : [],
    [data]
  );

  const filteredData =
    useMemo(() => {

      if (!search.trim()) {
        return safeData;
      }

      return safeData.filter(
        (row) =>
          Object.values(row).some(
            (value) =>
              String(value)
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          )
      );

    }, [safeData, search]);

  const columnHelper =
    createColumnHelper<any>();

  const columns = useMemo(
    () =>
      safeData.length
        ? Object.keys(
            safeData[0]
          ).map((key) =>
            columnHelper.accessor(
              key,
              {
                header: key,
                cell: (
                  info
                ) =>
                  String(
                    info.getValue()
                  ),
              }
            )
          )
        : [],
    [safeData]
  );

  const table =
    useReactTable({
      data: filteredData,
      columns,
      getCoreRowModel:
        getCoreRowModel(),
    });

  if (!safeData.length) {
    return null;
  }

  return (
    <div className="mt-14">
      <h2 className="text-3xl font-bold mb-6">
        Data Preview
      </h2>

      <input
        type="text"
        placeholder="Search dataset..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="mb-6 w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-400"
      />

      <div className="overflow-auto rounded-3xl border border-slate-700 shadow-xl max-h-[600px]">
        <table className="min-w-full bg-slate-800 text-sm">
          <thead className="bg-slate-900 sticky top-0">
            {table
              .getHeaderGroups()
              .map(
                (
                  headerGroup
                ) => (
                  <tr
                    key={
                      headerGroup.id
                    }
                  >
                    {headerGroup.headers.map(
                      (
                        header
                      ) => (
                        <th
                          key={
                            header.id
                          }
                          className="px-5 py-4 text-left text-slate-300 font-bold border-b border-slate-700 whitespace-nowrap"
                        >
                          {flexRender(
                            header
                              .column
                              .columnDef
                              .header,
                            header.getContext()
                          )}
                        </th>
                      )
                    )}
                  </tr>
                )
              )}
          </thead>

          <tbody>
            {table
              .getRowModel()
              .rows
              .slice(0, 50)
              .map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-700 hover:bg-slate-700/40 transition"
                >
                  {row
                    .getVisibleCells()
                    .map(
                      (
                        cell
                      ) => (
                        <td
                          key={
                            cell.id
                          }
                          className="px-5 py-4 whitespace-nowrap text-slate-200"
                        >
                          {flexRender(
                            cell
                              .column
                              .columnDef
                              .cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="text-slate-400 mt-4 text-sm">
        Showing first 50 rows
      </p>
    </div>
  );
}