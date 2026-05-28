import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import ChartCard from "./ChartCard";
import DatasetChat from "./DatasetChat";
import InsightCards from "./InsightCards";
import DataTable from "./DataTable";
import ExportButton from "./ExportButton";
import ThemeToggle from "./ThemeToggle";

export default function DropZone() {

  const [darkMode, setDarkMode] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [dataPreview, setDataPreview] =
    useState<any[]>([]);

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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {

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
            "http://localhost:5000/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setDataPreview(
          response.data.preview
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

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-6 md:p-10 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >

      {/* THEME TOGGLE */}
      <ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* HERO */}
      <div className="mb-14 text-center">

        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          AutoViz
        </h1>

        <p
          className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
            darkMode
              ? "text-slate-400"
              : "text-slate-600"
          }`}
        >
          Upload datasets and let AI
          automatically clean,
          analyze, and visualize
          your data instantly.
        </p>
      </div>

      {/* UPLOAD */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-16 md:p-24 text-center cursor-pointer transition-all duration-300 shadow-2xl ${
          darkMode
            ? "border-slate-600 bg-slate-800/50 hover:border-blue-400 hover:bg-slate-800"
            : "border-slate-300 bg-white hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <div>
            <p className="text-3xl font-bold text-blue-400">
              Drop your dataset here 🚀
            </p>
          </div>
        ) : (
          <div>
            <p className="text-3xl font-bold mb-4">
              Drag & Drop Dataset
            </p>

            <p
              className={
                darkMode
                  ? "text-slate-400"
                  : "text-slate-600"
              }
            >
              Supports CSV, XLSX, JSON & PDF tables
            </p>
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-8 text-center">
          <p className="text-blue-400 text-lg animate-pulse">
            AI is analyzing your dataset...
          </p>
        </div>
      )}

      {/* SUMMARY */}
      {rows > 0 && (
        <div
          className={`mt-12 backdrop-blur p-8 rounded-3xl shadow-xl ${
            darkMode
              ? "bg-slate-800/60"
              : "bg-white"
          }`}
        >

          <h2 className="text-3xl font-bold mb-8">
            Cleaning Summary
          </h2>

          <div className="mb-8">
            <ExportButton
              data={cleanedData}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-5">

            <div
              className={`p-6 rounded-2xl ${
                darkMode
                  ? "bg-slate-700/60"
                  : "bg-slate-100"
              }`}
            >
              <p className="text-sm mb-2">
                Total Rows
              </p>

              <h3 className="text-4xl font-black">
                {rows}
              </h3>
            </div>

            <div
              className={`p-6 rounded-2xl ${
                darkMode
                  ? "bg-slate-700/60"
                  : "bg-slate-100"
              }`}
            >
              <p className="text-sm mb-2">
                Empty Rows Removed
              </p>

              <h3 className="text-4xl font-black">
                {removedRows}
              </h3>
            </div>

            <div
              className={`p-6 rounded-2xl ${
                darkMode
                  ? "bg-slate-700/60"
                  : "bg-slate-100"
              }`}
            >
              <p className="text-sm mb-2">
                Duplicate Rows Removed
              </p>

              <h3 className="text-4xl font-black">
                {duplicateRows}
              </h3>
            </div>
          </div>

          {/* WARNINGS */}
          {warnings.length > 0 && (
            <div className="mt-8">

              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                Cleaning Warnings
              </h3>

              <div className="space-y-3">
                {warnings.map(
                  (
                    warning,
                    index
                  ) => (
                    <div
                      key={index}
                      className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-300"
                    >
                      ⚠️ {warning}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* COLUMN TYPES */}
          <div className="mt-8">

            <h3 className="font-bold text-xl mb-4">
              Column Types
            </h3>

            <pre
              className={`p-5 rounded-2xl overflow-auto text-sm ${
                darkMode
                  ? "bg-slate-900"
                  : "bg-slate-100"
              }`}
            >
              {JSON.stringify(
                columnTypes,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* INSIGHTS */}
      <InsightCards
        insights={insights}
      />

      {/* DASHBOARD */}
      {chartRecommendations.length > 0 && (
        <div className="mt-14">

          <h2 className="text-4xl font-black mb-8">
            AI Dashboard
          </h2>

          <div className="grid gap-8">
            {chartRecommendations.map(
              (
                chart,
                index
              ) => (
                <ChartCard
                  key={index}
                  chart={chart}
                  data={cleanedData}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* AI CHAT */}
      {rows > 0 && (
        <DatasetChat
          data={cleanedData}
        />
      )}

      {/* DATA TABLE */}
      <DataTable
        data={cleanedData}
      />
    </div>
  );
}