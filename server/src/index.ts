import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import uploadRoutes from "./routes/upload.routes";
import chatRoutes from "./routes/chat.routes";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/upload", uploadRoutes);

app.use("/chat", chatRoutes);

app.get("/", (_, res) => {
  res.send("AutoViz API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});