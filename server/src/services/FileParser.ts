import path from "path";
import { parseCSV } from "../parsers/csvParser";

export const parseFile = async (
  filePath: string,
  mimetype: string
) => {
  const ext = path.extname(filePath);

  console.log("Parsing file:", ext);

  if (
    mimetype === "text/csv" ||
    ext === ".csv"
  ) {
    return await parseCSV(filePath);
  }

  throw new Error("Unsupported file type");
};