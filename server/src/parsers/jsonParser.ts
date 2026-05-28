import fs from "fs";

export const parseJSON = (
  filePath: string
) => {
  const raw =
    fs.readFileSync(
      filePath,
      "utf-8"
    );

  return JSON.parse(raw);
};