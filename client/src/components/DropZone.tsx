import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import KpiCards from "./KpiCards";
import ChartCard from "./ChartCard";
import DatasetChat from "./DatasetChat";
import InsightCards from "./InsightCards";
import DataTable from "./DataTable";
import ExportButton from "./ExportButton";
import ThemeToggle from "./ThemeToggle";
import FilterBar from "./FilterBar";
import OutlierAnalysis from "./OutlierAnalysis";
import OutlierChart from "./OutlierChart";
import DatasetProfile from "./DatasetProfile";

import PremiumCard from "./ui/PremiumCard";

export default function DropZone() {

  const [darkMode, setDarkMode] =
    useState(true);

  const [filters, setFilters] =
    useState<
      Record<string, string>
    >({});

  const [loading, setLoading] =
    useState(false);



  const [cleanedData, setCleanedData] =
    useState<any[]>([]);

  const [rows, setRows] =
    useState(0);

  const [removedRows, setRemovedRows] =
    useState(0);

  const [duplicateRows, setDuplicateRows] =
    useState(0);

  const [columnTypes, setColumnTypes] =
    useState<any>({});

  const [warnings, setWarnings] =
    useState<string[]>([]);

  const [
    chartRecommendations,
    setChartRecommendations,
  ] = useState<any[]>([]);

  const [insights, setInsights] =
    useState<any[]>([]);

  const [outliers,
    setOutliers] =
    useState<any[]>([]);

  const onDrop = useCallback(
    async (
      acceptedFiles: File[]
    ) => {

      const file =
        acceptedFiles[0];

      if (!file) return;

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await axios.post(
            import.meta.env.VITE_API_URL + "/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        

        setCleanedData(
          response.data.cleanedData || []
        );

        setRows(
          response.data.rows
        );

        setRemovedRows(
          response.data.removedRows
        );

        setDuplicateRows(
          response.data.duplicateRows
        );

        setColumnTypes(
          response.data.columnTypes
        );

        setWarnings(
          response.data.warnings || []
        );

        setChartRecommendations(
          response.data
            .chartRecommendations || []
        );

        setInsights(
          response.data.insights || []
        );

        setOutliers(
  response.data.outliers || []
);

      } catch (error) {

        console.error(error);

        alert(
          "Upload failed"
        );

      } finally {

        setLoading(false);
      }
    },
    []
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
  });

  const filteredData =
    cleanedData.filter(
      (row) => {

        return Object.entries(
          filters
        ).every(
          ([
            column,
            value,
          ]) => {

            if (!value)
              return true;

            return (
              String(
                row[
                  column
                ]
              ) === value
            );
          }
        );
      }
    );

  return (
<div
  className={`min-h-screen transition-all duration-300 p-6 md:p-10 ${
    darkMode
      ? "bg-[#27272a] text-white"
      : "bg-[#f5f5f5] text-slate-900"
  }`}
>


      {/* THEME TOGGLE */}
      <ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="max-w-6xl mx-auto">

{/* HERO */}
<PremiumCard className="mb-20 p-12 md:p-16 overflow-hidden relative">

  <div className="max-w-5xl mx-auto text-center">

    <div className="
      inline-flex
      items-center
      rounded-full
      border
      dark:border-white/[0.08]
      border-black/[0.08]
      dark:bg-white/[0.03]
      bg-white
      px-4
      py-2
      text-sm
      dark:text-zinc-400
      text-slate-600
      mb-8
      shadow-sm
    ">
      AI-powered analytics workspace
    </div>

    <h1 className="text-5xl md:text-6xl font-semibold tracking-tight dark:text-white text-slate-900 leading-[1.05]">
      Understand your data
      <br />
      in minutes.
    </h1>

    <p className="mt-8 text-lg leading-8 dark:text-zinc-400 text-slate-600 max-w-2xl mx-auto">
      AutoViz automatically cleans,
      analyzes, visualizes, and
      explains datasets using AI —
      without spreadsheets or
      manual dashboard building.
    </p>
  </div>

  {/* subtle glow */}
  <div className="
    absolute
    -top-32
    left-1/2
    -translate-x-1/2
    w-[500px]
    h-[500px]
    rounded-full
    bg-blue-500/10
    blur-3xl
    pointer-events-none
  " />
</PremiumCard>

{/* UPLOAD */}
<PremiumCard className="p-3">

  <div
    {...getRootProps()}
    className="
      rounded-[28px]
      border
      border-dashed
      dark:border-white/[0.08]
      border-black/[0.08]
      dark:bg-white/[0.02]
      bg-slate-50
      px-10
      py-24
      text-center
      transition-all
      duration-300
      dark:hover:bg-white/[0.03]
      hover:bg-slate-100
      dark:hover:border-white/[0.14]
      hover:border-black/[0.12]
      cursor-pointer
    "
  >
    <input {...getInputProps()} />

    {isDragActive ? (
      <div>

        <h2 className="text-3xl font-semibold tracking-tight dark:text-white text-slate-900">
          Drop dataset to begin
        </h2>

        <p className="mt-4 dark:text-zinc-400 text-slate-600">
          Release your file to generate AI-powered analytics.
        </p>
      </div>
    ) : (
      <div>

        <h2 className="text-3xl font-semibold tracking-tight dark:text-white text-slate-900">
          Upload your dataset
        </h2>

        <p className="mt-4 dark:text-zinc-400 text-slate-600 leading-7 max-w-xl mx-auto">
          Drag and drop CSV, XLSX,
          JSON, or structured data
          files to automatically
          generate dashboards,
          charts, insights, and AI
          analysis.
        </p>

        <div className="
          mt-8
          inline-flex
          items-center
          rounded-2xl
          border
          dark:border-white/[0.08]
          border-black/[0.08]
          dark:bg-white/[0.04]
          bg-white
          px-5
          py-3
          text-sm
          font-medium
          dark:text-zinc-200
          text-slate-800
        ">
          Choose File
        </div>
      </div>
    )}
  </div>
</PremiumCard>

        {/* LOADING */}
        {loading && (
          <div className="mt-10 text-center">

            <p className="dark:text-zinc-400 text-slate-600 text-lg animate-pulse">
              AI is analyzing your dataset...
            </p>
          </div>
        )}

        {/* SUMMARY */}
        {rows > 0 && (

          <PremiumCard className="mt-20 p-8">

            <div className="flex items-center justify-between flex-wrap gap-6 mb-10">

              <div>

                <h2 className="text-3xl font-semibold tracking-tight dark:text-white text-slate-900">
                  Cleaning Summary
                </h2>

                <p className="mt-2 dark:text-zinc-400 text-slate-600">
                  Overview of automated data cleaning operations.
                </p>
              </div>

              <ExportButton
                data={cleanedData}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">

              <div
className="
  rounded-3xl
  border
  dark:border-white/[0.08]
  border-black/[0.06]
  dark:bg-white/[0.02]
  bg-slate-50
  p-6
"
>

                <p className="text-sm dark:text-zinc-400 text-slate-600 mb-3">
                  Total Rows
                </p>

                <h3 className="text-4xl font-semibold tracking-tight dark:text-white text-slate-900">
                  {rows}
                </h3>
              </div>

              <div
className="
  rounded-3xl
  border
  dark:border-white/[0.08]
  border-black/[0.06]
  dark:bg-white/[0.02]
  bg-slate-50
  p-6
"
>

                <p className="text-sm dark:text-zinc-400 text-slate-600 mb-3">
                  Empty Rows Removed
                </p>

                <h3 className="text-4xl font-semibold tracking-tight dark:text-white text-slate-900">
                  {removedRows}
                </h3>
              </div>

              <div
className="
  rounded-3xl
  border
  dark:border-white/[0.08]
  border-black/[0.06]
  dark:bg-white/[0.02]
  bg-slate-50
  p-6
"
>

                <p className="text-sm dark:text-zinc-400 text-slate-600 mb-3">
                  Duplicate Rows Removed
                </p>

                <h3 className="text-4xl font-semibold tracking-tight dark:text-white text-slate-900">
                  {duplicateRows}
                </h3>
              </div>
            </div>

            {/* WARNINGS */}
            {warnings.length > 0 && (

              <div className="mt-12">

                <h3 className="text-xl font-semibold tracking-tight mb-6 dark:text-white text-slate-900">
                  Cleaning Warnings
                </h3>

                <div className="space-y-4">

                  {warnings.map(
                    (
                      warning,
                      index
                    ) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-yellow-500/10 bg-yellow-500/5 px-5 py-4 text-sm dark:text-yellow-200 text-yellow-800"
                      >
                        ⚠️ {warning}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* COLUMN TYPES */}
            <div className="mt-12">

              <h3 className="text-xl font-semibold tracking-tight mb-6 dark:text-white text-slate-900">
                Column Types
              </h3>

<pre
  className="
    overflow-auto
    rounded-3xl
    border
    dark:border-white/[0.08]
    border-black/[0.06]
    dark:bg-black/20
    bg-slate-100
    p-6
    text-sm
    dark:text-zinc-300
    text-slate-700
  "
>
                {JSON.stringify(
                  columnTypes,
                  null,
                  2
                )}
              </pre>
            </div>
          </PremiumCard>
        )}

        {/* FILTERS */}
        <FilterBar
          data={cleanedData}
          filters={filters}
          setFilters={setFilters}
        />

        <DatasetProfile
  data={filteredData}
  columnTypes={
    columnTypes
  }
  removedRows={
    removedRows
  }
  duplicateRows={
    duplicateRows
  }
  outliers={
    outliers
  }
/>

        {/* KPI */}
        <KpiCards
          data={filteredData}
        />

        <OutlierAnalysis
  outliers={outliers}
/>

        <OutlierChart
  data={filteredData}
  outliers={outliers}
/>

        {/* INSIGHTS */}
        <InsightCards
          insights={insights}
        />

        {/* DASHBOARD */}
        {chartRecommendations.length > 0 && (

          <div className="mt-20">

<h2 className="text-3xl font-semibold tracking-tight mb-10 dark:text-white text-slate-900"> AI Dashboard </h2>

            <div className="grid gap-8">

              {chartRecommendations.map(
                (
                  chart,
                  index
                ) => (
                  <ChartCard
                    key={index}
                    chart={chart}
                    data={filteredData}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* AI CHAT */}
        {rows > 0 && (
          <DatasetChat
            data={filteredData}
          />
        )}

        {/* TABLE */}
        <DataTable
          data={filteredData}
        />
      </div>
    </div>
  );
}