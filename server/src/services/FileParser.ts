import { parseCSV } from "../parsers/csvParser";

import { parseExcel } from "../parsers/excelParser";

import { parseJSON } from "../parsers/jsonParser";

export const parseFile = async (
  filePath: string,
  mimetype: string
) => {
  console.log(
    "Parsing file:",
    mimetype
  );

  // CSV
  if (
    mimetype.includes("csv")
  ) {
    return await parseCSV(
      filePath
    );
  }

  // Excel
  if (
    mimetype.includes(
      "spreadsheet"
    ) ||
    mimetype.includes("excel")
  ) {
    return parseExcel(
      filePath
    );
  }

  // JSON
  if (
    mimetype.includes(
      "json"
    )
  ) {
    return parseJSON(
      filePath
    );
  }

  throw new Error(
    "Unsupported file type"
  );
};