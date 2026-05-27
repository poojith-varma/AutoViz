type CleanResult = {
  cleanedData: any[];
  removedRows: number;
  duplicateRows: number;
  columnTypes: Record<string, string>;
};

export const cleanData = (
  data: any[]
): CleanResult => {
  if (!data.length) {
    return {
      cleanedData: [],
      removedRows: 0,
      duplicateRows: 0,
      columnTypes: {},
    };
  }

  // Remove fully empty rows
  const nonEmptyRows = data.filter((row) => {
    return Object.values(row).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );
  });

  const removedRows =
    data.length - nonEmptyRows.length;

  // Remove duplicates
  const uniqueRowsMap = new Map();

  nonEmptyRows.forEach((row) => {
    const key = JSON.stringify(row);

    if (!uniqueRowsMap.has(key)) {
      uniqueRowsMap.set(key, row);
    }
  });

  const cleanedData = Array.from(
    uniqueRowsMap.values()
  );

  const duplicateRows =
    nonEmptyRows.length - cleanedData.length;

  // Infer column types
  const columnTypes: Record<string, string> = {};

  const firstRow = cleanedData[0];

  Object.keys(firstRow).forEach((column) => {
    const values = cleanedData
      .map((row) => row[column])
      .filter(Boolean);

    const numericCount = values.filter(
  (value) =>
    !isNaN(Number(value))
).length;

const dateCount = values.filter(
  (value) =>
    !isNaN(Date.parse(value))
).length;

const total = values.length;

const numericRatio =
  numericCount / total;

const dateRatio =
  dateCount / total;

const isNumber =
  numericRatio > 0.7;

const isDate =
  dateRatio > 0.7;

    if (isNumber) {
      columnTypes[column] = "number";
    } else if (isDate) {
      columnTypes[column] = "date";
    } else {
      columnTypes[column] = "string";
    }
  });

  return {
    cleanedData,
    removedRows,
    duplicateRows,
    columnTypes,
  };
};