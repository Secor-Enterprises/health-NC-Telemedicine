import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { router } from "./routes";
import { fhirRouter } from "./routes/fhir";
import { errorHandler } from "./middleware/error";

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const origins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(helmet());
app.use(cors({ origin: origins.includes("*") ? true : origins, credentials: true }));
app.use(express.json({ limit: "2mb", type: ["application/json", "application/fhir+json"] }));
app.use(morgan("tiny"));
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", router);
app.use("/fhir", fhirRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Caretide API listening on http://localhost:${PORT}`);
  console.log(`   FHIR R4 endpoint: http://localhost:${PORT}/fhir/metadata`);
});
