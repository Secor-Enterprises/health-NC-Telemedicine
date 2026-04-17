import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../middleware/error";
import { toRecordDTO } from "../dto";

export const recordsRouter = Router();

recordsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const patientId = String(req.query.patientId || "");
    if (!patientId) throw new HttpError(400, "patientId is required");
    const { sub, role } = req.auth!;
    if (role === "patient" && patientId !== sub) throw new HttpError(403, "Forbidden");

    const items = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(items.map(toRecordDTO));
  } catch (e) {
    next(e);
  }
});

const createSchema = z.object({
  patientId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
});

recordsRouter.post(
  "/",
  requireAuth,
  requireRole("doctor", "admin"),
  async (req, res, next) => {
    try {
      const body = createSchema.parse(req.body);
      const created = await prisma.medicalRecord.create({
        data: { ...body, authorId: req.auth!.sub },
        include: { author: true },
      });
      res.status(201).json(toRecordDTO(created));
    } catch (e) {
      next(e);
    }
  },
);
