import express from "express";
import multer from "multer";

import { parseFile } from "../services/FileParser";

import { cleanData } from "../services/DataCleaner";

import { analyzeDataset } from "../services/AIAnalyser";

import { generateInsights } from "../services/InsightAnalyzer";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const parsedData = await parseFile(
      req.file.path,
      req.file.mimetype
    );

    const cleaned = cleanData(parsedData);

    const chartRecommendations =
      await analyzeDataset(
        cleaned.cleanedData,
        cleaned.columnTypes
      );

    const insights =
  await generateInsights(
    cleaned.cleanedData,
    cleaned.columnTypes
  );

    res.json({
  success: true,

  rows: cleaned.cleanedData.length,

  removedRows: cleaned.removedRows,

  duplicateRows: cleaned.duplicateRows,

  columnTypes: cleaned.columnTypes,

  cleanedData: cleaned.cleanedData,

  warnings: cleaned.warnings,

  preview: cleaned.cleanedData.slice(0, 5),

  chartRecommendations,

  insights,

  outliers:
  cleaned.outliers,
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Upload failed",
    });
  }
});

export default router;