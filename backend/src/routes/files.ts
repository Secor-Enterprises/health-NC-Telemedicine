import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { HttpError } from "../middleware/error";
import { toFileDTO } from "../dto";

export const filesRouter = Router();

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]/g, "_");
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 25) * 1024 * 1024 },
});

filesRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const patientId = String(req.query.patientId || "");
    if (!patientId) throw new HttpError(400, "patientId is required");
    const { sub, role } = req.auth!;
    if (role === "patient" && patientId !== sub) throw new HttpError(403, "Forbidden");

    const items = await prisma.medicalFile.findMany({
      where: { patientId },
      orderBy: { uploadedAt: "desc" },
    });
    res.json(items.map(toFileDTO));
  } catch (e) {
    next(e);
  }
});

filesRouter.post("/", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    const patientId = String(req.body.patientId || "");
    if (!patientId) throw new HttpError(400, "patientId is required");
    if (!req.file) throw new HttpError(400, "file is required");

    const { sub, role } = req.auth!;
    if (role === "patient" && patientId !== sub) throw new HttpError(403, "Forbidden");

    const created = await prisma.medicalFile.create({
      data: {
        patientId,
        uploaderId: sub,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        url: `/uploads/${req.file.filename}`,
      },
    });
    res.status(201).json(toFileDTO(created));
  } catch (e) {
    next(e);
  }
});
