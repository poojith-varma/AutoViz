import { saveAs } from "file-saver";

type Props = {
  data: any[];
};

export default function ExportButton({
  data,
}: Props) {
  const exportCSV = () => {
    if (!data.length) return;

    const headers =
      Object.keys(data[0]);

    const csvRows = [
      headers.join(","),
    ];

    data.forEach((row) => {
      const values =
        headers.map((header) =>
          JSON.stringify(
            row[header] ?? ""
          )
        );

      csvRows.push(
        values.join(",")
      );
    });

    const csvString =
      csvRows.join("\n");

    const blob = new Blob(
      [csvString],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(
      blob,
      "autoviz_cleaned_data.csv"
    );
  };

  return (
    <button
      onClick={exportCSV}
      className="bg-emerald-500 hover:bg-emerald-600 transition px-6 py-4 rounded-2xl font-bold shadow-xl"
    >
      Download Cleaned CSV
    </button>
  );
}