type OutlierInfo = {
  column: string;
  count: number;
  lowerBound: number;
  upperBound: number;
  values: number[];
};

type CleanResult = {
  cleanedData: any[];
  removedRows: number;
  duplicateRows: number;
  columnTypes: Record<string, string>;
  warnings: string[];
  outliers: OutlierInfo[];
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
  outliers: [],
};
  }

  // Use Set to avoid duplicate warnings
  const warnings =
    new Set<string>();

  const outlierResults:
  OutlierInfo[] = [];

  // Remove fully empty rows
  const nonEmptyRows =
    data.filter((row) => {

      return Object.values(
        row
      ).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !==
            ""
      );
    });

  const removedRows =
    data.length -
    nonEmptyRows.length;

  // Remove duplicate rows
  const uniqueRowsMap =
    new Map();

  nonEmptyRows.forEach(
    (row) => {

      const key =
        JSON.stringify(row);

      if (
        !uniqueRowsMap.has(
          key
        )
      ) {

        uniqueRowsMap.set(
          key,
          row
        );
      }
    }
  );

  const uniqueRows =
    Array.from(
      uniqueRowsMap.values()
    );

  const duplicateRows =
    nonEmptyRows.length -
    uniqueRows.length;

  // Detect column types
  const columnTypes:
    Record<
      string,
      string
    > = {};

  const firstRow =
    uniqueRows[0];

  Object.keys(firstRow).forEach(
    (column) => {

      const values =
        uniqueRows
          .map(
            (row) =>
              row[column]
          )
          .filter(Boolean);

      const numericCount =
        values.filter(
          (value) =>
            !isNaN(
              Number(value)
            )
        ).length;

      const dateCount =
        values.filter(
          (value) =>
            !isNaN(
              Date.parse(value)
            )
        ).length;

      const total =
        values.length;

      const numericRatio =
        numericCount / total;

      const dateRatio =
        dateCount / total;

      if (
        numericRatio > 0.7
      ) {

        columnTypes[column] =
          "number";

      } else if (
        dateRatio > 0.7
      ) {

        columnTypes[column] =
          "date";

      } else {

        columnTypes[column] =
          "string";
      }
    }
  );

  // Clean rows
  const cleanedData =
    uniqueRows.map(
      (row) => {

        const cleanedRow: any =
          {};

        Object.keys(row).forEach(
          (column) => {

            let value =
              row[column];

            // Trim whitespace
            if (
              typeof value ===
              "string"
            ) {

              value =
                value.trim();
            }

            // Handle missing values
            if (
              value === "" ||
              value === null ||
              value === undefined
            ) {

              if (
                columnTypes[
                  column
                ] === "number"
              ) {

                value = 0;

                warnings.add(
                  `Missing numeric value replaced with 0 in ${column}`
                );

              } else {

                value =
                  "Unknown";

                warnings.add(
                  `Missing value replaced in ${column}`
                );
              }
            }

            // Convert numbers
            if (
              columnTypes[
                column
              ] === "number"
            ) {

              const num =
                Number(value);

              if (
                isNaN(num)
              ) {

                warnings.add(
                  `Invalid number "${value}" in ${column}`
                );

                value = 0;

              } else {

                value = num;
              }
            }

            // Validate dates
            if (
              columnTypes[
                column
              ] === "date"
            ) {

              const valid =
                !isNaN(
                  Date.parse(
                    value
                  )
                );

              if (!valid) {

                warnings.add(
                  `Invalid date "${value}" in ${column}`
                );

                value =
                  "1970-01-01";
              }
            }

            // STRING CLEANING
            if (
              columnTypes[
                column
              ] === "string"
            ) {

              if (
                typeof value ===
                "string"
              ) {

                // Trim again safely
                value =
                  value.trim();

                // Case normalization
                if (
                  value.length <=
                    20 &&
                  /^[a-zA-Z\s]+$/.test(
                    value
                  )
                ) {

                  const original =
                    value;

                  value =
                    value.toUpperCase();

                  if (
                    original !==
                    value
                  ) {

                    warnings.add(
                      `Normalized casing in ${column}`
                    );
                  }
                }
              }
            }

            cleanedRow[column] =
              value;
          }
        );

        return cleanedRow;
      }
    );

  // OUTLIER DETECTION (IQR)
  Object.keys(
    columnTypes
  ).forEach((column) => {

    if (
      columnTypes[column] !==
      "number"
    ) {
      return;
    }

    const values =
      cleanedData
        .map(
          (row) =>
            row[column]
        )
        .filter(
          (value) =>
            typeof value ===
              "number" &&
            !isNaN(value)
        )
        .sort(
          (a, b) => a - b
        );

    if (
      values.length < 4
    ) {
      return;
    }

    const q1 =
      values[
        Math.floor(
          values.length *
            0.25
        )
      ];

    const q3 =
      values[
        Math.floor(
          values.length *
            0.75
        )
      ];

    const iqr =
      q3 - q1;

    const lowerBound =
      q1 - 1.5 * iqr;

    const upperBound =
      q3 + 1.5 * iqr;

    const outliers =
      values.filter(
        (value) =>
          value <
            lowerBound ||
          value >
            upperBound
      );

    if (
  outliers.length > 0
) {

  warnings.add(
    `Detected ${outliers.length} outliers in ${column}`
  );

  outlierResults.push({
    column,

    count:
      outliers.length,

    lowerBound,

    upperBound,

    values:
      outliers.slice(
        0,
        20
      ),
  });
}
  });

  return {
  cleanedData,
  removedRows,
  duplicateRows,
  columnTypes,

  warnings:
    Array.from(
      warnings
    ),

  outliers:
    outlierResults,
};
};