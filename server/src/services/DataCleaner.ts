type CleanResult = {
  cleanedData: any[];
  removedRows: number;
  duplicateRows: number;
  columnTypes: Record<string, string>;
  warnings: string[];
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
      warnings: [],
    };
  }

  const warnings: string[] = [];

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

  const uniqueRows = Array.from(
    uniqueRowsMap.values()
  );

  const duplicateRows =
    nonEmptyRows.length -
    uniqueRows.length;

  // Infer column types
  const columnTypes: Record<
    string,
    string
  > = {};

  const firstRow = uniqueRows[0];

  Object.keys(firstRow).forEach(
    (column) => {
      const values = uniqueRows
        .map((row) => row[column])
        .filter(Boolean);

      const numericCount =
        values.filter(
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

      if (numericRatio > 0.7) {
        columnTypes[column] =
          "number";
      } else if (dateRatio > 0.7) {
        columnTypes[column] = "date";
      } else {
        columnTypes[column] =
          "string";
      }
    }
  );

  // Normalize + clean rows
  const cleanedData = uniqueRows.map(
    (row) => {
      const cleanedRow: any = {};

      Object.keys(row).forEach(
        (column) => {
          let value = row[column];

          // Trim strings
          if (
            typeof value === "string"
          ) {
            value = value.trim();
          }

          // Handle missing values
          if (
            value === "" ||
            value === null ||
            value === undefined
          ) {
            if (
              columnTypes[column] ===
              "number"
            ) {
              value = 0;

              warnings.push(
                `Missing numeric value replaced with 0 in ${column}`
              );
            } else {
              value = "Unknown";

              warnings.push(
                `Missing value replaced in ${column}`
              );
            }
          }

          // Convert numbers
          if (
            columnTypes[column] ===
            "number"
          ) {
            const num =
              Number(value);

            if (isNaN(num)) {
              warnings.push(
                `Invalid number "${value}" in ${column}`
              );

              value = 0;
            } else {
              value = num;
            }
          }

          // Validate dates
          if (
            columnTypes[column] ===
            "date"
          ) {
            const valid =
              !isNaN(
                Date.parse(value)
              );

            if (!valid) {
              warnings.push(
                `Invalid date "${value}" in ${column}`
              );

              value =
                "1970-01-01";
            }
          }

          // Normalize strings
          if (
            columnTypes[column] ===
            "string"
          ) {
            if (
              typeof value ===
              "string"
            ) {
              value =
                value.trim();
            }
          }

          cleanedRow[column] =
            value;
        }
      );

      return cleanedRow;
    }
  );

  return {
    cleanedData,
    removedRows,
    duplicateRows,
    columnTypes,
    warnings: [
      ...new Set(warnings),
    ],
  };
};