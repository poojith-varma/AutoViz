import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import ChartCard from "./ChartCard";

export default function DropZone() {
  const [loading, setLoading] = useState(false);

  const [dataPreview, setDataPreview] = useState<any[]>([]);

  const [rows, setRows] = useState(0);

  const [removedRows, setRemovedRows] = useState(0);

  const [duplicateRows, setDuplicateRows] = useState(0);

  const [columnTypes, setColumnTypes] =
    useState<any>({});

  const [
    chartRecommendations,
    setChartRecommendations,
  ] = useState<any[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      try {
        setLoading(true);

        const formData = new FormData();

        formData.append("file", file);

        const response = await axios.post(
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

        setRows(response.data.rows);

        setRemovedRows(
          response.data.removedRows
        );

        setDuplicateRows(
          response.data.duplicateRows
        );

        setColumnTypes(
          response.data.columnTypes
        );

        setChartRecommendations(
          response.data
            .chartRecommendations
        );
      } catch (error) {
        console.error(error);

        alert("Upload failed");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-10">
      {/* HERO */}
      <div className="mb-14 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          DataLens
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Upload datasets and let AI
          automatically clean,
          analyze, and visualize
          your data instantly.
        </p>
      </div>

      {/* UPLOAD */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-slate-600 bg-slate-800/50 backdrop-blur rounded-3xl p-16 md:p-24 text-center cursor-pointer hover:border-blue-400 hover:bg-slate-800 transition-all duration-300 shadow-2xl"
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

            <p className="text-slate-400">
              Supports CSV, Excel,
              JSON & PDF tables
            </p>
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-8 text-center">
          <p className="text-blue-400 text-lg animate-pulse">
            AI is analyzing your
            dataset...
          </p>
        </div>
      )}

      {/* SUMMARY */}
      {rows > 0 && (
        <div className="mt-12 bg-slate-800/60 backdrop-blur p-8 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold mb-8">
            Cleaning Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-slate-700/60 p-6 rounded-2xl">
              <p className="text-slate-300 text-sm mb-2">
                Total Rows
              </p>

              <h3 className="text-4xl font-black">
                {rows}
              </h3>
            </div>

            <div className="bg-slate-700/60 p-6 rounded-2xl">
              <p className="text-slate-300 text-sm mb-2">
                Empty Rows Removed
              </p>

              <h3 className="text-4xl font-black">
                {removedRows}
              </h3>
            </div>

            <div className="bg-slate-700/60 p-6 rounded-2xl">
              <p className="text-slate-300 text-sm mb-2">
                Duplicate Rows Removed
              </p>

              <h3 className="text-4xl font-black">
                {duplicateRows}
              </h3>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-xl mb-4">
              Column Types
            </h3>

            <pre className="bg-slate-900 p-5 rounded-2xl overflow-auto text-sm">
              {JSON.stringify(
                columnTypes,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* AI DASHBOARD */}
      {chartRecommendations.length >
        0 && (
        <div className="mt-14">
          <h2 className="text-4xl font-black mb-8">
            AI Dashboard
          </h2>

          <div className="grid gap-8">
            {chartRecommendations.map(
              (chart, index) => (
                <ChartCard
                  key={index}
                  chart={chart}
                  data={dataPreview}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* DATA PREVIEW */}
      {rows > 0 && (
        <div className="mt-14">
          <h2 className="text-3xl font-bold mb-6">
            Data Preview
          </h2>

          <div className="bg-slate-800/60 backdrop-blur p-6 rounded-3xl overflow-auto shadow-xl">
            <pre className="text-sm">
              {JSON.stringify(
                dataPreview,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}